import type { MergeRecords } from "@/types/common";

import type * as Bus from "./types";

type TemplateBinder = (...args: never[]) => void;
type ExtractBinderEventMap<Binder extends TemplateBinder> =
  Parameters<Binder>[1] extends Bus.Callback<infer EventMap, never>
    ? EventMap
    : Parameters<Binder>[0] extends Partial<{
          [Event in keyof Parameters<Binder>[0]]: Bus.Callback<
            infer EventMap,
            never
          >;
        }>
      ? EventMap
      : never;

type JoinEventMaps<Array extends TemplateBinder[]> = Bus.ValidEventMap<
  Array extends [infer Binder extends TemplateBinder]
    ? ExtractBinderEventMap<Binder>
    : Array extends [
          infer FirstBinder extends TemplateBinder,
          ...infer RestBinders extends TemplateBinder[],
        ]
      ? MergeRecords<
          ExtractBinderEventMap<FirstBinder>,
          JoinEventMaps<RestBinders>
        >
      : never
>;

const singleEventHandler =
  <Binders extends TemplateBinder[], EventMap = JoinEventMaps<Binders>>(
    ...binders: Binders
  ) =>
  <Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) => {
    binders.forEach((binder) => {
      binder(event as never, callback as never);
    });
  };

const multiEventHandler =
  <Binders extends TemplateBinder[], EventMap = JoinEventMaps<Binders>>(
    ...binders: Binders
  ) =>
  <
    Events extends Partial<{
      [Event in Bus.Event<EventMap>]: Bus.Callback<EventMap, Event>;
    }>,
  >(
    events: Events,
  ) => {
    binders.forEach((binder) => {
      binder(events as never);
    });
  };

// Would be cool to finish this implementation
// const dispatchEventHandler =
//   <Binders extends TemplateBinder[], EventMap = JoinEventMaps<Binders>>(
//     ...binders: Binders
//   ) =>
//   <Event extends Bus.Event<EventMap>>(...args: Bus.FnArgs<EventMap, Event>) => {
//     binders.forEach((dispatch) => {
//       const [event, payload] = args;
//       dispatch(event as never, payload as never);
//     });
//   };

export const merge = {
  addEventListener: singleEventHandler,
  removeEventListener: singleEventHandler,
  once: singleEventHandler,
  addEventListeners: multiEventHandler,
  removeEventListeners: multiEventHandler,
  // dispatch: dispatchEventHandler,
};
