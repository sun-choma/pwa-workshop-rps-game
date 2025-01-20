import { motion } from "motion/react";

import { joinClassNames, nodeArray } from "@/utils";
import { GameCard } from "@/components/game-card";
import { CARD_ATTRIBUTE } from "@/constants";
import { Desk } from "@/components/desk";
import { useGame } from "@/providers/game/useGame";
import { GAME_PHASES } from "@/providers/game/types";

export function OpponentDesk() {
  const { opponent, game } = useGame();

  const isTurnPhase = game.phase === GAME_PHASES.PLAYERS_TURN;

  return (
    <Desk title="CPU Desk" lives={opponent.lives}>
      {isTurnPhase ? (
        <motion.div
          key="turn"
          className="card-grid"
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -300 }}
          transition={{
            ease: "easeOut",
            duration: 0.4,
          }}
        >
          {nodeArray({
            length: 3,
            item: (index) => (
              <GameCard
                key={index}
                attr={CARD_ATTRIBUTE.NONE}
                isSelected={index === opponent.selectedCardIndex}
                isHovered={index === opponent.hoveredCardIndex}
                className={joinClassNames(opponent.isReady && "ready")}
              />
            ),
          })}
        </motion.div>
      ) : (
        <motion.div
          key="results"
          className="card-grid"
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -300 }}
          transition={{
            ease: "easeOut",
            duration: 0.2,
          }}
        >
          <GameCard attr={opponent.card} />
        </motion.div>
      )}
    </Desk>
  );
}
