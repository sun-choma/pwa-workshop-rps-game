import { PersistentSocket } from "@/core/common/persistent-socket";
import type { MessagePayloadMap, SendPayloadMap } from "@/core/network/types";
import { SOCKET_EVENTS } from "@/core/network/constants";

// TODO: Maybe this class should only be a middleware between SW and Core
export class GameServerAdapter {
  private socket = new PersistentSocket<MessagePayloadMap, SendPayloadMap>({
    url: "ws://localhost:443",
    events: SOCKET_EVENTS,
    // options: {
    //   delay: 100,
    // },
  });
  public addEventListener = this.socket.messageEvents.addEventListener;
  public addEventListeners = this.socket.messageEvents.addEventListeners;
  public removeEventListener = this.socket.messageEvents.removeEventListener;
  public removeEventListeners = this.socket.messageEvents.removeEventListeners;
  public send = this.socket.send;

  // TODO: provide meta info on mode being used (online/offline)
  // TODO: dont forget to use some form of timeout when waiting on bus events
  constructor() {
    // this.bus.addEventListener("turn-sync", this.offlineTurn.bind(this));
  }

  startMatchmaking(playerName: string) {
    this.socket.connect();
    this.socket.events.once("open", () =>
      this.socket.send("set-name", playerName),
    );

    // FIXME: OFFLINE LOGIC
    // requestTimeout(() => {
    //   this.bus.dispatch("match-found", DEFAULT_OPPONENT_NAME);
    //   this.offlineTurn();
    // }, 300);
  }

  disconnect() {
    this.socket.close();
  }

  // TODO: add network implementation for online mode
  // notify<Event extends Bus.Event<SendPayloadMap>>(
  //   ...args: Bus.FnArgs<SendPayloadMap, Event>
  // ) {
  // this.socket.send(args);
  // for single player: when user initiates card exchange - trigger same event from opponent side
  // switch (event) {
  //   case "attr-sent":
  // requestTimeout(() => {
  //   this.bus.dispatch("attr-sent", selectRandomCard());
  // }, 200);
  // break;
  // case "rematch-decision":
  //   if (payload === REMATCH_DECISION.REMATCH) {
  // requestTimeout(() => {
  //   this.bus.dispatch("rematch-decision", REMATCH_DECISION.REMATCH);
  // }, 200);
  // }
  // break;
  // default:
  // this.bus.dispatch(
  //   ...(args as Bus.FnArgs<SocketEventMap, Bus.Event<SocketEventMap>>),
  // );
  // break;
  // }

  // private offlineTurn() {
  //   const decideAfter = offsetRandom(
  //     TURN_RESULTS_TIME * 1000,
  //     (TURN_TIME / 2) * 1000,
  //   );
  //   console.log(`[SOCKET] Opponent will decide in ${decideAfter} ms`);
  //
  //   const dispatchHover = (index: number | null) =>
  //     this.bus.dispatch("hover-card", index);
  //
  //   const dispatchSelect = (index: number) => {
  //     this.bus.dispatch("select-card", index);
  //     this.bus.dispatch("turn-finished");
  //   };
  //
  //   const hoverBehavior = randomSum(decideAfter, 500);
  //   let stepIndex = 0;
  //
  //   const nextStep = () => {
  //     const isLastStep = hoverBehavior[stepIndex + 1] === undefined;
  //
  //     requestTimeout(() => {
  //       const method = isLastStep ? dispatchSelect : dispatchHover;
  //       const randomCardIndex = offsetRandom(0, 2);
  //       method(randomCardIndex);
  //       stepIndex += 1;
  //       if (isLastStep) dispatchHover(null);
  //       else nextStep();
  //     }, hoverBehavior[stepIndex]);
  //   };
  //   nextStep();
  // }
}

// import type * as Socket from "@/core/common/persistent-socket/types";
// import type * as Bus from "@/core/common/event-bus/types";
// import { REMATCH_DECISION } from "@/core/game/constants";
// import { EventBus } from "@/core/common/event-bus";
// import { offsetRandom, randomSum } from "@/utils/math";
// import { requestTimeout } from "@/utils/common";
// import { TURN_RESULTS_TIME, TURN_TIME } from "@/providers/game/constants";

// type SocketEventMap = {
//   "match-found": [playerName: string];
//   "hover-card": [cardIndex: number | null];
//   "select-card": [cardIndex: number | null];
//   "turn-finished": null;
//   "attr-sent": [attr: CardAttribute];
//   "turn-sync": null;
//   "rematch-decision": [RematchDecision];
// };
