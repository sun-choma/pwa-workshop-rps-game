import type { Outcome } from "@/core/game/types";
import { GAME_PHASES, OUTCOMES } from "@/core/game/constants";
import {
  GAME_RESULTS_TIME,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants";

export const TURN_RESULT_LABELS: Record<Outcome, string> = {
  [OUTCOMES.DRAW]: "🤝",
  [OUTCOMES.PLAYER_WON]: "✅",
  [OUTCOMES.OPPONENT_WON]: "❌",
};

export const GAME_RESULT_LABELS = {
  WIN: "🎉",
  LOSE: "😭",
};

export const TIMER_PHASES = [
  GAME_PHASES.PLAYERS_TURN,
  GAME_PHASES.TURN_RESULTS,
  GAME_PHASES.GAME_RESULTS,
];

export const PHASE_MAX_TIME = {
  [GAME_PHASES.PLAYERS_TURN]: TURN_TIME,
  [GAME_PHASES.TURN_RESULTS]: TURN_RESULTS_TIME,
  [GAME_PHASES.GAME_RESULTS]: GAME_RESULTS_TIME,
};
