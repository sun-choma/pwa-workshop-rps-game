import { ReactNode, useCallback, useEffect, useState } from "react";

import { Context } from "@/providers/game/context";
import { CARD_ATTRIBUTE, OUTCOME } from "@/constants";
import { GAME_PHASES } from "@/providers/game/types";
import {
  MAX_LIVES,
  TURN_RESULTS_TIME,
  TURN_TIME,
} from "@/providers/game/constants";
import { isStronger } from "@/utils";
import { useSocket } from "@/hooks/useSocket";
import { useTimer } from "@/hooks/useTimer";

// TODO: check if there can be a better architectural solution for this
//  Попробовать через EventBus, где этот компонент просто подписывается на изменения внутри инстанса
//  класса и просто отражает эти измнения в стейт, который по контексту передается ниже. Вся логика в таком случае
//  будет отрабатывать в рамках класса
export function GameProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<GAME_PHASES>(GAME_PHASES.INIT);
  const { time, startTimer, stopTimer } = useTimer();

  const [playerName, setPlayerName] = useState("");
  const [playerLives, setPlayerLives] = useState(MAX_LIVES);
  const [playerCard, setPlayerCard] = useState<CARD_ATTRIBUTE>();

  const [opponentName, setOpponentName] = useState("");
  const [opponentLives, setOpponentLives] = useState(MAX_LIVES);
  const [opponentHoverIndex, setOpponentHoverIndex] = useState<number | null>(
    null,
  );
  const [opponentSelectionIndex, setOpponentSelectionIndex] = useState<
    number | null
  >(null);

  const [opponentCard, setOpponentCard] = useState<CARD_ATTRIBUTE>();
  const [isOpponentTurnEnded, setOpponentTurnEnd] = useState(false);

  // [PLAYER] Start opponent search
  const startMatchmaking = useCallback((playerName: string) => {
    setPlayerName(playerName);
    setPhase(GAME_PHASES.MATCHING);
  }, []);

  // [SOCKET] Starts RPS match
  const startGame = useCallback(
    (opponentName: string) => {
      setOpponentName(opponentName);
      setPhase(GAME_PHASES.PLAYERS_TURN);
      startTimer(TURN_TIME);
    },
    [startTimer],
  );

  // [SOCKET] Signal that opponent finished card selection
  const setOpponentReady = useCallback(() => setOpponentTurnEnd(true), []);

  // [HOOK] Handles socket communication via event bus
  const { sendTurnFinish, sendAttr } = useSocket({
    playerName,
    onMatchFound: startGame,
    onHoverCard: setOpponentHoverIndex,
    onSelectCard: setOpponentSelectionIndex,
    onTurnReady: setOpponentReady,
    onAttrReceived: setOpponentCard,
  });

  // [PLAYER] Select card before turn timer runs out
  const selectPlayerCard = useCallback(
    (attr: CARD_ATTRIBUTE) => {
      setPlayerCard(attr);
      sendTurnFinish();
      console.log("Player is ready");
    },
    [sendTurnFinish],
  );

  // [AUTOMATIC] Handle card selection on timeout
  useEffect(() => {
    if (
      phase === GAME_PHASES.PLAYERS_TURN &&
      time === 0 &&
      playerCard === undefined
    )
      selectPlayerCard(CARD_ATTRIBUTE.NONE);
  }, [phase, time, playerCard, selectPlayerCard]);

  // [AUTOMATIC] Send player card when both players are ready
  useEffect(() => {
    if (
      phase === GAME_PHASES.PLAYERS_TURN &&
      isOpponentTurnEnded &&
      playerCard !== undefined
    ) {
      sendAttr(playerCard);
      stopTimer();
    }
  }, [isOpponentTurnEnded, phase, playerCard, sendAttr, stopTimer]);

  // [AUTOMATIC] Switch to turn results when opponent card is received
  useEffect(() => {
    if (
      phase === GAME_PHASES.PLAYERS_TURN &&
      playerCard !== undefined &&
      opponentCard !== undefined
    ) {
      startTimer(TURN_RESULTS_TIME);
      setPhase(GAME_PHASES.TURN_RESULTS);

      const outcome = isStronger(playerCard, opponentCard);
      if (outcome === OUTCOME.PLAYER_WON)
        setOpponentLives((current) => current - 1);
      else if (outcome === OUTCOME.OPPONENT_WON)
        setPlayerLives((current) => current - 1);
    }
  }, [opponentCard, phase, playerCard, startTimer]);

  // [AUTOMATIC] Switch to turn when results show time has run out
  useEffect(() => {
    if (phase === GAME_PHASES.TURN_RESULTS && time === 0) {
      setPlayerCard(undefined);
      setOpponentCard(undefined);
      setOpponentTurnEnd(false);
      setOpponentSelectionIndex(null);
      setPhase(GAME_PHASES.PLAYERS_TURN);
      startTimer(TURN_TIME);
    }
  }, [phase, startTimer, time]);

  const contextValue = {
    game: {
      phase,
      remainingTime: time,
      turnOutcome: isStronger(playerCard, opponentCard),
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
      isReady: isOpponentTurnEnded
    },
    startMatchmaking,
    selectCard: selectPlayerCard,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
