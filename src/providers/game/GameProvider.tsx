import { ReactNode, useEffect, useRef, useState } from "react";

import { Context } from "@/providers/game/context";
import { MAX_LIVES } from "@/providers/game/constants";
import { GameMaster } from "@/core/game/game-master";
import { GAME_PHASES, OUTCOME } from "@/core/game/constants";
import type * as Game from "@/core/game/types";

export function GameProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setInitialized] = useState(false);
  const gameMasterRef = useRef<GameMaster>();

  const [phase, setPhase] = useState<Game.Value<"phase">>(GAME_PHASES.INIT);
  const [turnTime, setTurnTime] = useState<Game.Value<"time">>();
  const [outcome, setOutcome] = useState<Game.Value<"turnOutcome">>(
    OUTCOME.DRAW,
  );

  const [playerName, setPlayerName] = useState<Game.Value<"playerName">>("");
  const [playerLives, setPlayerLives] =
    useState<Game.Value<"playerLives">>(MAX_LIVES);
  const [playerCard, setPlayerCard] = useState<Game.Value<"playerCard">>();

  const [opponentName, setOpponentName] =
    useState<Game.Value<"opponentName">>("");
  const [opponentLives, setOpponentLives] =
    useState<Game.Value<"opponentLives">>(MAX_LIVES);
  const [opponentHoverIndex, setOpponentHoverIndex] =
    useState<Game.Value<"opponentHoveredIndex">>(null);
  const [opponentSelectionIndex, setOpponentSelectionIndex] =
    useState<Game.Value<"opponentSelectedIndex">>(null);
  const [opponentCard, setOpponentCard] =
    useState<Game.Value<"opponentCard">>();
  const [isOpponentTurnEnded, setOpponentTurnEnd] =
    useState<Game.Value<"opponentReady">>(false);

  useEffect(() => {
    if (!gameMasterRef.current) {
      gameMasterRef.current = new GameMaster();
      setInitialized(true);
    }

    const subscriptions = {
      "phase-change": setPhase,
      "time-change": setTurnTime,
      outcome: setOutcome,
      "player-name-set": setPlayerName,
      "player-lives-change": setPlayerLives,
      "player-card-change": setPlayerCard,
      "opponent-name-set": setOpponentName,
      "opponent-lives-change": setOpponentLives,
      "opponent-hover-change": setOpponentHoverIndex,
      "opponent-selection-change": setOpponentSelectionIndex,
      "opponent-card-change": setOpponentCard,
      "opponent-ready-change": setOpponentTurnEnd,
    };

    gameMasterRef?.current.addEventListeners(subscriptions);

    const ref = gameMasterRef?.current;
    return () => {
      ref.removeEventListeners(subscriptions);
    };
  }, [gameMasterRef]);

  const contextValue = {
    game: {
      phase,
      remainingTime: turnTime,
      turnOutcome: outcome,
    },
    player: {
      name: playerName,
      card: playerCard,
      lives: playerLives,
    },
    opponent: {
      name: opponentName,
      card: opponentCard,
      lives: opponentLives,
      hoveredCardIndex: opponentHoverIndex,
      selectedCardIndex: opponentSelectionIndex,
      isReady: isOpponentTurnEnded,
    },
    startGame: gameMasterRef.current?.findGame,
    selectCard: gameMasterRef.current?.selectCard,
    rematch: gameMasterRef.current?.rematch,
    returnToMenu: gameMasterRef.current?.returnToMenu,
  };

  // TODO: create proper INIT phase
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
