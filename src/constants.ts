export const enum CARD_ATTRIBUTE {
  NONE,
  ROCK,
  PAPER,
  SCISSORS,
}

export const ATTR_LABELS = {
  [CARD_ATTRIBUTE.NONE]: "",
  [CARD_ATTRIBUTE.ROCK]: "Rock",
  [CARD_ATTRIBUTE.PAPER]: "Paper",
  [CARD_ATTRIBUTE.SCISSORS]: "Scissors",
};

export const enum OUTCOME {
  DRAW,
  PLAYER_WON,
  OPPONENT_WON,
}
