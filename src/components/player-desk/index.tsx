import { CSSProperties, useMemo } from "react";
import { Flex } from "@chakra-ui/react";

import { GameCard } from "@/components/game-card";
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

  const canSelectCard = isTurnPhase && !player.card && timeStillLeft;

  const randomCards = useMemo(() => shuffle(PLAYER_CARDS), [phase]);

  const handleCardClick = (attr: CARD_ATTRIBUTES, index: number) => {
    if (randomCards[player.selectedCardIndex ?? -1] === attr) selectCard(attr);
    else clickCard(index);
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
            <Button
              key={card}
              variant="plain"
              w="full"
              h="full"
              transformOrigin="center"
              padding={0}
              disabled={!canSelectCard}
              onClick={() => handleCardClick(card, index)}
              onMouseOver={() => timeStillLeft && hoverCard(index)}
              onMouseLeave={() => timeStillLeft && hoverCard(null)}
            >
              <GameCard
                attr={card}
                isSelected={index === player.selectedCardIndex}
                style={{ "--index": index, "--direction": -1 } as CSSProperties}
              />
            </Button>
          ))}
        {!isTurnPhase && (
          <GameCard
            key="card"
            attr={player.card}
            style={{ "--index": 1, "--direction": -1 } as CSSProperties}
            mx="auto"
          />
        )}
      </Flex>
    </Desk>
  );
}
