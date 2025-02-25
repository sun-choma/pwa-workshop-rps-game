import { Grid, VStack } from "@chakra-ui/react";

import { useGame } from "@/providers/game/useGame";
import { useRipple } from "@/hooks/useRipple";
import { TechHeader } from "@/components/tech-header";
import { GameTitle } from "@/components/game-title";
import { GameModesForm } from "@/components/game-modes-form";
import { OpponentDesk } from "@/components/opponent-desk";
import { Status } from "@/components/status";
import { PlayerDesk } from "@/components/player-desk";
import { ActionsHeader } from "@/components/actions-header";
import { GAME_PHASES } from "@/core/game/constants";

const MENU_PHASES = [GAME_PHASES.INIT, GAME_PHASES.MATCHING];

function App() {
  useRipple();

  const {
    game: { phase },
  } = useGame();
  const isMenuPhase = MENU_PHASES.includes(phase);

  return (
    <>
      <Grid
        templateColumns="repeat(auto-fill, calc(var(--thick-square-size) * 1))"
        templateRows="repeat(auto-fill, var(--thick-square-size))"
        padding={{
          md: "calc(var(--thick-square-size) * 0.25)",
          base: "0.25rem",
        }}
        w="full"
        h="full"
        justifyContent="center"
        justifyItems="center"
        alignContent="center"
      >
        <VStack
          position="relative"
          justifyContent="space-between"
          gridColumn="1 / -1"
          gridRow="1 / -1"
          w="full"
          h="full"
          maxWidth={
            isMenuPhase ? "unset" : "calc(var(--thick-square-size) * 4.5)"
          }
        >
          {isMenuPhase && (
            <>
              <ActionsHeader />
              <TechHeader />
              <GameTitle />
              <GameModesForm />
            </>
          )}
          {!isMenuPhase && (
            <>
              <OpponentDesk />
              <Status />
              <PlayerDesk />
            </>
          )}
        </VStack>
      </Grid>
    </>
  );
}

export default App;
