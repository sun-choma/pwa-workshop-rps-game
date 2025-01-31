import { AnimatePresence, motion } from "motion/react";
import { VStack, Text, HStack, Spinner, Box } from "@chakra-ui/react";

import { useGame } from "@/providers/game/useGame.ts";
import {
  ProgressCircleRing,
  ProgressCircleRoot,
  ProgressCircleValueText,
} from "@/components/ui/progress-circle.tsx";
import {
  GAME_RESULTS_TIME,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  GAME_PHASES,
  OUTCOME,
  REMATCH_DECISION,
} from "@/core/game/constants.ts";
import type { Outcome } from "@/core/game/types.ts";

const TURN_RESULT_LABELS: Record<Outcome, string> = {
  [OUTCOME.DRAW]: "🤝",
  [OUTCOME.PLAYER_WON]: "✅",
  [OUTCOME.OPPONENT_WON]: "❌",
};

const GAME_RESULT_LABELS = {
  WIN: "🎉",
  LOSE: "😭",
};

const TIMER_PHASES = [
  GAME_PHASES.PLAYERS_TURN,
  GAME_PHASES.TURN_RESULTS,
  GAME_PHASES.GAME_RESULTS,
];

const MotionVStack = motion.create(VStack);
const MotionHStack = motion.create(HStack);

const PHASE_MAX_TIME = {
  [GAME_PHASES.PLAYERS_TURN]: TURN_TIME,
  [GAME_PHASES.TURN_RESULTS]: TURN_RESULTS_TIME,
  [GAME_PHASES.GAME_RESULTS]: GAME_RESULTS_TIME,
};

export function Status() {
  const {
    game: { remainingTime, phase, turnOutcome },
    player,
    opponent,
    rematch,
    returnToMenu,
  } = useGame();

  const time = remainingTime || 0;
  const maxTime =
    phase in PHASE_MAX_TIME
      ? PHASE_MAX_TIME[phase as keyof typeof PHASE_MAX_TIME]
      : 1;

  const turnPercent = ((maxTime - (time || 0)) / maxTime) * 100;

  const haveFinishedPreemptively =
    !!player.card && phase === GAME_PHASES.PLAYERS_TURN && time > 0;
  const isTimeout = time === 0;

  const playerSymbol = player.name.split(" ").at(0);
  const opponentSymbol = opponent.name.split(" ").at(0);

  return (
    TIMER_PHASES.includes(phase) && (
      <VStack gap="2rem">
        <VStack gap="1rem">
          <ProgressCircleRoot
            value={turnPercent}
            size="xl"
            colorPalette="purple"
          >
            <ProgressCircleRing
              css={{ "--thickness": "0.25rem" }}
              cap="round"
            />
            <ProgressCircleValueText fontSize="lg">
              {phase === GAME_PHASES.PLAYERS_TURN &&
                Math.round(time).toString()}
              {phase === GAME_PHASES.TURN_RESULTS &&
                TURN_RESULT_LABELS[turnOutcome]}
              {phase === GAME_PHASES.GAME_RESULTS &&
                GAME_RESULT_LABELS[player.lives ? "WIN" : "LOSE"]}
            </ProgressCircleValueText>
          </ProgressCircleRoot>
          <AnimatePresence initial={false}>
            {(haveFinishedPreemptively || isTimeout) && (
              <MotionHStack
                initial={{ opacity: 0, size: 0.5 }}
                animate={{ opacity: 1, size: 1 }}
                exit={{ opacity: 0, size: 0.5 }}
              >
                <Spinner size="sm" />
                <Text>
                  {haveFinishedPreemptively && "Waiting for opponent"}
                  {isTimeout && "Synchronizing"}
                </Text>
              </MotionHStack>
            )}
          </AnimatePresence>
        </VStack>
        <AnimatePresence initial={false}>
          {phase === GAME_PHASES.GAME_RESULTS && (
            <MotionVStack
              mx="auto"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              <HStack position="relative" w="280px" justifyContent="center">
                <Box w="24px" h="24px">
                  {player.rematchDecision === REMATCH_DECISION.REMATCH &&
                    playerSymbol}
                </Box>
                <Button
                  variant="solid"
                  colorPalette="purple"
                  max-w="160px"
                  onClick={rematch}
                >
                  Rematch
                </Button>
                <Box w="24px" h="24px">
                  {opponent.rematchDecision === REMATCH_DECISION.REMATCH &&
                    opponentSymbol}
                </Box>
              </HStack>

              <HStack position="relative" w="280px" justifyContent="center">
                <Box w="24px" h="24px">
                  {player.rematchDecision === REMATCH_DECISION.MAIN_MENU &&
                    playerSymbol}
                </Box>
                <Button variant="ghost" max-w="160px" onClick={returnToMenu}>
                  Main menu
                </Button>
                <Box w="24px" h="24px">
                  {opponent.rematchDecision === REMATCH_DECISION.MAIN_MENU &&
                    opponentSymbol}
                </Box>
              </HStack>
            </MotionVStack>
          )}
        </AnimatePresence>
      </VStack>
    )
  );
}
