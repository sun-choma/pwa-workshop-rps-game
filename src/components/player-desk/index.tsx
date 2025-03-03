import { useMemo } from "react";
import { Flex, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { CheckIcon, XIcon } from "lucide-react";

import { CardBack, CardFront, GameCard } from "@/components/game-card";
import { useGame } from "@/providers/game/useGame";
import { Button } from "@/components/ui/button";
import { Desk } from "@/components/desk";
import { joinClassNames, shuffle } from "@/utils/common";
import { CARD_ATTRIBUTES, GAME_PHASES } from "@/core/game/constants";

const PLAYER_CARDS = [
  CARD_ATTRIBUTES.ROCK,
  CARD_ATTRIBUTES.PAPER,
  CARD_ATTRIBUTES.SCISSORS,
];

export function PlayerDesk() {
  const {
    game: { phase, remainingTime },
    player,
    selectCard,
    hoverCard,
    clickCard,
  } = useGame();
  const isTurnPhase = phase === GAME_PHASES.PLAYERS_TURN;
  const timeStillLeft = Number(remainingTime) > 0;

  const canSelectCard = isTurnPhase && player.card === null && timeStillLeft;

  const randomCards = useMemo(
    () => shuffle(PLAYER_CARDS),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [phase],
  );

  const handleCardClick = (index: number | null) => {
    clickCard(index);
    hoverCard(null);
  };

  return (
    <Desk title={player.name} lives={player.lives}>
      <Flex
        className={joinClassNames(
          "card-grid",
          isTurnPhase && player.isReady && "ready",
        )}
      >
        {isTurnPhase &&
          randomCards.map((card, index) => (
            <GameCard
              key={card}
              index={index}
              isRotated={index === player.selectedCardIndex}
              onMouseOver={() => timeStillLeft && hoverCard(index)}
              onMouseLeave={() => timeStillLeft && hoverCard(null)}
            >
              <CardFront
                as={Button}
                color="white"
                disabled={!canSelectCard}
                onClick={() => handleCardClick(index)}
              >
                {card}
              </CardFront>
              <CardBack as={VStack}>
                {canSelectCard && (
                  <>
                    <Text fontSize="2xl">🤔</Text>
                    <HStack>
                      <IconButton
                        variant="outline"
                        onClick={() => selectCard(card)}
                      >
                        <CheckIcon strokeWidth={1} size={32} />
                      </IconButton>
                      <IconButton
                        variant="outline"
                        onClick={() => handleCardClick(null)}
                      >
                        <XIcon strokeWidth={1} size={32} />
                      </IconButton>
                    </HStack>
                  </>
                )}
                {!canSelectCard && <CheckIcon strokeWidth={1} size={48} />}
              </CardBack>
            </GameCard>
          ))}
        {!isTurnPhase && (
          <GameCard key="card" index={1} mx="auto">
            <CardFront>{player.card}</CardFront>
          </GameCard>
        )}
      </Flex>
    </Desk>
  );
}
