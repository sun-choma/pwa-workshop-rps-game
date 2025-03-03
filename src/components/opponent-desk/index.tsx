import { Flex } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";

import { CardBack, CardFront, GameCard } from "@/components/game-card";
import { Desk } from "@/components/desk";
import { useGame } from "@/providers/game/useGame";
import { joinClassNames, nodeArray } from "@/utils/common";
import { CARD_ATTRIBUTES, GAME_PHASES } from "@/core/game/constants";
import { ReactionEmitter } from "@/components/reaction-emitter";

export function OpponentDesk() {
  const { opponent, game } = useGame();

  const isTurnPhase = game.phase === GAME_PHASES.PLAYERS_TURN;

  return (
    <>
      <ReactionEmitter top="0" direction="down">
        {opponent.reactions}
      </ReactionEmitter>
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
                  index={index}
                  direction="down"
                  isRotated={index === opponent.selectedCardIndex}
                  isHighlighted={index === opponent.hoveredCardIndex}
                >
                  <CardFront>{CARD_ATTRIBUTES.NONE}</CardFront>
                  <CardBack>
                    <CheckIcon strokeWidth={1} size={48} />
                  </CardBack>
                </GameCard>
              ),
            })}
          {!isTurnPhase && (
            <GameCard index={1} direction="down" mx="auto">
              <CardFront>{opponent.card}</CardFront>
            </GameCard>
          )}
        </Flex>
      </Desk>
    </>
  );
}
