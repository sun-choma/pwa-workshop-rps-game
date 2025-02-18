import { useCallback, useState } from "react";
import { HStack, Text } from "@chakra-ui/react";

import { offsetRandom } from "@/utils/math";

import { PAPER_WORDS, ROCK_WORDS, SCISSORS_WORDS } from "./constants";
import "./styles.css";

const shuffleWords = () =>
  [ROCK_WORDS, PAPER_WORDS, SCISSORS_WORDS].map(
    (array) => array[offsetRandom(0, array.length - 1)],
  );

export function GameTitle() {
  const [words, setWords] = useState<string[]>(["Rock", "Paper", "Scissors"]);

  const toggleShuffleWords = useCallback(() => setWords(shuffleWords()), []);

  return (
    <HStack
      w="calc(var(--thick-square-size) * 3)"
      h="var(--thick-square-size)"
      mx="auto"
      justifyContent="center"
    >
      {words.map((word, index) => (
        <Text
          key={index}
          fontSize="2xl"
          fontWeight="bold"
          className="shake"
          style={{ "--offset": `${index % 2}` } as Record<string, string>}
          onAnimationIterationCapture={toggleShuffleWords}
        >
          {word}
        </Text>
      ))}
    </HStack>
  );
}
