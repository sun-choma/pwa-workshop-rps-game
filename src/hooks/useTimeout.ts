import { useEffect, useRef, useCallback } from "react";

export function useTimeout() {
  const animFrameRef = useRef(-1);
  const startTimeRef = useRef(0);

  const startTimeout = useCallback((seconds: number, callback: () => void) => {
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTime = seconds - elapsed;

      if (newTime <= 0 && animFrameRef.current !== -1) {
        animFrameRef.current = -1;
        callback();
      }

      if (newTime >= 0 && animFrameRef.current >= 0) {
        animFrameRef.current = requestAnimationFrame(updateTimer);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const cancelTimeout = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = -1;
  }, []);

  useEffect(() => {
    return () => {
      cancelTimeout();
    };
  }, [cancelTimeout]);

  return { startTimeout, cancelTimeout };
}
