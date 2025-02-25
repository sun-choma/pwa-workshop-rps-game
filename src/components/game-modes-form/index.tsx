import { useState } from "react";
import { generate } from "random-words";
import { RotateCcwIcon } from "lucide-react";
import {
  Group,
  IconButton,
  Input,
  InputAddon,
  Presence,
  VStack,
} from "@chakra-ui/react";

import { GAME_PHASES } from "@/core/game/constants";
import { Button } from "@/components/ui/button";
import { useGame } from "@/providers/game/useGame";
import { offsetRandom } from "@/utils/math";
import { useConnectivity } from "@/hooks/useConnectivity";

import "./styles.css";

const randomizeName = () =>
  (generate(offsetRandom(1, 3)) as string[]).join("-");

export function GameModesForm() {
  const [username, setUsername] = useState(randomizeName());
  const {
    game: { phase },
    startSingleplayer,
    startMultiplayer,
    multiplayerState,
    cancelGame,
  } = useGame();
  const { isOnline } = useConnectivity();

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
      <Group attached w="full" maxW="calc(var(--thick-square-size) * 4)">
        <Input
          variant="subtle"
          placeholder="Username"
          value={username}
          disabled={phase === GAME_PHASES.MATCHING}
          onChange={(e) => setUsername(e.target.value)}
        />
        <InputAddon border="1px" p="0">
          <IconButton
            variant="ghost"
            onClick={() => setUsername(randomizeName())}
            disabled={phase === GAME_PHASES.MATCHING}
          >
            <RotateCcwIcon />
          </IconButton>
        </InputAddon>
      </Group>
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
        disabled={username.length === 0 || !isOnline}
        loading={
          phase === GAME_PHASES.MATCHING || multiplayerState === "too-long"
        }
        loadingText={
          multiplayerState === "too-long"
            ? "Connecting to server"
            : "Searching for opponent"
        }
        onClick={() => startMultiplayer(username)}
      >
        {isOnline && "Multiplayer"}
        {!isOnline && "Multiplayer unavailable"}
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
