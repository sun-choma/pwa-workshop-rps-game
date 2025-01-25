import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";

import { motion } from "motion/react";
import { Box, VStack } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";
import { joinClassNames } from "@/utils/common.ts";
import { CardAttribute } from "@/core/game/types.ts";
import { CARD_ATTRIBUTE } from "@/core/game/constants.ts";

import "./style.css";
import { ATTR_ICONS } from "./constants.ts";

interface GameCardProps
  extends Omit<ComponentPropsWithoutRef<typeof VStack>, "direction"> {
  attr: CardAttribute | undefined | null;
  isSelected?: boolean;
  isHovered?: boolean;
}

export const GameCard = motion.create(
  forwardRef<ComponentRef<typeof VStack>, GameCardProps>(
    (
      { className, attr, isSelected, isHovered, ...props }: GameCardProps,
      ref,
    ) => {
      const IconComponent = ATTR_ICONS[attr || CARD_ATTRIBUTE.NONE];

      return (
        <VStack
          ref={ref}
          className={joinClassNames(
            "card-container",
            isSelected && "selected",
            isHovered && "hovered",
            className,
          )}
          {...props}
        >
          <VStack className="card">
            <Box className="card-front">
              <IconComponent strokeWidth={1} />
            </Box>
            <div className="card-back">
              <CheckIcon strokeWidth={1} />
            </div>
          </VStack>
        </VStack>
      );
    },
  ),
);
