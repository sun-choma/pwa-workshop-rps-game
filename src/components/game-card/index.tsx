import {
  ComponentPropsWithoutRef,
  ComponentRef,
  CSSProperties,
  ElementType,
  forwardRef,
} from "react";
import { Box, HTMLChakraProps, VStack } from "@chakra-ui/react";

import { joinClassNames } from "@/utils/common";
import { CardAttribute } from "@/core/game/types";
import { CARD_ATTRIBUTES } from "@/core/game/constants";

import { ATTR_ICONS } from "./constants";
import "./styles.css";

interface GameCardProps
  extends Omit<ComponentPropsWithoutRef<typeof VStack>, "direction"> {
  index: number;
  direction?: "up" | "down";
  isRotated?: boolean;
  isHighlighted?: boolean;
}

export const GameCard = forwardRef<ComponentRef<typeof VStack>, GameCardProps>(
  (
    {
      className,
      isRotated,
      isHighlighted,
      children,
      index,
      direction = "up",
      ...props
    }: GameCardProps,
    ref,
  ) => (
    <VStack
      ref={ref}
      className={joinClassNames(
        "card-container",
        isRotated && "selected",
        isHighlighted && "hovered",
        className,
      )}
      style={
        {
          "--index": index,
          "--direction": direction === "up" ? "-1" : "1",
        } as CSSProperties
      }
      {...props}
    >
      <VStack className="card">{children}</VStack>
    </VStack>
  ),
);

type CardFrontProps<Element extends ElementType> = {
  children?: CardAttribute | null;
} & Omit<HTMLChakraProps<Element>, "children">;

export function CardFront<Element extends ElementType>({
  className,
  children,
  ...props
}: CardFrontProps<Element>) {
  const IconComponent = ATTR_ICONS[children || CARD_ATTRIBUTES.NONE];

  return (
    <Box
      className={joinClassNames("card-front", className)}
      userSelect="none"
      {...props}
    >
      <IconComponent
        strokeWidth={1}
        style={{ width: "48px", height: "48px" }}
      />
    </Box>
  );
}

export function CardBack({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof Box>) {
  return (
    <Box
      className={joinClassNames("card-back", className)}
      userSelect="none"
      {...props}
    >
      {children}
    </Box>
  );
}
