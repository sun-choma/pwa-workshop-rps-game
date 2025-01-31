import { useState } from "react";

import { Input, VStack } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field.tsx";
import { useGame } from "@/providers/game/useGame.ts";
import { GAME_PHASES } from "@/core/game/constants";
import { AnimatePresence } from "motion/react";

export function Menu() {
  const [username, setUsername] = useState("");
  const {
    game: { phase },
    startGame,
    cancelGame,
  } = useGame();

  return (
    <VStack gap="4" maxW="280px" w="full">
      <Field label="Player name" required>
        <Input
          placeholder="Username"
          variant="subtle"
          value={username}
          disabled={phase === GAME_PHASES.MATCHING}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Field>
      <Button
        disabled={username.length === 0}
        loading={phase === GAME_PHASES.MATCHING}
        loadingText="Searching for opponent"
        onClick={() => startGame(username)}
      >
        Multiplayer
      </Button>
      <AnimatePresence initial={false}>
        {phase === GAME_PHASES.MATCHING && (
          <Button
            variant="surface"
            onClick={cancelGame}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              ease: "easeInOut",
              duration: 0.2,
            }}
          >
            Cancel search
          </Button>
        )}
      </AnimatePresence>
    </VStack>
  );
}
