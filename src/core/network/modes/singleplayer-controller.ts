import { generate } from "random-words";

import type * as Bus from "@/core/common/event-bus/types";
import { EventBus } from "@/core/common/event-bus";
import { REMATCH_DECISIONS } from "@/core/game/constants";
import { TURN_RESULTS_TIME, TURN_TIME } from "@/providers/game/constants";
import { selectRandomCard } from "@/utils/game";
import { cancelTimeout, getRandomEmoji, requestTimeout } from "@/utils/common";
import { offsetRandom, randomSum } from "@/utils/math";

import type { MessagePayloadMap, SendPayloadMap } from "../types";

export class SingleplayerController {
  private messageBus;
  private turnStepTimeout: ReturnType<typeof requestTimeout> | null = null;

  constructor(bus: EventBus<MessagePayloadMap>) {
    this.messageBus = bus;
  }

  startGame() {
    this.messageBus.dispatch(
      "match-found",
      `${getRandomEmoji()} ${(generate(offsetRandom(1, 3)) as string[]).join("-")}`,
    );
    this.offlineTurn();
  }

  endGame() {
    if (this.turnStepTimeout !== null) {
      cancelTimeout(this.turnStepTimeout);
      this.turnStepTimeout = null;
    }
  }

  send = <Event extends Bus.Event<SendPayloadMap>>(
    ...args: Bus.FnArgs<SendPayloadMap, Event>
  ) => {
    const [event, payload] = args;
    console.debug(`[SP] Sending message: ${JSON.stringify(args, null, 2)}`);

    switch (event) {
      case "turn-start":
        this.messageBus.dispatch("turn-start");
        this.offlineTurn();
        break;
      case "attr-sent":
        this.messageBus.dispatch("attr-sent", selectRandomCard());
        break;
      case "send-emoji":
        requestTimeout(
          () => this.messageBus.dispatch("receive-emoji", getRandomEmoji()),
          500,
        );
        break;
      case "rematch-decision":
        if (payload === REMATCH_DECISIONS.REMATCH) {
          this.messageBus.dispatch(
            "rematch-decision",
            REMATCH_DECISIONS.REMATCH,
          );
          this.messageBus.dispatch("rematch");
          this.offlineTurn();
        }
        break;
    }
  };

  private offlineTurn() {
    const decideAfter = offsetRandom(
      TURN_RESULTS_TIME * 1000,
      (TURN_TIME / 2) * 1000,
    );
    console.debug(`[SP] Opponent will decide in ${decideAfter} ms`);

    const dispatchHover = (index: number | null) =>
      this.messageBus.dispatch("hover-card", index);

    const dispatchSelect = (index: number) => {
      this.messageBus.dispatch("select-card", index);
      this.messageBus.dispatch("turn-finished");
    };

    const hoverBehavior = randomSum(decideAfter, 500);
    let stepIndex = 0;

    const nextStep = () => {
      const isLastStep = hoverBehavior[stepIndex + 1] === undefined;

      console.debug(
        `[SP] Starting new step in ${hoverBehavior[stepIndex]} ms...`,
      );
      this.turnStepTimeout = requestTimeout(() => {
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
