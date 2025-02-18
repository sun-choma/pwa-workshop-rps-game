import {
  cancelTimeout,
  requestTimeout,
  TimeoutConfig,
} from "@/utils/common.ts";
import { MergeRecords } from "@/types/common";

type TimerConfig = Partial<MergeRecords<TimeoutConfig, { maxFps: number }>>;

export class Timer {
  private timeoutId: ReturnType<typeof requestTimeout>;
  private readonly config: TimerConfig;

  constructor(config?: TimerConfig) {
    if (config) this.config = config;
    else this.config = {};
    this.timeoutId = { animationFrameId: null };
  }

  public run(seconds: number, config?: Parameters<typeof requestTimeout>[0]) {
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
      this.config?.maxFps,
    );
  }

  public stop() {
    cancelTimeout(this.timeoutId);
  }
}
