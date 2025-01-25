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
