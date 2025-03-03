import {
  CARD_ATTRIBUTES,
  GAME_PHASES,
  OUTCOMES,
} from "@/core/game/constants.ts";
import { RematchDecision } from "@/core/game/types";

interface Player {
  name: string;
  emoji: string | undefined;
  lives: number;
  card: CARD_ATTRIBUTES | null | undefined;
  rematchDecision: RematchDecision | null;
  selectedCardIndex: number | null;
  hoveredCardIndex?: number | null;
  isReady?: boolean;
  reactions?: string[];
}

export interface GameContext {
  multiplayerState: "waiting" | "too-long" | "ready";
  game: {
    phase: GAME_PHASES;
    remainingTime: number | null | undefined;
    turnOutcome: OUTCOMES;
  };
  player: Player;
  opponent: Player;
  startMultiplayer: (playerName: string) => void;
  startSingleplayer: (playerName: string) => void;
  cancelGame: () => void;
  hoverCard: (cardIndex: number | null) => void;
  clickCard: (cardIndex: number | null) => void;
  selectCard: (attr: CARD_ATTRIBUTES) => void;
  sendEmoji: (emoji: string) => void;
  chooseRandom: () => void;
  rematch: () => void;
  returnToMenu: () => void;
  skipTurn: () => void;
}
