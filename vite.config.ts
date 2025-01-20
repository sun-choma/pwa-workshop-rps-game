import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  root: "./",
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
  base: "/pwa-workshop-rps/",
  plugins: [
    react(),
    /** Plugin for serving/building service worker from  sw.ts file
     *  Extends args from WorkboxWebpackPlugin and provides additional settings */
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      injectRegister: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        short_name: "PWA RPS",
        name: "PWA Rock-Paper-Scissors",
        description: "Offline-ready Rock-Paper-Scissors web application",
        // TODO: update icon
        icons: [
          {
            src: `/pwa-workshop-rps/logo/pwa-logo.svg`,
            sizes: "800x800",
            type: "image/svg+xml",
          },
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#BD34FE",
        background_color: "#242424",
        // TODO: update screenshots
        screenshots: [
          {
            src: `/pwa-workshop-rps/screenshots/image.jpg`,
            sizes: "1280x720",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: `/pwa-workshop-rps/screenshots/image.jpg`,
            sizes: "1280x720",
            type: "image/jpeg",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
