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
  base: "/pwa-workshop-rps-game/",
  server: {
    proxy: {
      "https://pwa-workshop-rps-server.glitch.me": {
        target: `http://localhost:3000`,
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^https:\/\/pwa-workshop-rps-server.glitch.me/, ""),
      },
    },
  },
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
        globPatterns: ["**/*.{js,css,html,svg,woff2}"],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
      manifest: {
        short_name: "RPS Game",
        name: "Rock-Paper-Scissors PWA",
        description:
          "A modern Rock-Paper-Scissors game designed to teach frontend developers core PWA principles. Features a robust event-driven architecture and online play using WebSockets.",
        icons: [
          {
            src: `/pwa-workshop-rps-game/logo/rps-logo.svg`,
            sizes: "144x144",
            type: "image/svg+xml",
          },
        ],
        start_url: "/pwa-workshop-rps-game",
        display: "standalone",
        theme_color: "#BD34FE",
        background_color: "#242424",
        screenshots: [
          {
            src: `/pwa-workshop-rps-game/screenshots/mobile/main-menu.jpg`,
            sizes: "390x844",
            type: "image/jpeg",
            form_factor: "narrow",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/mobile/game-turn.jpg`,
            sizes: "390x844",
            type: "image/jpeg",
            form_factor: "narrow",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/mobile/game-finished.jpg`,
            sizes: "390x844",
            type: "image/jpeg",
            form_factor: "narrow",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/mobile/splash-screen.jpg`,
            sizes: "390x844",
            type: "image/jpeg",
            form_factor: "narrow",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/desktop/main-menu.jpg`,
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/desktop/game-turn.jpg`,
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/desktop/game-finished.jpg`,
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
          },
          {
            src: `/pwa-workshop-rps-game/screenshots/desktop/splash-screen.jpg`,
            sizes: "1920x1080",
            type: "image/jpeg",
            form_factor: "wide",
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
