import { useState } from "react";

import { VStack } from "@chakra-ui/react";
import { motion } from "motion/react";

import { GameCard } from "@/components/game-card";
import { useGame } from "@/providers/game/useGame";
import { Button } from "@/components/ui/button";
import { Desk } from "@/components/desk";
import { CARD_ATTRIBUTE, GAME_PHASES } from "@/core/game/constants.ts";

const PLAYER_CARDS = [
  CARD_ATTRIBUTE.ROCK,
  CARD_ATTRIBUTE.PAPER,
  CARD_ATTRIBUTE.SCISSORS,
];

// TODO: move logic to custom hook for readability
export function PlayerDesk() {
  const {
    game: { phase },
    player,
    selectCard,
  } = useGame();

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const isTurnPhase = phase === GAME_PHASES.PLAYERS_TURN;
  const canSelectCard = isTurnPhase && !player.card;
  const canConfirmSelection = canSelectCard && selectedCard;

  const handleCardClick = (attr: CARD_ATTRIBUTE) => {
    if (selectedCard === attr) setSelectedCard(null);
    else setSelectedCard(attr);
  };

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
            {PLAYER_CARDS.map((card) => (
              <Button
                key={card}
                variant="plain"
                w="full"
                h="full"
                transformOrigin="center"
                padding={0}
                disabled={!canSelectCard}
                onClick={() => handleCardClick(card)}
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
