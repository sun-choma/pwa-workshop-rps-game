import { useState } from "react";
import { Input, Presence, VStack } from "@chakra-ui/react";

import { GAME_PHASES } from "@/core/game/constants";
import { Button } from "@/components/ui/button";
import { useGame } from "@/providers/game/useGame";

import "./styles.css";

export function GameModesForm() {
  const [username, setUsername] = useState("");
  const {
    game: { phase },
    startSingleplayer,
    startMultiplayer,
    cancelGame,
  } = useGame();

  return (
    <VStack
      className="form"
      w="full"
      minH="calc(var(--thick-square-size) * 2)"
      maxW="calc(var(--thick-square-size) * 5)"
      justifyContent="space-between"
      boxSizing="border-box"
      padding="calc(var(--thick-square-size) / 4)"
    >
      <Input
        variant="subtle"
        placeholder="Username"
        maxW="calc(var(--thick-square-size) * 4)"
        value={username}
        disabled={phase === GAME_PHASES.MATCHING}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        w="full"
        maxW="calc(var(--thick-square-size) * 4)"
        disabled={username.length === 0 || phase === GAME_PHASES.MATCHING}
        loadingText="Starting game"
        onClick={() => startSingleplayer(username)}
      >
        Single Player
      </Button>
      <Button
        w="full"
        maxW="calc(var(--thick-square-size) * 4)"
        disabled={username.length === 0}
        loading={phase === GAME_PHASES.MATCHING}
        loadingText="Searching for opponent"
        onClick={() => startMultiplayer(username)}
      >
        Multiplayer
      </Button>
      <Presence
        present={phase === GAME_PHASES.MATCHING}
        animationName={{
          _open: "scale-fade-in",
          _closed: "scale-fade-out",
        }}
        w="full"
        maxW="calc(var(--thick-square-size) * 4)"
        animationDuration="moderate"
        lazyMount
        unmountOnExit
      >
        <Button w="full" variant="surface" onClick={cancelGame}>
          Cancel search
        </Button>
      </Presence>
    </VStack>
  );
}
