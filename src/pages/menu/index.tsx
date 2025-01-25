import { useState } from "react";

import { Input, VStack } from "@chakra-ui/react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field.tsx";
import { useGame } from "@/providers/game/useGame.ts";

export function Menu() {
  const [username, setUsername] = useState("");
  const { startGame } = useGame();

  return (
    <VStack gap="4" maxW="300px">
      <Field label="Player name" required>
        <Input
          placeholder="Username"
          variant="subtle"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Field>
      <Button
        disabled={username.length === 0}
        onClick={() => startGame(username)}
      >
        Single Player
      </Button>
    </VStack>
  );
}
