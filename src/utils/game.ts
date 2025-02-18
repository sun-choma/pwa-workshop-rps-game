import { offsetRandom } from "@/utils/math.ts";
import { CARD_ATTRIBUTES, OUTCOMES } from "@/core/game/constants.ts";

export function selectRandomCard() {
  const items = [
    CARD_ATTRIBUTES.ROCK,
    CARD_ATTRIBUTES.PAPER,
    CARD_ATTRIBUTES.SCISSORS,
  ];

  return items[offsetRandom(0, items.length - 1)];
}

export function isStronger(
  attr1: CARD_ATTRIBUTES | undefined,
  attr2: CARD_ATTRIBUTES | undefined,
) {
  if (attr1 === undefined || attr2 === undefined) return OUTCOMES.DRAW;

  // Settle draws
  if (attr1 === attr2) return OUTCOMES.DRAW;
  // Settle "none" options
  if (attr1 === CARD_ATTRIBUTES.NONE || attr2 === CARD_ATTRIBUTES.NONE)
    return attr1 !== CARD_ATTRIBUTES.NONE
      ? OUTCOMES.PLAYER_WON
      : OUTCOMES.OPPONENT_WON;
  // Settle the rest
  return (attr1 - 2 + 3) % 3 === attr2 - 1
    ? OUTCOMES.PLAYER_WON
    : OUTCOMES.OPPONENT_WON;
}
