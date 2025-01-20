import { useCallback, useEffect, useState } from "react";

import { CARD_ATTRIBUTE } from "@/constants.ts";
import { SocketEventBus } from "@/hooks/useSocket/controller.ts";

interface UseSocketParams {
  playerName: string | undefined;
  onMatchFound: (opponentName: string) => void;
  onHoverCard: (cardIndex: number | null) => void;
  onSelectCard: (cardIndex: number | null) => void;
  onTurnReady: () => void;
  onAttrReceived: (attr: CARD_ATTRIBUTE) => void;
}

export function useSocket({
  playerName,
  onMatchFound,
  onHoverCard,
  onSelectCard,
  onTurnReady,
  onAttrReceived,
}: UseSocketParams) {
  const [eventBus, setEventBus] = useState<SocketEventBus>();

  // [AUTOMATIC] Init socket on player name set
  useEffect(() => {
    if (playerName) setEventBus(new SocketEventBus());
  }, [onMatchFound, playerName]);

  // [PLAYER] hovering card
  const sendCardHover = useCallback(
    (cardIndex: number) => eventBus?.send("hover-card", [cardIndex]),
    [eventBus],
  );

  // [PLAYER] selecting/deselecting card
  const sendCardSelection = useCallback(
    (cardIndex: number | null) => eventBus?.send("select-card", [cardIndex]),
    [eventBus],
  );

  // [PLAYER] finished card selection
  const sendTurnFinish = useCallback(
    () => eventBus?.send("turn-ready"),
    [eventBus],
  );

  // [PLAYER] both players selected cards, sending card info
  const sendAttr = useCallback(
    (attr: CARD_ATTRIBUTE) => eventBus?.send("attr-sent", [attr]),
    [eventBus],
  );

  useEffect(() => {
    eventBus?.addEventListener("match-found", onMatchFound);
    eventBus?.addEventListener("hover-card", onHoverCard);
    eventBus?.addEventListener("select-card", onSelectCard);
    eventBus?.addEventListener("turn-ready", onTurnReady);
    eventBus?.addEventListener("attr-sent", onAttrReceived);

    return () => {
      eventBus?.removeEventListener("match-found", onMatchFound);
      eventBus?.removeEventListener("hover-card", onHoverCard);
      eventBus?.removeEventListener("select-card", onSelectCard);
      eventBus?.removeEventListener("turn-ready", onTurnReady);
      eventBus?.removeEventListener("attr-sent", onAttrReceived);
    };
  }, [
    eventBus,
    onMatchFound,
    onTurnReady,
    onAttrReceived,
    onHoverCard,
    onSelectCard,
  ]);

  return { sendCardHover, sendCardSelection, sendAttr, sendTurnFinish };
}
