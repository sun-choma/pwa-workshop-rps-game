import { CARD_ATTRIBUTE, GAME_PHASES, OUTCOME } from "@/core/game/constants.ts";
import { RematchDecision } from "@/core/game/types";

interface Player {
  name: string;
  lives: number;
  card: CARD_ATTRIBUTE | null | undefined;
  rematchDecision: RematchDecision | null;
  selectedCardIndex?: number | null;
  hoveredCardIndex?: number | null;
  isReady?: boolean;
}

export interface GameContext {
  game: {
    phase: GAME_PHASES;
    remainingTime: number | null | undefined;
    turnOutcome: OUTCOME;
  };
  player: Player;
  opponent: Player;
  startGame: (playerName: string) => void;
  cancelGame: () => void;
  hoverCard: (cardIndex: number | null) => void;
  clickCard: (cardIndex: number | null) => void;
  selectCard: (attr: CARD_ATTRIBUTE) => void;
  rematch: () => void;
  returnToMenu: () => void;
}
