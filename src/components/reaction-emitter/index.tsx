import { Box, HStack } from "@chakra-ui/react";
import { ComponentPropsWithoutRef } from "react";

import "./styles.css";
import { joinClassNames } from "@/utils/common";

interface EmojiEmitterProps
  extends Omit<ComponentPropsWithoutRef<typeof HStack>, "direction"> {
  children?: string[];
  direction?: "up" | "down";
}

export function ReactionEmitter({
  children,
  direction = "up",
  ...props
}: EmojiEmitterProps) {
  return (
    <HStack
      position="fixed"
      left="0"
      right="0"
      textAlign="left"
      userSelect="none"
      zIndex="10"
      overflow="visible"
      {...props}
    >
      <Box
        position="relative"
        w="full"
        maxW="calc(var(--thick-square-size) * 4.5)"
        mx="auto"
      >
        {children?.map((emoji, index) => (
          <span
            key={`${emoji}-${index}`}
            className={joinClassNames("reaction", direction)}
          >
            {emoji}
          </span>
        ))}
      </Box>
    </HStack>
  );
}
