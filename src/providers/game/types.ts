import { CARD_ATTRIBUTE, GAME_PHASES, OUTCOME } from "@/core/game/constants.ts";

interface Player {
  name: string;
  lives: number;
  card: CARD_ATTRIBUTE | null | undefined;
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
  selectCard: (attr: CARD_ATTRIBUTE) => void;
  rematch: () => void;
  returnToMenu: () => void;
}
