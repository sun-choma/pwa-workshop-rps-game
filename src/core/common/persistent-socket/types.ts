import type { Dictionary } from "@/types/common";
import { EventBus } from "@/core/common/event-bus";

export type EventMap = {
  [Key in keyof WebSocketEventMap]: [event: WebSocketEventMap[Key]];
};

type VanillaSocketArgs = ConstructorParameters<typeof WebSocket>;
type ConstructorArgumentsBase = {
  url: VanillaSocketArgs[0];
  options?: {
    delay?: number;
  };
  protocols?: VanillaSocketArgs[1];
};
export type EventConstructorArguments<
  IncomingMessageMap extends Dictionary<IncomingMessageMap>,
> = ConstructorArgumentsBase & {
  events: readonly (keyof IncomingMessageMap)[];
};
export type BusConstructorArguments<
  IncomingMessageMap extends Dictionary<IncomingMessageMap>,
> = ConstructorArgumentsBase & {
  bus: EventBus<IncomingMessageMap>;
};

export type MessagePayload<Map extends object> = {
  [Key in keyof Map]: Map[Key] extends null
    ? { type: Key }
    : { type: Key; payload: Map[Key] };
};
