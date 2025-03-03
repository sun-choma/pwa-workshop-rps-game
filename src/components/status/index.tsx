import { useEffect } from "react";
import {
  VStack,
  Text,
  HStack,
  Spinner,
  Box,
  Presence,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";

import { GAME_PHASES, REMATCH_DECISIONS } from "@/core/game/constants";
import { useGame } from "@/providers/game/useGame";
import { ProgressCircle } from "@/components/progress-circle";
import { Button } from "@/components/ui/button";
import { useEmojiBlast } from "@/hooks/useEmojiBlast";

import {
  GAME_RESULT_LABELS,
  PHASE_MAX_TIME,
  TIMER_PHASES,
  TURN_RESULT_LABELS,
} from "./constants";
import { EmojiSelector } from "./emoji-selector";
import { RandomizerButton } from "./randomizer-button";
import { DecisionContainer } from "./decision-container";
import { BackButton } from "./back-button";
import { SkipTurnButton } from "./skip-turn-button";

export function Status() {
  const {
    game: { remainingTime, phase, turnOutcome },
    player,
    rematch,
    returnToMenu,
  } = useGame();
  const { blast } = useEmojiBlast();

  const statusFontSize = useBreakpointValue({
    base: "sm" as const,
    md: "md" as const,
  });

  const time = remainingTime || 0;
  const maxTime =
    phase in PHASE_MAX_TIME
      ? PHASE_MAX_TIME[phase as keyof typeof PHASE_MAX_TIME]
      : 1;

  const turnPercent = ((maxTime - (time || 0)) / maxTime) * 100;

  const haveFinishedPreemptively =
    player.card !== null && phase === GAME_PHASES.PLAYERS_TURN && time > 0;
  const isTimeout = time === 0;

  useEffect(
    () => {
      if (phase === GAME_PHASES.GAME_RESULTS) blast();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase, turnOutcome],
  );

  return (
    TIMER_PHASES.includes(phase) && (
      <VStack gap="2rem" height="10rem" justifyContent="center">
        <VStack gap="0">
          <Box h="calc(var(--thin-square-size) * 3)">
            <Presence
              h="full"
              present={phase === GAME_PHASES.GAME_RESULTS}
              animationName={{
                _open: "scale-fade-in",
                _closed: "scale-fade-out",
              }}
              animationDuration="moderate"
              lazyMount
              unmountOnExit
            >
              <DecisionContainer value={REMATCH_DECISIONS.REMATCH}>
                <Button
                  variant="solid"
                  colorPalette="purple"
                  h="full"
                  w="var(--thick-square-size)"
                  onClick={rematch}
                >
                  Rematch
                </Button>
              </DecisionContainer>
            </Presence>
          </Box>
          <HStack gap="0">
            <BackButton />
            <SkipTurnButton />
            <Flex
              w="var(--thick-square-size)"
              h="var(--thick-square-size)"
              justifyContent="center"
              alignItems="center"
            >
              <ProgressCircle value={turnPercent} size={75}>
                {phase === GAME_PHASES.PLAYERS_TURN &&
                  Math.round(time).toString()}
                {phase === GAME_PHASES.TURN_RESULTS &&
                  TURN_RESULT_LABELS[turnOutcome]}
                {phase === GAME_PHASES.GAME_RESULTS &&
                  GAME_RESULT_LABELS[player.lives ? "WIN" : "LOSE"]}
              </ProgressCircle>
            </Flex>
            <EmojiSelector />
            <RandomizerButton />
          </HStack>
          <Box h="calc(var(--thin-square-size) * 3)">
            <Presence
              h="full"
              present={
                haveFinishedPreemptively ||
                isTimeout ||
                phase === GAME_PHASES.GAME_RESULTS
              }
              animationName={{
                _open: "scale-fade-in",
                _closed: "scale-fade-out",
              }}
              animationDuration="moderate"
              lazyMount
              unmountOnExit
            >
              {haveFinishedPreemptively && (
                <HStack>
                  <Spinner size="sm" />
                  <Text fontSize={statusFontSize}>Waiting for opponent</Text>
                </HStack>
              )}
              {isTimeout && (
                <HStack>
                  <Spinner size="sm" />
                  <Text fontSize={statusFontSize}>Synchronizing</Text>
                </HStack>
              )}
              {phase === GAME_PHASES.GAME_RESULTS && (
                <DecisionContainer value={REMATCH_DECISIONS.MAIN_MENU}>
                  <Button
                    variant="ghost"
                    w="var(--thick-square-size)"
                    h="full"
                    onClick={returnToMenu}
                  >
                    Main menu
                  </Button>
                </DecisionContainer>
              )}
            </Presence>
          </Box>
        </VStack>
      </VStack>
    )
  );
}
