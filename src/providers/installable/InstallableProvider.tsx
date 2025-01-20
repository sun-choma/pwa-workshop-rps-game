import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { Context } from "@/providers/installable/context.ts";
import type { BeforeInstallPromptEvent } from "@/types/window.ts";
import { usePwa } from "@/hooks/usePwa.ts";

// Practically determine appropriate value
const TIMEOUT_MS = 5000;

export function InstallableProvider({ children }: { children: ReactNode }) {
  const { isInstalled } = usePwa();

  const [installEvent, setInstallEvent] = useState<
    BeforeInstallPromptEvent | undefined | null
  >(isInstalled ? null : undefined);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const installPromptHandler = (e: BeforeInstallPromptEvent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      e.preventDefault();
      setInstallEvent(e);
    };

    const setNotInstallable = () => setInstallEvent(null);

    window.addEventListener("beforeinstallprompt", installPromptHandler);
    timeoutRef.current = setTimeout(setNotInstallable, TIMEOUT_MS);
    return () => {
      window.removeEventListener("beforeinstallprompt", installPromptHandler);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isInstalled) setInstallEvent(null);
  }, [isInstalled]);

  const contextValue = useMemo(
    () => ({
      event: installEvent,
      isInstallable: !!installEvent,
    }),
    [installEvent],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
