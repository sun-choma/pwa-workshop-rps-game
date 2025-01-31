import { useMemo, useState } from "react";

import { VStack } from "@chakra-ui/react";
import { motion } from "motion/react";

import { GameCard } from "@/components/game-card";
import { useGame } from "@/providers/game/useGame";
import { Button } from "@/components/ui/button";
import { Desk } from "@/components/desk";
import { CARD_ATTRIBUTE, GAME_PHASES } from "@/core/game/constants.ts";
import { shuffle } from "@/utils/common";

const PLAYER_CARDS = [
  CARD_ATTRIBUTE.ROCK,
  CARD_ATTRIBUTE.PAPER,
  CARD_ATTRIBUTE.SCISSORS,
];

// TODO: move logic to custom hook for readability?
export function PlayerDesk() {
  const {
    game: { phase, remainingTime },
    player,
    selectCard,
    hoverCard,
    clickCard,
  } = useGame();

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const isTurnPhase = phase === GAME_PHASES.PLAYERS_TURN;
  const timeStillLeft = Number(remainingTime) > 0;

  const canSelectCard = isTurnPhase && !player.card && timeStillLeft;
  const canConfirmSelection = canSelectCard && selectedCard && timeStillLeft;

  const handleCardClick = (attr: CARD_ATTRIBUTE, index: number) => {
    if (selectedCard === attr) {
      setSelectedCard(null);
      clickCard(null);
    } else {
      setSelectedCard(attr);
      clickCard(index);
    }
    hoverCard(null);
  };

  const randomCards = useMemo(() => shuffle(PLAYER_CARDS), [phase]);

  return (
    <VStack w="full">
      <Desk title={player.name} lives={player.lives}>
        {isTurnPhase ? (
          <motion.div
            key="turn"
            className="card-grid"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{
              ease: "easeOut",
              duration: 0.4,
            }}
          >
            {randomCards.map((card, index) => (
              <Button
                key={card}
                variant="plain"
                w="full"
                h="full"
                transformOrigin="center"
                padding={0}
                disabled={!canSelectCard}
                onClick={() => {
                  handleCardClick(card, index);
                }}
                onMouseOver={() => timeStillLeft && hoverCard(index)}
                onMouseLeave={() => timeStillLeft && hoverCard(null)}
              >
                <GameCard attr={card} isSelected={card === selectedCard} />
              </Button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            className="card-grid"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 300 }}
            transition={{
              ease: "easeOut",
              duration: 0.2,
            }}
          >
            <GameCard key="card" attr={player.card} layout />
          </motion.div>
        )}
      </Desk>
      <Button
        disabled={!canConfirmSelection}
        onClick={() => selectCard(selectedCard!)}
      >
        End turn
      </Button>
    </VStack>
  );
}
