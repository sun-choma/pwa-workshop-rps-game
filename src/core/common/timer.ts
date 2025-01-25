import { cancelTimeout, requestTimeout } from "@/utils/common.ts";

type TimeoutConfig = Parameters<typeof requestTimeout>[0];

export class Timer {
  private timeoutId: ReturnType<typeof requestTimeout>;
  private readonly config: TimeoutConfig;

  constructor(config?: TimeoutConfig) {
    if (config) this.config = config;
    else this.config = {};
    this.timeoutId = { animationFrameId: null };
  }

  public run(seconds: number, config?: TimeoutConfig) {
    this.stop();
    this.timeoutId = requestTimeout(
      {
        onTick: (remainingTime) => {
          if (typeof config === "object") config.onTick?.(remainingTime);
          else if (typeof this.config === "object")
            this.config.onTick?.(remainingTime);
        },
        onTimeout: () => {
          if (config) {
            if (typeof config === "object") config.onTimeout?.();
            else if (typeof this.config === "object") this.config.onTimeout?.();
            else config();
          }
        },
      },
      seconds * 1000,
    );
  }

  public stop() {
    cancelTimeout(this.timeoutId);
  }
}
