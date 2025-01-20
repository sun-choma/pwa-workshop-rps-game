import { CARD_ATTRIBUTE, OUTCOME } from "@/constants.ts";

export enum GAME_PHASES {
  INIT,
  MATCHING,
  PLAYERS_TURN,
  TURN_RESULTS,
  GAME_RESULTS,
}

interface Player {
  name: string;
  lives: number;
  card: CARD_ATTRIBUTE | undefined;
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
  startMatchmaking: (playerName: string) => void;
  selectCard: (attr: CARD_ATTRIBUTE) => void;
}
