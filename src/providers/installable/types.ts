import { BeforeInstallPromptEvent } from "@/types/window.ts";

export interface InstallableContext {
  isInstallable: boolean;
  event: BeforeInstallPromptEvent | undefined | null;
}
