export type Event<EventMap extends ValidEventMap<EventMap>> = keyof EventMap;

export type Callback<
  EventMap extends ValidEventMap<EventMap>,
  Ev extends Event<EventMap>,
> = (...payload: EventMap[Ev]) => void;

export type FnArgs<
  EventMap extends ValidEventMap<EventMap>,
  Ev extends Event<EventMap>,
> = EventMap[Ev] extends null ? [Ev] : [event: Ev, ...payload: EventMap[Ev]];

export type ValidEventMap<EventMap> = {
  [Key in keyof EventMap as IsArrayOrNull<EventMap[Key]> extends never
    ? never
    : Key]: EventMap[Key];
};

type IsArrayOrNull<Type> = Type extends unknown[]
  ? Type
  : Type extends null
    ? Type
    : never;
