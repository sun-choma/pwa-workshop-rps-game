import { OUTCOMES } from "@/core/game/constants";

export const EMOJI_SETS = {
  [OUTCOMES.PLAYER_WON]: [
    "🏆",
    "🎉",
    "🥇",
    "🙌",
    "🎯",
    "💪",
    "🔥",
    "🏅",
    "🎊",
    "🥳",
    "✨",
    "🎉",
  ],
  [OUTCOMES.OPPONENT_WON]: ["😔", "😢", "😭", "💔", "😞"],
};

export const EMOJI_CONFIG_BASE = {
  physics: {
    gravity: 0,
    initialVelocities: {
      x: { min: -15, max: 15 },
      y: { min: -15, max: 15 },
    },
  },
};
