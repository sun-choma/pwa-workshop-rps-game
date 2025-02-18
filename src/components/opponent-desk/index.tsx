import { CSSProperties } from "react";
import { Flex } from "@chakra-ui/react";

import { GameCard } from "@/components/game-card";
import { Desk } from "@/components/desk";
import { useGame } from "@/providers/game/useGame";
import { joinClassNames, nodeArray } from "@/utils/common";
import { CARD_ATTRIBUTES, GAME_PHASES } from "@/core/game/constants";

export function OpponentDesk() {
  const { opponent, game } = useGame();

  const isTurnPhase = game.phase === GAME_PHASES.PLAYERS_TURN;

  return (
    <Desk title={opponent.name} lives={opponent.lives}>
      <Flex
        className={joinClassNames(
          "card-grid",
          isTurnPhase && opponent.isReady && "ready",
        )}
      >
        {isTurnPhase &&
          nodeArray({
            length: 3,
            item: (index) => (
              <GameCard
                key={index}
                w="full"
                h="full"
                transformOrigin="center"
                padding={0}
                attr={CARD_ATTRIBUTES.NONE}
                isSelected={index === opponent.selectedCardIndex}
                isHovered={index === opponent.hoveredCardIndex}
                style={{ "--index": index, "--direction": 1 } as CSSProperties}
              />
            ),
          })}
        {!isTurnPhase && (
          <GameCard
            attr={opponent.card}
            style={{ "--index": 1, "--direction": 1 } as CSSProperties}
            mx="auto"
          />
        )}
      </Flex>
    </Desk>
  );
}
