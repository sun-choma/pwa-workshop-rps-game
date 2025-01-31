import { CardAttribute, RematchDecision } from "@/core/game/types";

export interface SendPayloadMap {
  "set-name": [playerName: string];
  "turn-start": null;
  "turn-finished": null;
  "hover-card": [cardIndex: number | null];
  "select-card": [cardIndex: number | null];
  "attr-sent": [attr: CardAttribute];
  "rematch-decision": [decision: RematchDecision];
}

export interface MessagePayloadMap {
  "match-found": [opponentName: string];
  "turn-start": null;
  "turn-finished": null;
  "hover-card": [cardIndex: number | null];
  "select-card": [cardIndex: number | null];
  "attr-sent": [attr: CardAttribute];
  "rematch-decision": [decision: RematchDecision];
  "opponent-left": null;
}
