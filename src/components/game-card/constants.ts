import {
  MountainIcon,
  ScissorsIcon,
  StickyNoteIcon,
  SquareDashed,
} from "lucide-react";
import { CARD_ATTRIBUTE } from "@/core/game/constants.ts";
import { CardAttribute } from "@/core/game/types.ts";

export const ATTR_ICONS: Record<CardAttribute, typeof MountainIcon> = {
  [CARD_ATTRIBUTE.ROCK]: MountainIcon,
  [CARD_ATTRIBUTE.PAPER]: StickyNoteIcon,
  [CARD_ATTRIBUTE.SCISSORS]: ScissorsIcon,
  [CARD_ATTRIBUTE.NONE]: SquareDashed,
};
