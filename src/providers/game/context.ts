import { createContext } from "react";

import { GameContext } from "@/providers/game/types";
import { MAX_LIVES, TURN_TIME } from "@/providers/game/constants";
import { CARD_ATTRIBUTE, GAME_PHASES, OUTCOME } from "@/core/game/constants.ts";

export const Context = createContext<GameContext>({
  game: {
    phase: GAME_PHASES.INIT,
    remainingTime: TURN_TIME,
    turnOutcome: OUTCOME.DRAW,
  },
  player: {
    name: "Player 1",
    card: CARD_ATTRIBUTE.NONE,
    lives: MAX_LIVES,
  },
  opponent: {
    name: "Player 2",
    card: CARD_ATTRIBUTE.NONE,
    hoveredCardIndex: null,
    selectedCardIndex: null,
    lives: MAX_LIVES,
  },
  startGame: () => {},
  selectCard: () => {},
  rematch: () => {},
  returnToMenu: () => {},
});
