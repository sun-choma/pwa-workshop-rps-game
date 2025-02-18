import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";

import { Context } from "@/providers/game/context";
import { LEAVE_GAME_TIMEOUT, MAX_LIVES } from "@/providers/game/constants";
import { GameMaster } from "@/core/game/game-master";
import { GAME_PHASES, OUTCOMES } from "@/core/game/constants";
import type * as Game from "@/core/game/types";
import { cancelTimeout, requestTimeout } from "@/utils/common";

const STATUS_TOAST_ID = String(Symbol("STATUS_TOAST_ID"));

export function GameProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setInitialized] = useState(false);
  const gameMasterRef = useRef<GameMaster>();

  const [phase, setPhase] = useState<Game.Value<"phase">>(GAME_PHASES.INIT);
  const [turnTime, setTurnTime] = useState<Game.Value<"time">>();
  const [outcome, setOutcome] = useState<Game.Value<"turnOutcome">>(
    OUTCOMES.DRAW,
  );

  const [playerName, setPlayerName] = useState<Game.Value<"playerName">>("");
  const [playerLives, setPlayerLives] =
    useState<Game.Value<"playerLives">>(MAX_LIVES);
  const [playerCard, setPlayerCard] = useState<Game.Value<"playerCard">>();
  const [playerCardIndex, setPlayerCardIndex] =
    useState<Game.Value<"playerSelectedIndex">>(null);
  const [playerDecision, setPlayerDecision] =
    useState<Game.Value<"playerRematchDecision">>(null);

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
  const [opponentDecision, setOpponentDecision] =
    useState<Game.Value<"opponentRematchDecision">>(null);

  // TODO: dismiss toast on "main menu" click
  const notifyOpponentLeft = useCallback(() => {
    if (isInitialized) {
      const endGame = () => {
        toaster.dismiss(STATUS_TOAST_ID);
        gameMasterRef.current!.actions.common.exitGame();
      };
      const ref = requestTimeout(endGame, LEAVE_GAME_TIMEOUT * 1000);
      toaster.create({
        id: STATUS_TOAST_ID,
        type: "loading",
        title: "Opponent left",
        description: `Ending match in ${LEAVE_GAME_TIMEOUT} seconds`,
        action: {
          label: "End now",
          onClick: () => {
            cancelTimeout(ref);
            endGame();
          },
        },
      });
    }
  }, [isInitialized]);

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
      "player-selection-change": setPlayerCardIndex,
      "player-rematch-set": setPlayerDecision,
      "opponent-name-set": setOpponentName,
      "opponent-lives-change": setOpponentLives,
      "opponent-hover-change": setOpponentHoverIndex,
      "opponent-selection-change": setOpponentSelectionIndex,
      "opponent-card-change": setOpponentCard,
      "opponent-ready-change": setOpponentTurnEnd,
      "opponent-rematch-set": setOpponentDecision,
    };

    gameMasterRef?.current.addEventListeners(subscriptions);
    gameMasterRef?.current.addEventListener(
      "opponent-left",
      notifyOpponentLeft,
    );

    const ref = gameMasterRef?.current;
    return () => {
      ref.removeEventListeners(subscriptions);
      ref.removeEventListener("opponent-left", notifyOpponentLeft);
    };
  }, [gameMasterRef, notifyOpponentLeft]);

  const contextValue = {
    game: {
      phase,
      remainingTime: turnTime,
      turnOutcome: outcome,
    },
    player: {
      name: playerName,
      emoji: playerName.split(" ").at(0),
      card: playerCard,
      selectedCardIndex: playerCardIndex,
      lives: playerLives,
      rematchDecision: playerDecision,
    },
    opponent: {
      name: opponentName,
      emoji: opponentName.split(" ").at(0),
      card: opponentCard,
      lives: opponentLives,
      hoveredCardIndex: opponentHoverIndex,
      selectedCardIndex: opponentSelectionIndex,
      isReady: isOpponentTurnEnded,
      rematchDecision: opponentDecision,
    },
    startMultiplayer: gameMasterRef.current?.actions.common.startMultiplayer,
    startSingleplayer: gameMasterRef.current?.actions.common.startSingleplayer,
    cancelGame: gameMasterRef.current?.actions.common.exitGame,
    hoverCard: gameMasterRef.current?.actions.match.highlightCard,
    clickCard: gameMasterRef.current?.actions.match.selectCard,
    selectCard: gameMasterRef.current?.actions.match.confirmCard,
    rematch: gameMasterRef.current?.actions.gameEnd.rematch,
    returnToMenu: gameMasterRef.current?.actions.gameEnd.returnToMenu,
  };

  // TODO: create proper INIT phase
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
