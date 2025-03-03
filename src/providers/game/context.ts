import { createContext } from "react";

import { GameContext } from "@/providers/game/types";
import { MAX_LIVES, TURN_TIME } from "@/providers/game/constants";
import {
  CARD_ATTRIBUTES,
  GAME_PHASES,
  OUTCOMES,
} from "@/core/game/constants.ts";

export const Context = createContext<GameContext>({
  multiplayerState: "waiting",
  game: {
    phase: GAME_PHASES.INIT,
    remainingTime: TURN_TIME,
    turnOutcome: OUTCOMES.DRAW,
  },
  player: {
    name: "Player 1",
    emoji: "😱",
    card: CARD_ATTRIBUTES.NONE,
    lives: MAX_LIVES,
    rematchDecision: null,
    selectedCardIndex: null,
  },
  opponent: {
    name: "Player 2",
    emoji: "😱",
    card: CARD_ATTRIBUTES.NONE,
    hoveredCardIndex: null,
    selectedCardIndex: null,
    lives: MAX_LIVES,
    rematchDecision: null,
    reactions: [],
  },
  startSingleplayer: () => {},
  startMultiplayer: () => {},
  cancelGame: () => {},
  hoverCard: () => {},
  clickCard: () => {},
  selectCard: () => {},
  sendEmoji: () => {},
  skipTurn: () => {},
  chooseRandom: () => {},
  rematch: () => {},
  returnToMenu: () => {},
});
