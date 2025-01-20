import { ReactNode } from "react";
import { CARD_ATTRIBUTE, OUTCOME } from "@/constants.ts";

export function joinClassNames(...classNames: unknown[]) {
  return classNames.filter((className) => !!className).join(" ");
}

export function nodeArray<Node extends ReactNode>(params: {
  length: number;
  item: (index: number) => Node;
}) {
  return Array(params.length)
    .fill(undefined)
    .map((_, index) => params.item(index));
}

export function offsetRandom(
  min: number,
  max: number,
  offset = 0,
  shouldRound = true,
) {
  if (min > max) {
    throw new Error("Minimum must be less than maximum.");
  }

  const _offset = Math.min(1, Math.max(-1, offset));
  const initialRange = max - min;

  const adjustedRange = initialRange * (1 - Math.abs(_offset) * (1 / 3));
  const randomNumber = Math.random() * adjustedRange;

  const value = _offset < 0 ? min + randomNumber : max - randomNumber;
  return shouldRound ? Math.round(value) : value;
}

export function randomSum(value: number, min = 1) {
  let leftover = value;
  const sum: number[] = [];

  while (leftover / 2 > min) {
    const currentValue = offsetRandom(min, leftover / 2, -1, false);
    sum.push(currentValue);
    leftover -= currentValue;
  }
  sum.push(leftover);
  return sum;
}

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

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
