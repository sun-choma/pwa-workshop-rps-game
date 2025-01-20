import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer() {
  const [time, setTime] = useState<number | null | undefined>(undefined);
  const animFrameRef = useRef(-1);
  const startTimeRef = useRef(0);

  const startTimer = useCallback((seconds: number) => {
    setTime(seconds);
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTime = seconds - elapsed;

      if (newTime > 0 && animFrameRef.current >= 0) {
        setTime(newTime);
        animFrameRef.current = requestAnimationFrame(updateTimer);
      } else {
        setTime(0);
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = -1;
        console.log("Timer cleared automatically!");
      }
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const stopTimer = useCallback(() => {
    if (animFrameRef.current !== -1) {
      setTime(0);
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = -1;
      console.log("Timer cleared manually!");
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return { time, startTimer, stopTimer };
}
