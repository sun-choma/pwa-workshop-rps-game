import { EventBus } from "@/core/common/event-bus";
import type * as Bus from "@/core/common/event-bus/types";
import { requestTimeout } from "@/utils/common";
import type { Dictionary } from "@/types/common";

import type * as Socket from "./types";
import { BusConstructorArguments, EventConstructorArguments } from "./types";

const RECONNECT_DELAY = [0, 0, 1, 2, 3, 5, 10, 15, 30];
const WEBSOCKET_EVENTS = ["open", "message", "close", "error"] as const;

export class PersistentSocket<
  IncomingMessageMap extends Dictionary<IncomingMessageMap>,
  OutgoingMessageMap extends Dictionary<OutgoingMessageMap>,
> {
  private socket: WebSocket | null = null;
  private readonly url;
  private readonly protocols;
  private readonly options;
  private delayIndex = 0;
  public readonly readyState = this.socket?.readyState;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly eventBus;
  public events;

  private readonly messageBus;
  public messageEvents;

  constructor({
    url,
    protocols,
    options,
    ...restArgs
  }:
    | EventConstructorArguments<IncomingMessageMap>
    | BusConstructorArguments<IncomingMessageMap>) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;

    this.eventBus = new EventBus<Socket.EventMap>(WEBSOCKET_EVENTS);
    this.eventBus.addEventListeners({
      open: this.handleOpen.bind(this),
      close: this.handleClose.bind(this),
      message: this.handleMessage.bind(this),
      error: this.handleError.bind(this),
    });

    if ("bus" in restArgs) this.messageBus = restArgs.bus;
    else this.messageBus = new EventBus<IncomingMessageMap>(restArgs.events);

    // Forwarding merged methods for composition usage
    this.events = {
      once: this.eventBus.once,
      addEventListener: this.eventBus.addEventListener,
      addEventListeners: this.eventBus.addEventListeners,
      removeEventListener: this.eventBus.removeEventListener,
      removeEventListeners: this.eventBus.removeEventListeners,
    };
    this.messageEvents = {
      once: this.messageBus.once,
      addEventListener: this.messageBus.addEventListener,
      addEventListeners: this.messageBus.addEventListeners,
      removeEventListener: this.messageBus.removeEventListener,
      removeEventListeners: this.messageBus.removeEventListeners,
    };
  }

  public send = <Event extends Bus.Event<OutgoingMessageMap>>(
    ...args: Bus.FnArgs<OutgoingMessageMap, Event>
  ) => {
    const [event, payload] = args;
    console.debug(`[WS] Sending message: ${JSON.stringify(args, null, 2)}`);

    const fn = () =>
      this.socket?.send(
        JSON.stringify({
          type: event,
          ...(payload !== undefined && { payload }),
        }),
      );

    if (this.options?.delay && this.options.delay >= 0)
      requestTimeout(fn, this.options.delay);
    else fn();
  };

  public connect = () => {
    const createConnection = () => {
      console.debug("[WS] Connecting...");
      this.socket = new WebSocket(this.url, this.protocols);
      this.socket.onopen = (e) => this.eventBus.dispatch("open", e);
      this.socket.onclose = (e) => this.eventBus.dispatch("close", e);
      this.socket.onerror = (e) => this.eventBus.dispatch("error", e);
      this.socket.onmessage = (e) => this.eventBus.dispatch("message", e);
    };

    if (RECONNECT_DELAY[this.delayIndex] === 0) createConnection();
    else
      this.reconnectTimeout = setTimeout(
        createConnection,
        RECONNECT_DELAY[this.delayIndex] * 1000,
      );
  };

  public close = (...args: Parameters<WebSocket["close"]>) => {
    this.socket?.close(...args);
    this.socket = null;

    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = null;
  };

  private handleMessage<Event extends keyof IncomingMessageMap>(
    e: MessageEvent,
  ) {
    console.debug(`[WS] Message received!\nMessage: ${String(e.data)}`);

    const json: { type: Event; payload: IncomingMessageMap[Event] } =
      JSON.parse(e.data);

    const fn = () =>
      this.messageBus.dispatch(
        ...([json.type, json.payload] as unknown as Bus.FnArgs<
          IncomingMessageMap,
          Event
        >),
      );

    if (this.options?.delay && this.options.delay >= 0)
      requestTimeout(fn, this.options.delay);
    else fn();
  }

  private handleOpen() {
    console.debug("[WS] Connection opened successfully");
    this.delayIndex = 0;
  }

  private handleError() {
    console.debug("[WS] Connection error");
  }

  private handleClose(e: CloseEvent) {
    console.debug("[WS] connection closed");
    if (this.socket) {
      this.socket.onmessage = null;
      this.socket.onopen = null;
      this.socket.onclose = null;
      this.socket.onerror = null;
      this.socket = null;
    }

    if (!e.wasClean) {
      this.delayIndex = Math.min(
        this.delayIndex + 1,
        RECONNECT_DELAY.length - 1,
      );
      console.log(
        `[WS] Close wasn't clean, attempting reconnect in ${RECONNECT_DELAY[this.delayIndex]} seconds`,
      );
      this.connect();
    }
  }
}
