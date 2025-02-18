import {
  MountainIcon,
  ScissorsIcon,
  StickyNoteIcon,
  SquareDashed,
} from "lucide-react";
import { CARD_ATTRIBUTES } from "@/core/game/constants.ts";
import { CardAttribute } from "@/core/game/types.ts";

export const ATTR_ICONS: Record<CardAttribute, typeof MountainIcon> = {
  [CARD_ATTRIBUTES.ROCK]: MountainIcon,
  [CARD_ATTRIBUTES.PAPER]: StickyNoteIcon,
  [CARD_ATTRIBUTES.SCISSORS]: ScissorsIcon,
  [CARD_ATTRIBUTES.NONE]: SquareDashed,
};
