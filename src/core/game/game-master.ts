import {
  GAME_RESULTS_TIME,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants";
import { GameServerAdapter } from "@/core/network/game-server-adapter";
import { Timer } from "@/core/common/timer";
import { EventfulState } from "@/core/common/eventful-state";
import { isStronger } from "@/utils/game";
import { getRandomEmoji, requestTimeout } from "@/utils/common";
import { merge } from "@/core/common/event-bus/helpers";

import type { CardAttribute, GameStateConfig, RematchDecision } from "./types";
import {
  CARD_ATTRIBUTE,
  FIELD_DISPATCH_MAP,
  GAME_PHASES,
  INITIAL_STATE,
  OUTCOME,
  REMATCH_DECISION,
} from "./constants";

export class GameMaster {
  private state = new EventfulState<GameStateConfig>(
    INITIAL_STATE,
    FIELD_DISPATCH_MAP,
    { verboseLogging: true },
  );
  private serverAdapter = new GameServerAdapter();
  // Forwarding sub/unsub methods for UI state to subscribe to
  public addEventListener = merge.addEventListener(
    this.state.addEventListener,
    this.serverAdapter.addEventListener,
  );
  public addEventListeners = merge.addEventListeners(
    this.state.addEventListeners,
    this.serverAdapter.addEventListeners,
  );
  public removeEventListener = merge.removeEventListener(
    this.state.removeEventListener,
    this.serverAdapter.removeEventListener,
  );
  public removeEventListeners = merge.removeEventListeners(
    this.state.removeEventListeners,
    this.serverAdapter.removeEventListeners,
  );

  private timer = new Timer({
    onTick: (remainingTime) => (this.state.state.time = remainingTime / 1000),
  });

  constructor() {
    // Binding public function context
    // this.findGame = this.findGame.bind(this);
    // this.cancelGame = this.cancelGame.bind(this);
    // this.highlightCard = this.highlightCard.bind(this);
    // this.selectCard = this.selectCard.bind(this);
    // this.confirmCard = this.confirmCard.bind(this);
    // this.rematch = this.rematch.bind(this);
    // this.returnToMenu = this.returnToMenu.bind(this);

    // Logic on timer run out
    this.state.addEventListener("time-change", this.gameFlow.checkForTimeout);

    // Listening to socket events
    this.serverAdapter.addEventListeners({
      "match-found": this.gameResponses.launchGame,
      "turn-start": this.gameResponses.startNewTurn,
      "turn-finished": this.gameResponses.setOpponentReady,
      "hover-card": this.gameResponses.setOpponentHoverIndex,
      "select-card": this.gameResponses.setOpponentSelectionIndex,
      "attr-sent": this.gameResponses.calculateTurnResults,
      "rematch-decision": this.gameResponses.setOpponentDecision,
    });
  }

  public actions = {
    common: {
      findGame: (playerName: string) => {
        const fullName = `${getRandomEmoji()} ${playerName}`;

        this.state.state.playerName = fullName;
        this.state.state.phase = GAME_PHASES.MATCHING;
        this.serverAdapter.startMatchmaking(fullName);
      },
      exitGame: () => {
        this.serverAdapter.disconnect();
        this.gameFlow.resetGame(REMATCH_DECISION.MAIN_MENU);
      },
    },
    match: {
      highlightCard: (cardIndex: number | null) => {
        this.serverAdapter.send("hover-card", cardIndex);
      },
      selectCard: (cardIndex: number | null) => {
        this.serverAdapter.send("select-card", cardIndex);
      },
      confirmCard: (attr: CardAttribute) => {
        this.state.state.playerCard = attr;
        this.serverAdapter.send("turn-finished");
        this.gameFlow.proceedIfBothReady();
      },
    },
    gameEnd: {
      rematch: () => {
        this.state.state.playerRematchDecision = REMATCH_DECISION.REMATCH;
        this.serverAdapter.send("rematch-decision", REMATCH_DECISION.REMATCH);
      },
      returnToMenu: () => {
        this.state.state.playerRematchDecision = REMATCH_DECISION.MAIN_MENU;
        this.serverAdapter.send("rematch-decision", REMATCH_DECISION.MAIN_MENU);

        // TODO: decide on main menu click flow
        this.serverAdapter.disconnect();
        requestTimeout(
          () => this.gameFlow.resetGame(REMATCH_DECISION.MAIN_MENU),
          3000,
        );
        // this.resetGame(REMATCH_DECISION.MAIN_MENU);
      },
    },
  };

  private gameResponses = {
    launchGame: (opponentName: string) => {
      this.state.state.opponentName = opponentName;
      this.state.state.phase = GAME_PHASES.PLAYERS_TURN;
      this.timer.run(TURN_TIME);
    },
    setOpponentHoverIndex: (cardIndex: number | null) =>
      (this.state.state.opponentHoveredIndex = cardIndex),
    setOpponentSelectionIndex: (cardIndex: number | null) =>
      (this.state.state.opponentSelectedIndex = cardIndex),
    setOpponentReady: () => {
      this.state.state.opponentReady = !this.state.state.opponentReady;
      this.gameFlow.proceedIfBothReady();
    },
    // FIXME: I have an idea of moving logic related parts to gameFlow,
    //  while making this object purely for setters (setting argument to state and changing game phase)
    calculateTurnResults: (opponentAttr: CardAttribute) => {
      this.state.state.opponentCard = opponentAttr;
      if (this.state.state.playerCard !== null) {
        this.state.state.phase = GAME_PHASES.TURN_RESULTS;
        this.state.state.turnOutcome = isStronger(
          this.state.state.playerCard,
          this.state.state.opponentCard,
        );

        if (this.state.state.turnOutcome === OUTCOME.PLAYER_WON)
          this.state.state.opponentLives -= 1;
        else if (this.state.state.turnOutcome === OUTCOME.OPPONENT_WON)
          this.state.state.playerLives -= 1;

        this.timer.run(TURN_RESULTS_TIME);
      }
    },
    // TODO: if refactoring code above is easy, resetting turn on server event seems problematic?
    //  but actually, it may be even better. I could get rid of all timer runners tie them to phase change.
    //  This way setting TURN_PHASE via server event automatically means running turn timer and resetting players selection
    startNewTurn: () => {
      this.state.state.playerCard = null;
      this.state.state.opponentCard = null;
      this.state.state.opponentReady = false;
      this.state.state.opponentSelectedIndex = null;
      this.state.state.phase = GAME_PHASES.PLAYERS_TURN;
      this.timer.run(TURN_TIME);
    },
    setOpponentDecision: (decision: RematchDecision) =>
      (this.state.state.opponentRematchDecision = decision),
  };

  private gameFlow = {
    proceedIfBothReady: () => {
      if (
        this.state.state.playerCard !== null &&
        this.state.state.opponentReady
      )
        this.serverAdapter.send("attr-sent", this.state.state.playerCard);
    },
    checkForTimeout: () => {
      if (this.state.state.time === 0) {
        switch (this.state.state.phase) {
          case GAME_PHASES.PLAYERS_TURN: {
            if (this.state.state.playerCard === null) {
              this.actions.match.confirmCard(CARD_ATTRIBUTE.NONE);
              this.serverAdapter.send("hover-card", null);
            }
            break;
          }
          case GAME_PHASES.TURN_RESULTS:
            if (
              this.state.state.playerLives &&
              this.state.state.opponentLives
            ) {
              this.serverAdapter.send("turn-start");
            } else {
              this.state.state.phase = GAME_PHASES.GAME_RESULTS;
              this.timer.run(GAME_RESULTS_TIME);
            }
            break;
          case GAME_PHASES.GAME_RESULTS:
            this.gameFlow.resetGame(REMATCH_DECISION.MAIN_MENU);
            break;
        }
      }
    },
    resetGame: (decision: RematchDecision) => {
      this.timer.stop();
      this.state.reset(
        "turnOutcome",
        "playerCard",
        "playerLives",
        "opponentCard",
        "opponentSelectedIndex",
        "opponentHoveredIndex",
        "opponentReady",
        "opponentLives",
      );

      switch (decision) {
        case REMATCH_DECISION.REMATCH:
          this.timer.run(TURN_TIME);
          this.state.state.phase = GAME_PHASES.PLAYERS_TURN;
          break;
        case REMATCH_DECISION.MAIN_MENU:
          this.state.reset("playerName", "opponentName");
          this.state.state.phase = GAME_PHASES.INIT;
          break;
      }
    },
  };
}
