import { VStack } from "@chakra-ui/react";

import { Status } from "@/components/status.tsx";
import { PlayerDesk } from "@/components/player-desk";
import { OpponentDesk } from "@/components/opponent-desk";

export function Playground() {
  return (
    <VStack h="full" w="full" justifyContent="space-between">
      <>
        <OpponentDesk />
        <Status />
        <PlayerDesk />
      </>
    </VStack>
  );
}
