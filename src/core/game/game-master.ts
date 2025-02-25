import {
  GAME_RESULTS_TIME,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants";
import { Timer } from "@/core/common/timer";
import { EventfulState } from "@/core/common/eventful-state";
import { merge } from "@/core/common/event-bus/helpers";
import { SessionManager } from "@/core/network/session-manager";
import { isStronger } from "@/utils/game";
import { getRandomEmoji } from "@/utils/common";

import type { CardAttribute, GameStateConfig, RematchDecision } from "./types";
import {
  CARD_ATTRIBUTES,
  FIELD_DISPATCH_MAP,
  GAME_MODES,
  GAME_PHASES,
  INITIAL_STATE,
  OUTCOMES,
  REMATCH_DECISIONS,
} from "./constants";

export class GameMaster {
  private core = new EventfulState<GameStateConfig>(
    INITIAL_STATE,
    FIELD_DISPATCH_MAP,
    // { verboseLogging: true },
  );
  private session = new SessionManager();

  // Forwarding sub/unsub methods for UI core to subscribe to
  public addEventListener = merge.addEventListener(
    this.core.addEventListener,
    this.session.addEventListener,
  );
  public addEventListeners = merge.addEventListeners(
    this.core.addEventListeners,
    this.session.addEventListeners,
  );
  public removeEventListener = merge.removeEventListener(
    this.core.removeEventListener,
    this.session.removeEventListener,
  );
  public removeEventListeners = merge.removeEventListeners(
    this.core.removeEventListeners,
    this.session.removeEventListeners,
  );

  private timer = new Timer({
    onTick: (remainingTime) => (this.core.state.time = remainingTime / 1000),
    maxFps: 8,
  });

  constructor() {
    // Logic on timer run out
    this.core.addEventListener("time-change", this.gameFlow.checkForTimeout);
    // Logic on phase change
    this.core.addEventListener("phase-change", this.gameFlow.runPhase);

    // Responding to socket events
    this.session.addEventListeners({
      "match-found": this.stateSetters.setOpponent,
      "turn-start": this.stateSetters.setTurnPhase,
      "turn-finished": this.stateSetters.setOpponentReady,
      "hover-card": this.stateSetters.setOpponentHoverIndex,
      "select-card": this.stateSetters.setOpponentSelectionIndex,
      "attr-sent": this.stateSetters.setOpponentCard,
      "rematch-decision": this.stateSetters.setOpponentDecision,
      rematch: this.stateSetters.resetTurn,
    });
  }

  public actions = {
    common: {
      startMultiplayer: (playerName: string) => {
        const fullName = this.gameFlow.setPlayer(playerName);
        this.session.launch(fullName, GAME_MODES.MULTIPLAYER);
      },
      startSingleplayer: (playerName: string) => {
        const fullName = this.gameFlow.setPlayer(playerName);
        this.session.launch(fullName, GAME_MODES.SINGLEPLAYER);
      },
      exitGame: () => {
        this.session.suspend();
        this.gameFlow.resetGame(REMATCH_DECISIONS.MAIN_MENU);
      },
    },
    match: {
      highlightCard: (cardIndex: number | null) => {
        this.session.send("hover-card", cardIndex);
      },
      selectCard: (cardIndex: number | null) => {
        this.session.send("select-card", cardIndex);
        this.core.state.playerSelectedIndex = cardIndex;
      },
      confirmCard: (attr: CardAttribute) => {
        this.core.state.playerCard = attr;
        this.session.send("turn-finished");
        this.gameFlow.proceedIfBothReady();
      },
    },
    gameEnd: {
      rematch: () => {
        this.core.state.playerRematchDecision = REMATCH_DECISIONS.REMATCH;
        this.session.send("rematch-decision", REMATCH_DECISIONS.REMATCH);
      },
      returnToMenu: () => {
        this.core.state.playerRematchDecision = REMATCH_DECISIONS.MAIN_MENU;
        this.session.send("rematch-decision", REMATCH_DECISIONS.MAIN_MENU);

        this.session.suspend();
        this.gameFlow.resetGame(REMATCH_DECISIONS.MAIN_MENU);
      },
    },
  };

  private stateSetters = {
    setOpponent: (opponentName: string) => {
      this.core.state.opponentName = opponentName;
      this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
    },
    setOpponentHoverIndex: (cardIndex: number | null) =>
      (this.core.state.opponentHoveredIndex = cardIndex),
    setOpponentSelectionIndex: (cardIndex: number | null) =>
      (this.core.state.opponentSelectedIndex = cardIndex),
    setOpponentReady: () => {
      this.core.state.opponentReady = !this.core.state.opponentReady;
      this.gameFlow.proceedIfBothReady();
    },
    setOpponentCard: (opponentAttr: CardAttribute) => {
      this.core.state.opponentCard = opponentAttr;
      this.core.state.phase = GAME_PHASES.TURN_RESULTS;
    },
    setTurnPhase: () => (this.core.state.phase = GAME_PHASES.PLAYERS_TURN),
    setOpponentDecision: (decision: RematchDecision) =>
      (this.core.state.opponentRematchDecision = decision),
    resetTurn: () => {
      this.core.reset(
        "playerLives",
        "opponentLives",
        "playerRematchDecision",
        "opponentRematchDecision",
      );
      this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
    },
  };

  private gameFlow = {
    setPlayer: (playerName: string) => {
      const fullName = `${getRandomEmoji()} ${playerName}`;
      this.core.state.playerName = fullName;
      this.core.state.phase = GAME_PHASES.MATCHING;
      return fullName;
    },
    runPhase: () => {
      switch (this.core.state.phase) {
        case GAME_PHASES.PLAYERS_TURN:
          this.core.reset(
            "playerCard",
            "playerSelectedIndex",
            "opponentCard",
            "opponentReady",
            "opponentSelectedIndex",
          );
          this.timer.run(TURN_TIME);
          break;
        case GAME_PHASES.TURN_RESULTS:
          this.timer.run(TURN_RESULTS_TIME);
          if (
            this.core.state.playerCard !== null &&
            this.core.state.opponentCard != null
          ) {
            this.core.state.phase = GAME_PHASES.TURN_RESULTS;
            this.core.state.turnOutcome = isStronger(
              this.core.state.playerCard,
              this.core.state.opponentCard,
            );

            if (this.core.state.turnOutcome === OUTCOMES.PLAYER_WON)
              this.core.state.opponentLives -= 1;
            else if (this.core.state.turnOutcome === OUTCOMES.OPPONENT_WON)
              this.core.state.playerLives -= 1;

            this.timer.run(TURN_RESULTS_TIME);
          }
          break;
        case GAME_PHASES.GAME_RESULTS:
          this.timer.run(GAME_RESULTS_TIME);
          break;
      }
    },
    proceedIfBothReady: () => {
      if (this.core.state.playerCard !== null && this.core.state.opponentReady)
        this.session.send("attr-sent", this.core.state.playerCard);
    },
    checkForTimeout: () => {
      if (this.core.state.time === 0) {
        switch (this.core.state.phase) {
          case GAME_PHASES.PLAYERS_TURN: {
            if (this.core.state.playerCard === null) {
              this.actions.match.confirmCard(CARD_ATTRIBUTES.NONE);
              this.session.send("hover-card", null);
            }
            break;
          }
          case GAME_PHASES.TURN_RESULTS:
            if (this.core.state.playerLives && this.core.state.opponentLives)
              this.session.send("turn-start");
            else this.core.state.phase = GAME_PHASES.GAME_RESULTS;
            break;
          case GAME_PHASES.GAME_RESULTS:
            this.gameFlow.resetGame(REMATCH_DECISIONS.MAIN_MENU);
            break;
        }
      }
    },
    resetGame: (decision: RematchDecision) => {
      this.timer.stop();
      this.core.reset(
        "turnOutcome",
        "playerCard",
        "playerSelectedIndex",
        "playerLives",
        "playerRematchDecision",
        "opponentCard",
        "opponentSelectedIndex",
        "opponentHoveredIndex",
        "opponentReady",
        "opponentLives",
        "opponentRematchDecision",
      );

      switch (decision) {
        case REMATCH_DECISIONS.REMATCH:
          this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
          break;
        case REMATCH_DECISIONS.MAIN_MENU:
          this.core.reset("playerName", "opponentName");
          this.core.state.phase = GAME_PHASES.INIT;
          break;
      }
    },
  };
}
