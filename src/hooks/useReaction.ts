import { useCallback, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export function useReaction() {
  const [emoji, setEmoji] = useState<string[]>([]);
  const cleanup = useCallback(() => setEmoji([]), []);
  const debouncedCleanup = useDebounce(cleanup, 4000);

  const addReaction = useCallback(
    (emoji: string) => {
      setEmoji((prev) => [...prev, emoji]);
      debouncedCleanup();
    },
    [debouncedCleanup],
  );

  return { emoji, addReaction };
}
