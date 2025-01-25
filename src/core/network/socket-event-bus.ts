import { offsetRandom, randomSum } from "@/utils/math";
import { selectRandomCard } from "@/utils/game";
import { requestTimeout } from "@/utils/common";
import { TURN_RESULTS_TIME, TURN_TIME } from "@/providers/game/constants";
import { DEFAULT_OPPONENT_NAME, REMATCH_DECISION } from "@/core/game/constants";
import type { CardAttribute, RematchDecision } from "@/core/game/types";
import { EventBus } from "@/core/common/event-bus";
import type * as Bus from "@/core/common/event-bus/types";

type SocketEventMap = {
  "match-found": [playerName: string];
  "hover-card": [cardIndex: number | null];
  "select-card": [cardIndex: number | null];
  "turn-ready": null;
  "attr-sent": [attr: CardAttribute];
  "turn-sync": null;
  "rematch-decision": [RematchDecision];
};

// TODO: Maybe this class should only be a middleware between SW and Core
export class SocketEventBus {
  private bus = new EventBus<SocketEventMap>();
  public addEventListener = this.bus.addEventListener;
  public addEventListeners = this.bus.addEventListeners;
  public removeEventListener = this.bus.removeEventListener;
  public removeEventListeners = this.bus.removeEventListeners;

  // TODO: provide meta info on mode being used (online/offline)
  // TODO: dont forget to use some form of timeout when waiting on bus events
  constructor() {
    this.bus.addEventListener("turn-sync", this.offlineTurn.bind(this));
  }

  // TODO: add network implementation for online mode
  notify<Event extends Bus.Event<SocketEventMap>>(
    ...args: Bus.FnArgs<SocketEventMap, Event>
  ) {
    const [event, payload] = args;
    // for single player: when user initiates card exchange - trigger same event from opponent side
    switch (event) {
      case "attr-sent":
        requestTimeout(() => {
          this.bus.dispatch("attr-sent", selectRandomCard());
        }, 200);
        break;
      case "rematch-decision":
        if (payload === REMATCH_DECISION.REMATCH) {
          requestTimeout(() => {
            this.bus.dispatch("rematch-decision", REMATCH_DECISION.REMATCH);
          }, 200);
        }
        break;
      default:
        this.bus.dispatch(
          ...(args as Bus.FnArgs<SocketEventMap, Bus.Event<SocketEventMap>>),
        );
        break;
    }
  }

  startMatchmaking() {
    requestTimeout(() => {
      this.bus.dispatch("match-found", DEFAULT_OPPONENT_NAME);
      this.offlineTurn();
    }, 300);
  }

  private offlineTurn() {
    const decideAfter = offsetRandom(
      TURN_RESULTS_TIME * 1000,
      (TURN_TIME / 2) * 1000,
    );
    console.log(`[SOCKET] Opponent will decide in ${decideAfter} ms`);

    const dispatchHover = (index: number | null) =>
      this.bus.dispatch("hover-card", index);

    const dispatchSelect = (index: number) => {
      this.bus.dispatch("select-card", index);
      this.bus.dispatch("turn-ready");
    };

    const hoverBehavior = randomSum(decideAfter, 500);
    let stepIndex = 0;

    const nextStep = () => {
      const isLastStep = hoverBehavior[stepIndex + 1] === undefined;

      requestTimeout(() => {
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
}
