import { useCallback, useMemo } from "react";
import { emojiBlast } from "emoji-blast";

import { useGame } from "@/providers/game/useGame";
import { OUTCOMES } from "@/core/game/constants";
import { useDimensions } from "@/hooks/useDimensions";

import { EMOJI_CONFIG_BASE, EMOJI_SETS } from "./constants";

export function useEmojiBlast() {
  const { dimensions } = useDimensions();

  const {
    game: { turnOutcome },
  } = useGame();

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
