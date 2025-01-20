import { CARD_ATTRIBUTE } from "@/constants.ts";
import { offsetRandom, randomSum, selectRandomCard } from "@/utils.ts";
import { TURN_RESULTS_TIME, TURN_TIME } from "@/providers/game/constants.ts";

import { DEFAULT_OPPONENT_NAME } from "./constants.ts";

type EventMap = {
  "match-found": [playerName: string];
  "hover-card": [cardIndex: number | null];
  "select-card": [cardIndex: number | null];
  "turn-ready": never;
  "attr-sent": [attr: CARD_ATTRIBUTE];
};
type SendEventMap = Omit<EventMap, "match-found">;

type EventArgs<Event extends SocketEvent> = EventMap[Event] extends never
  ? [event: Event]
  : [event: Event, payload: EventMap[Event]];

export type SocketEvent = keyof EventMap;

export class SocketEventBus {
  // eslint-disable-next-line
  private subscribers: Map<SocketEvent, ((...payload: any[]) => void)[]>;

  private _offlineTurn() {
    const decideAfter = offsetRandom(
      TURN_RESULTS_TIME * 1000,
      (TURN_TIME / 2) * 1000,
    );
    console.log(`[SOCKET] Opponent will decide in ${decideAfter} ms`);

    const dispatchHover = (index: number | null) =>
      this.dispatch("hover-card", [index]);

    const dispatchSelect = (index: number) => {
      this.dispatch("select-card", [index]);
      this.dispatch("turn-ready");
    };

    const hoverBehavior = randomSum(decideAfter, 500);
    let stepIndex = 0;

    const nextStep = () => {
      const isLastStep = hoverBehavior[stepIndex + 1] === undefined;

      setTimeout(() => {
        const method = isLastStep ? dispatchSelect : dispatchHover;
        const randomCardIndex = offsetRandom(0, 2);
        method(randomCardIndex);
        stepIndex += 1;
        if (isLastStep) dispatchHover(null);
        else nextStep();
      }, hoverBehavior[stepIndex]);
    };
    nextStep();
  }

  // TODO: provide meta info on mode being used (online/offline)
  // TODO: dont forget to use some form of timeout when waiting on bus events
  // Event bus is created upon player initiates connection
  constructor() {
    this.subscribers = new Map();
    setTimeout(() => {
      this.dispatch("match-found", [DEFAULT_OPPONENT_NAME]);
      this._offlineTurn();
    }, 300);
  }

  addEventListener<Event extends SocketEvent>(
    event: Event,
    callback: (...payload: EventMap[Event]) => void,
  ) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)?.push(callback);
  }

  removeEventListener<Event extends SocketEvent>(
    event: Event,
    callback: (...payload: EventMap[Event]) => void,
  ) {
    const eventSubscribers = this.subscribers.get(event);
    if (!eventSubscribers) return;

    const index = eventSubscribers.indexOf(callback);
    if (index !== -1) {
      eventSubscribers.splice(index, 1);
    }
  }

  private dispatch<Event extends SocketEvent>(...args: EventArgs<Event>): void {
    const [event, payload] = args;
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.forEach((callback) =>
        callback(...(Array.isArray(payload) ? payload : [payload])),
      );
    }
  }

  // TODO: this needs to be implemented only for online mode
  //  as CPU doesn't care about users actions
  send<Event extends keyof SendEventMap>(...args: EventArgs<Event>) {
    const [event, payload] = args;
    // for single player: when user initiates card exchange - trigger same event from opponent side
    if (event === "attr-sent")
      setTimeout(() => {
        this.dispatch("attr-sent", [selectRandomCard()]);
        setTimeout(() => this._offlineTurn(), TURN_RESULTS_TIME * 1000);
      }, 100);
    // TODO: CPU thinks of its next turn
  }
}
