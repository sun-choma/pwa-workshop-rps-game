import { requestTimeout } from "@/utils/common";

import * as Eventful from "./types.ts";
import { EventBus } from "../event-bus";

interface NotifierConfig {
  verboseLogging: boolean;
}

export class EventfulState<
  Config extends {
    [Key in keyof Config]: {
      triggers: Config[Key]["triggers"];
      type: Config[Key]["type"];
    };
  },
> {
  public state;
  private readonly initialState;

  private bus = new EventBus<Eventful.EventMap<Config>>();
  public addEventListener = this.bus.addEventListener;
  public addEventListeners = this.bus.addEventListeners;
  public removeEventListener = this.bus.addEventListener;
  public removeEventListeners = this.bus.addEventListeners;

  constructor(
    state: Eventful.State<Config>,
    dispatchMap: Record<
      keyof Eventful.State<Config>,
      keyof Eventful.EventMap<Config>
    >,
    config: NotifierConfig = { verboseLogging: false },
  ) {
    this.state = state;
    this.initialState = structuredClone(state);

    this.state = new Proxy(state, {
      set: <
        Target extends Eventful.State<Config>,
        Key extends keyof Eventful.State<Config>,
      >(
        target: Target,
        key: Key,
        value: Target[Key],
      ) => {
        const prev = target[key];
        try {
          const updateNeeded = target[key] !== value;
          target[key] = value;

          if (updateNeeded) {
            if (config.verboseLogging) {
              console.debug(
                `[PROXY] '${String(key)}' updated: ${prev} → ${value}`,
              );
            }
            const event = dispatchMap[key];
            // Adding minimal artificial throttling to avoid event collisions
            requestTimeout(() =>
              this.bus.dispatch(
                ...([event, value] as unknown as Parameters<
                  typeof this.bus.dispatch
                >),
              ),
            );
          }
          return true;
        } catch (err) {
          if (err instanceof Error)
            console.error(`[PROXY] Update failed: ${err.message}`);
          else throw err;
          return false;
        }
      },
    });
  }

  // Resetting provided keys of state
  public toInitialState(...args: (keyof Eventful.State<Config>)[]) {
    args.forEach((key) => (this.state[key] = this.initialState[key]));
  }
}
