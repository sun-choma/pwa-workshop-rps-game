export type EventMap = {
  [Key in keyof WebSocketEventMap]: [event: WebSocketEventMap[Key]];
};

type VanillaSocketArgs = ConstructorParameters<typeof WebSocket>;
export type ConstructorArguments = {
  url: VanillaSocketArgs[0];
  options?: {
    delay?: number;
  };
  protocols?: VanillaSocketArgs[1];
};

export type MessagePayload<Map extends object> = {
  [Key in keyof Map]: Map[Key] extends null
    ? { type: Key }
    : { type: Key; payload: Map[Key] };
};
