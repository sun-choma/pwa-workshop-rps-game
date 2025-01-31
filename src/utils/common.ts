import { ReactNode } from "react";

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

type Callback = () => void;
type CallbackObject = {
  onTick?: (remainingTime: number) => void;
  onTimeout?: () => void;
};

export function requestTimeout(fn: Callback | CallbackObject, delayMs = 0) {
  let startTime: number;
  const runtimeObj: {
    animationFrameId: number | null;
  } = {
    animationFrameId: null,
  };

  const isObject = typeof fn === "object";

  function frameCallback(timestamp: number) {
    if (!startTime) startTime = timestamp;
    if (runtimeObj.animationFrameId) {
      if (isObject) fn.onTick?.(Math.max(delayMs - (timestamp - startTime), 0));

      if (timestamp - startTime >= delayMs) {
        if (isObject) fn.onTimeout?.();
        else fn();
        cancelAnimationFrame(runtimeObj.animationFrameId);
        runtimeObj.animationFrameId = null;
      } else if (runtimeObj.animationFrameId)
        runtimeObj.animationFrameId = requestAnimationFrame(frameCallback);
    }
  }

  runtimeObj.animationFrameId = requestAnimationFrame(frameCallback);
  return runtimeObj;
}

export function cancelTimeout(runtime: { animationFrameId: number | null }) {
  if (runtime.animationFrameId !== null) {
    cancelAnimationFrame(runtime.animationFrameId);
    runtime.animationFrameId = null;
  }
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TupleArray<Obj> = {
  [K in keyof Obj]: [K, Obj[K]];
}[keyof Obj][];

export function entries<Object extends object>(
  obj: Object,
): TupleArray<Object> {
  return Object.entries(obj).map(
    ([key, value]) => [key, value] as unknown as TupleArray<Object>[number],
  );
}

export function shuffle<Item>(array: Item[]): Item[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function getRandomEmoji() {
  const [start, end] = [0x1f600, 0x1f64f];
  const randomCodePoint = Math.floor(Math.random() * (end - start + 1)) + start;
  return String.fromCodePoint(randomCodePoint);
}

// function debounce<Func extends (...args: unknown[]) => void>(
//   func: Func,
//   delay: number,
// ): (...args: Parameters<Func>) => void {
//   let timeout: ReturnType<typeof requestTimeout> | undefined;
//
//   return function (...args: Parameters<Func>) {
//     if (timeout?.animationFrameId) {
//       cancelTimeout(timeout);
//     }
//
//     timeout = requestTimeout(() => {
//       func(...args);
//     }, delay);
//   };
// }
