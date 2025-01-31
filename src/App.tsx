// import { Game } from "@/pages/game";
import { useGame } from "@/providers/game/useGame.ts";
import { Menu } from "@/pages/menu";
import { Playground } from "@/pages/playground";
import { GAME_PHASES } from "@/core/game/constants.ts";

// import { Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";

// import pwaLogo from "/logo/pwa-logo.svg";
// import rpsLogo from "/logo/rps-logo.svg";
// import { Button } from "@/components/ui/button.tsx";

// import { useInstallable } from "@/providers/installable/useInstallable.ts";
// import { InstallationController } from "@/InstallationController.tsx";
//
// import pwaLogo from "/pwa-logo.svg";
// import { usePwa } from "@/hooks/usePwa.ts";

const MENU_PHASES = [GAME_PHASES.INIT, GAME_PHASES.MATCHING];

function App() {
  const {
    game: { phase },
  } = useGame();
  const isMenuPhase = MENU_PHASES.includes(phase);

  // const { isInstallable } = useInstallable();
  // const { isInstalled } = usePwa();

  // return (
  //   <main>
  //     <VStack gap={24}>
  //       <HStack gap={4}>
  //         <Image width="2xs" height="2xs" src={pwaLogo} alt="PWA Logo" />
  //         <Text fontSize="64px" fontWeight="thin">
  //           x
  //         </Text>
  //         <Image
  //           width="3xs"
  //           height="3xs"
  //           src={rpsLogo}
  //           alt="RPS Logo"
  //           objectFit="contain"
  //         />
  //       </HStack>
  //       <VStack gap={4}>
  //         <Heading as="h1">Rock, Paper, Scissors</Heading>
  //         <Heading as="h2">PWA Workshop</Heading>
  //         <HStack>
  //           <Button color="gray" variant="surface" size="lg">
  //             vs CPU
  //           </Button>
  //           <Button color="gray" variant="surface" size="lg">
  //             vs Player
  //           </Button>
  //         </HStack>
  //       </VStack>
  //     </VStack>
  //   </main>
  // );
  return (
    <>
      {isMenuPhase && <Menu />}
      {!isMenuPhase && <Playground />}
    </>
  );
  // return <Game />;
}

export default App;
