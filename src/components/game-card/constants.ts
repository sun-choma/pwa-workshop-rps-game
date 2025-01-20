import {
  MountainIcon,
  ScissorsIcon,
  StickyNoteIcon,
  SquareDashed,
} from "lucide-react";

import { CARD_ATTRIBUTE } from "@/constants.ts";

export const ATTR_ICONS: Record<CARD_ATTRIBUTE, typeof MountainIcon> = {
  [CARD_ATTRIBUTE.ROCK]: MountainIcon,
  [CARD_ATTRIBUTE.PAPER]: StickyNoteIcon,
  [CARD_ATTRIBUTE.SCISSORS]: ScissorsIcon,
  [CARD_ATTRIBUTE.NONE]: SquareDashed,
};
