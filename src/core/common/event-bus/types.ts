export type Event<EventMap extends { [Key in keyof EventMap]: EventMap[Key] }> =
  keyof EventMap;

export type Callback<
  EventMap extends { [Key in keyof EventMap]: EventMap[Key] },
  Ev extends Event<EventMap>,
> = (...payload: EventMap[Ev]) => void;

export type FnArgs<
  EventMap extends { [Key in keyof EventMap]: EventMap[Key] },
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

export type MergedMaps<
  FirstMap extends ValidEventMap<FirstMap>,
  SecondsMap extends ValidEventMap<SecondsMap>,
> = {
  [Key in keyof FirstMap | keyof SecondsMap]: Key extends keyof FirstMap
    ? FirstMap[Key]
    : Key extends keyof SecondsMap
      ? SecondsMap[Key]
      : never;
};
