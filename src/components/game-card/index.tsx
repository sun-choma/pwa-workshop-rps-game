import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from "react";
import { Box, VStack } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

import { joinClassNames } from "@/utils/common";
import { CardAttribute } from "@/core/game/types";
import { CARD_ATTRIBUTES } from "@/core/game/constants";

import { ATTR_ICONS } from "./constants";
import "./styles.css";

interface GameCardProps
  extends Omit<ComponentPropsWithoutRef<typeof VStack>, "direction"> {
  attr: CardAttribute | undefined | null;
  isSelected?: boolean;
  isHovered?: boolean;
}

export const GameCard = forwardRef<ComponentRef<typeof VStack>, GameCardProps>(
  (
    { className, attr, isSelected, isHovered, ...props }: GameCardProps,
    ref,
  ) => {
    const IconComponent = ATTR_ICONS[attr || CARD_ATTRIBUTES.NONE];

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
);
