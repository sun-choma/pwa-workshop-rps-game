import {
  GAME_RESULTS_TIME,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants";
import { SocketEventBus } from "@/core/network/socket-event-bus";
import { Timer } from "@/core/common/timer";
import { EventfulState } from "@/core/common/eventful-state";
import { isStronger } from "@/utils/game";

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
  // TODO: add rematch decision flags for both players
  private core = new EventfulState<GameStateConfig>(
    INITIAL_STATE,
    FIELD_DISPATCH_MAP,
    { verboseLogging: true },
  );
  // Forwarding sub/unsub methods for UI state to subscribe to
  public addEventListener = this.core.addEventListener;
  public addEventListeners = this.core.addEventListeners;
  public removeEventListener = this.core.removeEventListener;
  public removeEventListeners = this.core.removeEventListeners;

  private socketController = new SocketEventBus();

  private timer = new Timer({
    onTick: (remainingTime) => (this.core.state.time = remainingTime / 1000),
  });

  constructor() {
    // Binding public function context
    this.findGame = this.findGame.bind(this);
    this.selectCard = this.selectCard.bind(this);
    this.rematch = this.rematch.bind(this);
    this.returnToMenu = this.returnToMenu.bind(this);

    // Automatic actions on timeout
    this.core.addEventListener("time-change", this.handleTimeout.bind(this));

    // Listening to socket events
    this.socketController.addEventListeners({
      "match-found": this.launchGame.bind(this),
      "hover-card": (cardIndex) =>
        (this.core.state.opponentHoveredIndex = cardIndex),
      "select-card": (cardIndex) =>
        (this.core.state.opponentSelectedIndex = cardIndex),
      "turn-ready": this.opponentTurnReady.bind(this),
      "attr-sent": this.turnResults.bind(this),
      "rematch-decision": this.resetGame.bind(this),
    });
  }

  public findGame(playerName: string) {
    this.core.state.playerName = playerName;
    this.core.state.phase = GAME_PHASES.MATCHING;
    this.socketController.startMatchmaking();
  }

  private launchGame(opponentName: string) {
    this.core.state.opponentName = opponentName;
    this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
    this.timer.run(TURN_TIME);
  }

  public selectCard(attr: CardAttribute) {
    this.core.state.playerCard = attr;
    this.proceedIfBothReady();
  }

  private opponentTurnReady() {
    this.core.state.opponentReady = !this.core.state.opponentReady;
    this.proceedIfBothReady();
  }

  private proceedIfBothReady() {
    if (this.core.state.playerCard !== null && this.core.state.opponentReady) {
      this.socketController.notify("attr-sent", this.core.state.playerCard);
    }
  }

  private handleTimeout() {
    if (this.core.state.time === 0) {
      switch (this.core.state.phase) {
        case GAME_PHASES.PLAYERS_TURN: {
          if (this.core.state.playerCard === null)
            this.selectCard(CARD_ATTRIBUTE.NONE);
          break;
        }
        case GAME_PHASES.TURN_RESULTS:
          if (this.core.state.playerLives && this.core.state.opponentLives) {
            this.core.state.playerCard = null;
            this.core.state.opponentCard = null;
            this.core.state.opponentReady = false;
            this.core.state.opponentSelectedIndex = null;
            this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
            this.socketController.notify("turn-sync");
            this.timer.run(TURN_TIME);
          } else {
            this.core.state.phase = GAME_PHASES.GAME_RESULTS;
            this.timer.run(GAME_RESULTS_TIME);
          }
          break;
        case GAME_PHASES.GAME_RESULTS:
          this.resetGame(REMATCH_DECISION.MAIN_MENU);
          break;
      }
    }
  }

  private turnResults(opponentAttr: CardAttribute) {
    this.core.state.opponentCard = opponentAttr;
    if (this.core.state.playerCard !== null) {
      this.core.state.phase = GAME_PHASES.TURN_RESULTS;
      this.core.state.turnOutcome = isStronger(
        this.core.state.playerCard,
        this.core.state.opponentCard,
      );

      if (this.core.state.turnOutcome === OUTCOME.PLAYER_WON)
        this.core.state.opponentLives -= 1;
      else if (this.core.state.turnOutcome === OUTCOME.OPPONENT_WON)
        this.core.state.playerLives -= 1;

      this.timer.run(TURN_RESULTS_TIME);
    }
  }

  public rematch() {
    this.socketController.notify("rematch-decision", REMATCH_DECISION.REMATCH);
  }

  public returnToMenu() {
    this.socketController.notify(
      "rematch-decision",
      REMATCH_DECISION.MAIN_MENU,
    );
    this.resetGame(REMATCH_DECISION.MAIN_MENU);
  }

  private resetGame(decision: RematchDecision) {
    this.timer.stop();
    this.core.toInitialState(
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
        this.core.state.phase = GAME_PHASES.PLAYERS_TURN;
        this.socketController.notify("turn-sync");
        break;
      case REMATCH_DECISION.FIND_NEW_OPPONENT:
        this.core.toInitialState("opponentName");
        this.core.state.phase = GAME_PHASES.MATCHING;
        break;
      case REMATCH_DECISION.MAIN_MENU:
        this.core.toInitialState("playerName", "opponentName");
        this.core.state.phase = GAME_PHASES.INIT;
        break;
    }
  }
}
