import { ComponentPropsWithoutRef } from "react";
import { Box, HStack, Presence } from "@chakra-ui/react";

import { useGame } from "@/providers/game/useGame";
import { RematchDecision } from "@/core/game/types";

interface DecisionContainer extends ComponentPropsWithoutRef<typeof HStack> {
  value: RematchDecision;
}

export function DecisionContainer({
  children,
  value: targetDecision,
  ...props
}: DecisionContainer) {
  const { player, opponent } = useGame();

  return (
    <HStack
      position="relative"
      justifyContent="center"
      gap="var(--thin-square-size)"
      h="full"
      {...props}
    >
      <Box
        w="calc(var(--thin-square-size) * 3)"
        h="calc(var(--thin-square-size) * 3)"
      >
        <Presence
          fontSize="calc(var(--thin-square-size) * 2)"
          present={player.rematchDecision === targetDecision}
          animationStyle={{
            _open: "scale-fade-in",
            _closed: "scale-fade-out",
          }}
          animationDuration="moderate"
          lazyMount
          unmountOnExit
        >
          {player.emoji}
        </Presence>
      </Box>
      {children}
      {/*<Button*/}
      {/*  variant="solid"*/}
      {/*  colorPalette="purple"*/}
      {/*  h="full"*/}
      {/*  w="var(--thick-square-size)"*/}
      {/*  onClick={rematch}*/}
      {/*>*/}
      {/*  Rematch*/}
      {/*</Button>*/}
      <Box
        w="calc(var(--thin-square-size) * 3)"
        h="calc(var(--thin-square-size) * 3)"
      >
        <Presence
          fontSize="calc(var(--thin-square-size) * 2)"
          present={opponent.rematchDecision === targetDecision}
          animationStyle={{
            _open: "scale-fade-in",
            _closed: "scale-fade-out",
          }}
          animationDuration="moderate"
          lazyMount
          unmountOnExit
        >
          {opponent.emoji}
        </Presence>
      </Box>
    </HStack>
  );
}
