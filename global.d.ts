import { BeforeInstallPromptEvent } from "@/types/window";

// extending window.addEventListener interface with additional typed beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}
export {};
