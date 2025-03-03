import { Box, IconButton, Presence } from "@chakra-ui/react";
import { SkipForwardIcon } from "lucide-react";

import { GAME_PHASES } from "@/core/game/constants";
import { useGame } from "@/providers/game/useGame";

export function SkipTurnButton() {
  const {
    game: { phase },
    player,
    skipTurn,
  } = useGame();

  return (
    <Box
      w="calc(var(--thin-square-size) * 3)"
      h="calc(var(--thin-square-size) * 3)"
    >
      <Presence
        w="inherit"
        h="inherit"
        present={phase === GAME_PHASES.PLAYERS_TURN}
        animationStyle={{
          _open: "scale-fade-in",
          _closed: "scale-fade-out",
        }}
        display="flex"
        animationDuration="moderate"
        lazyMount
        unmountOnExit
      >
        <IconButton
          w="full"
          h="full"
          variant="plain"
          disabled={player.card !== null}
          onClick={skipTurn}
        >
          <SkipForwardIcon />
        </IconButton>
      </Presence>
    </Box>
  );
}
