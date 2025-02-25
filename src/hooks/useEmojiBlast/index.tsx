import { useCallback, useEffect, useMemo, useState } from "react";
import { emojiBlast } from "emoji-blast";

import { useGame } from "@/providers/game/useGame";
import { OUTCOMES } from "@/core/game/constants";

import { EMOJI_CONFIG_BASE, EMOJI_SETS } from "./constants";

export function useEmojiBlast() {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: window.innerWidth, height: window.innerHeight });

  const {
    game: { turnOutcome },
  } = useGame();

  useEffect(() => {
    const resizeHandler = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const emojiConfig = useMemo(() => {
    if (turnOutcome === OUTCOMES.DRAW) {
      return undefined;
    } else {
      return {
        ...EMOJI_CONFIG_BASE,
        emojis: EMOJI_SETS[turnOutcome],
        position: {
          x: dimensions.width / 2,
          y: 0,
        },
      };
    }
  }, [turnOutcome, dimensions]);

  const blast = useCallback(() => emojiBlast(emojiConfig), [emojiConfig]);

  return { blast };
}
