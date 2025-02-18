import { MAX_LIVES } from "@/providers/game/constants";
import * as Eventful from "@/core/common/eventful-state/types";

import { GamePhase, GameStateConfig, Outcome } from "./types";

export {
  GamePhase as GAME_PHASES,
  Outcome as OUTCOMES,
  RematchDecision as REMATCH_DECISIONS,
  CardAttribute as CARD_ATTRIBUTES,
  GameMode as GAME_MODES,
} from "./types";

export const INITIAL_STATE: Eventful.State<GameStateConfig> = {
  phase: GamePhase.INIT,
  time: undefined,
  turnOutcome: Outcome.DRAW,

  playerName: "",
  playerLives: MAX_LIVES,
  playerCard: null,
  playerSelectedIndex: null,
  playerRematchDecision: null,

  opponentName: "",
  opponentLives: MAX_LIVES,
  opponentCard: null,
  opponentHoveredIndex: null,
  opponentSelectedIndex: null,
  opponentReady: false,
  opponentRematchDecision: null,
};

export const FIELD_DISPATCH_MAP: Record<
  keyof Eventful.State<GameStateConfig>,
  keyof Eventful.EventMap<GameStateConfig>
> = {
  phase: "phase-change",
  time: "time-change",
  turnOutcome: "outcome",

  playerName: "player-name-set",
  playerCard: "player-card-change",
  playerSelectedIndex: "player-selection-change",
  playerLives: "player-lives-change",
  playerRematchDecision: "player-rematch-set",

  opponentName: "opponent-name-set",
  opponentLives: "opponent-lives-change",
  opponentHoveredIndex: "opponent-hover-change",
  opponentSelectedIndex: "opponent-selection-change",
  opponentCard: "opponent-card-change",
  opponentReady: "opponent-ready-change",
  opponentRematchDecision: "opponent-rematch-set",
};
