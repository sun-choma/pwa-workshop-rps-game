import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

import { toaster } from "@/components/ui/toaster";
import { Overlay } from "@/components/overlay";
import { Context } from "@/providers/game/context";
import {
  LEAVE_GAME_TIMEOUT,
  MAX_LIVES,
  SERVER_WAIT_TIME,
} from "@/providers/game/constants";
import { GameMaster } from "@/core/game/game-master";
import { GAME_PHASES, OUTCOMES } from "@/core/game/constants";
import type * as Game from "@/core/game/types";
import { cancelTimeout, requestTimeout } from "@/utils/common";
import { GameContext } from "@/providers/game/types";
import { offsetRandom } from "@/utils/math";
import { ENV } from "@/env/config";

const STATUS_TOAST_ID = String(Symbol("STATUS_TOAST_ID"));

export function GameProvider({ children }: { children: ReactNode }) {
  const gameMasterRef = useRef<GameMaster>(new GameMaster());

  const [phase, setPhase] = useState<Game.Value<"phase">>(GAME_PHASES.INIT);
  const [turnTime, setTurnTime] = useState<Game.Value<"time">>();
  const [outcome, setOutcome] = useState<Game.Value<"turnOutcome">>(
    OUTCOMES.DRAW,
  );

  const [multiplayerState, setMultiplayerState] =
    useState<GameContext["multiplayerState"]>("waiting");

  useEffect(() => {
    const serverAsleepTimeout = requestTimeout(
      () => setMultiplayerState("too-long"),
      SERVER_WAIT_TIME,
    );
    fetch(`${ENV.API_URL}/ping`).then(() => {
      cancelTimeout(serverAsleepTimeout);
      setMultiplayerState("ready");
    });
    return () => {
      cancelTimeout(serverAsleepTimeout);
    };
  }, []);

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

  const notifyOpponentLeft = useCallback(() => {
    const endGame = () => {
      toaster.dismiss(STATUS_TOAST_ID);
      gameMasterRef.current.actions.common.exitGame();
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
  }, []);

  useEffect(() => {
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

    const ref = gameMasterRef.current;
    return () => {
      ref.removeEventListeners(subscriptions);
      ref.removeEventListener("opponent-left", notifyOpponentLeft);
    };
  }, [gameMasterRef, notifyOpponentLeft]);

  const chooseRandom = useCallback(() => {
    let randomIndex = offsetRandom(0, 2);
    while (randomIndex === playerCardIndex) randomIndex = offsetRandom(0, 2);

    gameMasterRef.current.actions.match.selectCard(randomIndex);
  }, [playerCardIndex]);

  const returnToMenu = useCallback(() => {
    toaster.dismiss(STATUS_TOAST_ID);
    gameMasterRef.current.actions.gameEnd.returnToMenu();
  }, []);

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
    multiplayerState,
    startMultiplayer: gameMasterRef.current.actions.common.startMultiplayer,
    startSingleplayer: gameMasterRef.current.actions.common.startSingleplayer,
    cancelGame: gameMasterRef.current.actions.common.exitGame,
    hoverCard: gameMasterRef.current.actions.match.highlightCard,
    clickCard: gameMasterRef.current.actions.match.selectCard,
    selectCard: gameMasterRef.current.actions.match.confirmCard,
    chooseRandom,
    rematch: gameMasterRef.current.actions.gameEnd.rematch,
    returnToMenu,
  };

  return (
    <Context.Provider value={contextValue}>
      <Overlay multiplayerState={multiplayerState}>{children}</Overlay>
    </Context.Provider>
  );
}
