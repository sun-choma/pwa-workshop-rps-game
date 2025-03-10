import {
  CachedResponseWillBeUsedCallbackParam,
  WorkboxPlugin,
} from "workbox-core/types";

export class MetaPlugin implements WorkboxPlugin {
  async cachedResponseWillBeUsed({
    cachedResponse,
  }: CachedResponseWillBeUsedCallbackParam) {
    if (cachedResponse) {
      const { headers, status, statusText } = cachedResponse;

      const json = await cachedResponse.clone().json();
      return new Response(
        JSON.stringify({
          ...json,
          meta: {
            ...json.meta,
            isCached: true,
          },
        }),
        {
          headers,
          status,
          statusText,
        },
      );
    }
  }
}
