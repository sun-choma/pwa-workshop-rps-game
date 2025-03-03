import { IconButton, Presence } from "@chakra-ui/react";
import { ArrowLeftFromLineIcon } from "lucide-react";

import { GAME_PHASES } from "@/core/game/constants";
import { useGame } from "@/providers/game/useGame";

export function BackButton() {
  const {
    game: { phase },
    returnToMenu,
  } = useGame();

  return (
    <Presence
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
        variant="plain"
        w="calc(var(--thin-square-size) * 3)"
        h="calc(var(--thin-square-size) * 3)"
        onClick={returnToMenu}
      >
        <ArrowLeftFromLineIcon />
      </IconButton>
    </Presence>
  );
}
