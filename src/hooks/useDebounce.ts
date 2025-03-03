import { useCallback, useRef } from "react";

export function useDebounce<
  Func extends (...args: Parameters<Func>) => ReturnType<Func>,
>(func: Func, delay: number): Func {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<Func>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => func(...args), delay);
    },
    [func, delay],
  );

  return debouncedFunction as Func;
}
