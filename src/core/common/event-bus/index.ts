import { entries } from "@/utils/common";

import type * as Bus from "./types";

export class EventBus<EventMap extends Bus.ValidEventMap<EventMap>> {
  private subscribers = new Map<
    Bus.Event<EventMap>,
    Bus.Callback<EventMap, Bus.Event<EventMap>>[]
  >();

  constructor() {
    this.addEventListener = this.addEventListener.bind(this);
    this.removeEventListener = this.removeEventListener.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  addEventListener<Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers
      .get(event)
      ?.push(callback as Bus.Callback<EventMap, Bus.Event<EventMap>>);
  }

  addEventListeners<
    Events extends Partial<{
      [Event in Bus.Event<EventMap>]: Bus.Callback<EventMap, Event>;
    }>,
  >(events: Events) {
    entries(events).forEach(([event, callback]) => {
      this.addEventListener(
        event as keyof EventMap,
        callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
      );
    });
  }

  removeEventListener<Event extends Bus.Event<EventMap>>(
    event: Event,
    callback: Bus.Callback<EventMap, Event>,
  ) {
    const eventSubscribers = this.subscribers.get(event);
    if (!eventSubscribers) return;

    const index = eventSubscribers.indexOf(
      callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
    );
    if (index !== -1) {
      eventSubscribers.splice(index, 1);
    }
  }

  removeEventListeners<
    Events extends Partial<{
      [Event in Bus.Event<EventMap>]: Bus.Callback<EventMap, Event>;
    }>,
  >(events: Events) {
    entries(events).forEach(([event, callback]) => {
      this.removeEventListener(
        event as keyof EventMap,
        callback as Bus.Callback<EventMap, Bus.Event<EventMap>>,
      );
    });
  }

  dispatch<Event extends Bus.Event<EventMap>>(
    ...args: Bus.FnArgs<EventMap, Event>
  ): void {
    const [event, payload] = args;
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
  }
}
