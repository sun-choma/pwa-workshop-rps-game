import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { registerRoute, setDefaultHandler } from "workbox-routing";
import { NetworkFirst, NetworkOnly } from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { RejectFetchPlugin } from "@/service-worker/reject-fetch";
import { MetaPlugin } from "@/service-worker/meta";

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: {
    revision: string | null;
    url: string;
  }[];
};
export {};

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
setDefaultHandler(new NetworkOnly());

registerRoute(
  /.*\/stats(?:\?.*)?$/,
  new NetworkFirst({
    cacheName: "stats-cache",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 60 * 60 * 24,
      }),
      new RejectFetchPlugin({
        mode: "development",
        rejectOffline: true,
      }),
      new MetaPlugin(),
    ],
  }),
);

self.addEventListener("message", async (event) => {
  switch (event.data.type) {
    case "SKIP_WAITING":
      await self.skipWaiting();
      break;
    default:
      console.debug(`New message: ${JSON.stringify(event.data)}`);
  }
});
