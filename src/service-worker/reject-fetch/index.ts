import {
  FetchDidSucceedCallbackParam,
  WorkboxPlugin,
} from "workbox-core/types";

type PluginModes = "development" | "production" | "test" | "all";

interface RejectFetchPluginOptions {
  mode?: PluginModes;
  rejectNotOk?: boolean;
  rejectOffline?: boolean;
}

/**
 * Due to requests to localhost are still being sent even with offline flag (dev tools)
 * This plugin allow developers to customize simulated network behaviour
 */
export class RejectFetchPlugin implements WorkboxPlugin {
  private readonly mode: PluginModes = "all";
  private readonly rejectNotOk: boolean;
  private readonly rejectOffline: boolean;

  constructor(options: RejectFetchPluginOptions) {
    if (options.mode) this.mode = options.mode;
    this.rejectNotOk = "rejectNotOk" in options ? options.rejectNotOk! : true;
    this.rejectOffline =
      "rejectOffline" in options ? options.rejectOffline! : false;
  }

  async fetchDidSucceed(params: FetchDidSucceedCallbackParam) {
    if (process.env.NODE_ENV === this.mode || this.mode === "all") {
      if (this.rejectNotOk && !params.response.ok)
        throw new Error(
          `${params.response.status} ${params.response.statusText}`,
        );
      if (this.rejectOffline && !self.navigator.onLine)
        throw new Error(`Failed to fetch: offline`);
      else return params.response;
    } else return params.response;
  }
}
