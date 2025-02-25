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
export type TimeoutConfig = {
  onTick?: (remainingTime: number) => void;
  onTimeout?: () => void;
};

export function requestTimeout(
  fn: Callback | TimeoutConfig,
  delayMs = 0,
  maxFps = Infinity,
) {
  const runtimeObj: {
    animationFrameId: number | null;
  } = {
    animationFrameId: null,
  };

  let startTime: number;
  let lastExecutedTimestamp: number;

  const isConfig = typeof fn === "object";

  const tick = (time: number) => isConfig && fn.onTick?.(time);
  const timeout = () => (isConfig ? fn.onTimeout?.() : fn());

  function frameCallback(timestamp: number) {
    if (!startTime) {
      startTime = timestamp;
      lastExecutedTimestamp = timestamp;
    }

    const factor = 0.1 * (maxFps / 60);
    const adjustedMaxFps = maxFps + maxFps * factor;
    const currentFramerate = 1000 / (timestamp - lastExecutedTimestamp);

    const shouldThrottle =
      isFinite(currentFramerate) && currentFramerate > adjustedMaxFps;
    const shouldRequestFrame =
      shouldThrottle || timestamp - startTime < delayMs;
    const shouldRunCallback =
      !shouldThrottle && runtimeObj.animationFrameId !== null;

    const remainingTime = Math.max(delayMs - (timestamp - startTime), 0);

    if (!shouldThrottle) lastExecutedTimestamp = timestamp;

    // just a regular tick of animation, executed on every update (including last one)
    if (shouldRunCallback) tick(remainingTime);

    if (shouldRequestFrame) {
      runtimeObj.animationFrameId = requestAnimationFrame(frameCallback);
    } else {
      if (runtimeObj.animationFrameId)
        cancelAnimationFrame(runtimeObj.animationFrameId);
      runtimeObj.animationFrameId = null;

      // animation wasn't stopped manually, so this is the last frame of animation
      if (shouldRunCallback) timeout();
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

export function msToObject(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor(ms / (1000 * 60 * 60));

  return { seconds, minutes, hours };
}
