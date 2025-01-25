import { offsetRandom } from "@/utils/math.ts";
import { CARD_ATTRIBUTE, OUTCOME } from "@/core/game/constants.ts";

export function selectRandomCard() {
  const items = [
    CARD_ATTRIBUTE.ROCK,
    CARD_ATTRIBUTE.PAPER,
    CARD_ATTRIBUTE.SCISSORS,
  ];

  return items[offsetRandom(0, items.length - 1)];
}

export function isStronger(
  attr1: CARD_ATTRIBUTE | undefined,
  attr2: CARD_ATTRIBUTE | undefined,
) {
  if (attr1 === undefined || attr2 === undefined) return OUTCOME.DRAW;

  // Settle draws
  if (attr1 === attr2) return OUTCOME.DRAW;
  // Settle "none" options
  if (attr1 === CARD_ATTRIBUTE.NONE || attr2 === CARD_ATTRIBUTE.NONE)
    return attr1 !== CARD_ATTRIBUTE.NONE
      ? OUTCOME.PLAYER_WON
      : OUTCOME.OPPONENT_WON;
  // Settle the rest
  return (attr1 - 2 + 3) % 3 === attr2 - 1
    ? OUTCOME.PLAYER_WON
    : OUTCOME.OPPONENT_WON;
}
