import { entries } from "@/utils/common";

import type * as Bus from "./types";

export class EventBus<EventMap extends Bus.ValidEventMap<EventMap>> {
  // Events other than these are ignored completely
  protected events: readonly (keyof EventMap)[] = [];
  protected subscribers = new Map<
    Bus.Event<EventMap>,
    Bus.Callback<EventMap, Bus.Event<EventMap>>[]
  >();
  // Subscription deactivates after single use
  protected consumers = new Map<
    Bus.Event<EventMap>,
    Bus.Callback<EventMap, Bus.Event<EventMap>>[]
  >();

  constructor(events: readonly (keyof EventMap)[]) {
    this.events = events;
  }

  once = <Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) => {
    if (this.has(event)) {
      if (!this.consumers.has(event)) {
        this.consumers.set(event, []);
      }
      this.consumers
        .get(event)
        ?.push(callback as Bus.Callback<EventMap, Bus.Event<EventMap>>);
    }
  };

  addEventListener = <Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) => {
    if (this.has(event)) {
      if (!this.subscribers.has(event)) {
        this.subscribers.set(event, []);
      }
      this.subscribers
        .get(event)
        ?.push(callback as Bus.Callback<EventMap, Bus.Event<EventMap>>);
    }
  };

  addEventListeners = <
    Events extends Partial<{
      [Event in Bus.Event<EventMap>]: Bus.Callback<EventMap, Event>;
    }>,
  >(
    events: Events,
  ) => {
    entries(events).forEach(([event, callback]) => {
      this.addEventListener(
        event as keyof EventMap,
        callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
      );
    });
  };

  removeEventListener = <Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) => {
    if (this.has(event)) {
      const eventSubscribers = this.subscribers.get(event);
      if (!eventSubscribers) return;

      const index = eventSubscribers.indexOf(
        callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
      );
      if (index === -1) {
        console.warn(
          `Unable to remove '${String(event)}' event callback. 
          This could happen if you are trying to unsubscribe a different callback than the one provided during subscription`,
        );
      } else {
        eventSubscribers.splice(index, 1);
      }
    }
  };

  removeEventListeners = <
    Events extends Partial<{
      [Event in Bus.Event<EventMap>]: Bus.Callback<EventMap, Event>;
    }>,
  >(
    events: Events,
  ) => {
    entries(events).forEach(([event, callback]) => {
      this.removeEventListener(
        event as keyof EventMap,
        callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
      );
    });
  };

  dispatch = <Event extends Bus.Event<EventMap>>(
    ...args: Bus.FnArgs<EventMap, Event>
  ) => {
    const [event, payload] = args;
    if (this.has(event)) {
      // Multi-use subscriptions
      const eventSubscribers = this.subscribers.get(event);
      if (eventSubscribers) {
        eventSubscribers.forEach((callback) =>
          callback(
            ...((Array.isArray(payload)
              ? payload
              : [payload]) as EventMap[Event]),
          ),
        );
      }
      // Single-use subscriptions
      const eventConsumers = this.consumers.get(event);
      if (eventConsumers) {
        eventConsumers.forEach((callback) =>
          callback(
            ...((Array.isArray(payload)
              ? payload
              : [payload]) as EventMap[Event]),
          ),
        );
        this.consumers.delete(event);
      }
    }
  };

  private has(event: string | number | symbol) {
    return this.events.includes(event as Bus.Event<EventMap>);
  }
}
