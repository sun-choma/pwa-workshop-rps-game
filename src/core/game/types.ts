export enum GamePhase {
  INIT,
  MATCHING,
  PLAYERS_TURN,
  TURN_RESULTS,
  GAME_RESULTS,
}

export const enum Outcome {
  DRAW = "draw",
  PLAYER_WON = "win",
  OPPONENT_WON = "lose",
}

export const enum RematchDecision {
  REMATCH,
  MAIN_MENU,
}

export const enum CardAttribute {
  NONE,
  ROCK,
  PAPER,
  SCISSORS,
}

export const enum GameMode {
  SINGLEPLAYER,
  MULTIPLAYER,
}

export interface GameStateConfig {
  phase: {
    triggers: "phase-change";
    type: GamePhase;
  };
  time: {
    triggers: "time-change";
    type: number | undefined | null;
  };
  playerName: {
    triggers: "player-name-set";
    type: string;
  };
  playerLives: {
    triggers: "player-lives-change";
    type: number;
  };
  playerCard: {
    triggers: "player-card-change";
    type: CardAttribute | null;
  };
  playerSelectedIndex: {
    triggers: "player-selection-change";
    type: number | null;
  };
  opponentName: {
    triggers: "opponent-name-set";
    type: string;
  };
  opponentLives: {
    triggers: "opponent-lives-change";
    type: number;
  };
  opponentHoveredIndex: {
    triggers: "opponent-hover-change";
    type: number | null;
  };
  opponentSelectedIndex: {
    triggers: "opponent-selection-change";
    type: number | null;
  };
  opponentCard: {
    triggers: "opponent-card-change";
    type: CardAttribute | null;
  };
  opponentReady: {
    triggers: "opponent-ready-change";
    type: boolean;
  };
  turnOutcome: {
    triggers: "outcome";
    type: Outcome;
  };
  playerRematchDecision: {
    triggers: "player-rematch-set";
    type: RematchDecision | null;
  };
  opponentRematchDecision: {
    triggers: "opponent-rematch-set";
    type: RematchDecision | null;
  };
}

export type Value<Key extends keyof GameStateConfig> =
  GameStateConfig[Key]["type"];
