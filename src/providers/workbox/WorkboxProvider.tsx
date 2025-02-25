import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Workbox, WorkboxLifecycleEvent } from "workbox-window";

import { toaster } from "@/components/ui/toaster";

import { WorkboxInstance } from "./types.ts";
import { Context } from "./context.ts";

const SW_UPDATE_TOAST_ID = Symbol("Id of SW update toast").toString();

export function WorkerProvider({ children }: { children: ReactNode }) {
  const [worker, setWorker] = useState<WorkboxInstance>();
  const isRefreshing = useRef(false);

  const contextValue = useMemo(() => ({ worker }), [worker]);

  const updateWorker = useCallback((sw: Workbox, isInitial = false) => {
    const handleSkipWaiting = () => sw.messageSkipWaiting();
    const handleRefresh = () => window.location.reload();

    toaster.loading({
      title: isInitial
        ? "App is ready for offline usage"
        : "New version available",
      description: isInitial ? "Refresh to activate" : "Refresh to apply",
      action: {
        label: "Refresh",
        onClick: isInitial ? handleRefresh : handleSkipWaiting,
      },
      id: SW_UPDATE_TOAST_ID,
    });
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const sw = new Workbox(
        import.meta.env.MODE === "production"
          ? `${import.meta.env.BASE_URL}sw.js`
          : `${import.meta.env.BASE_URL}dev-sw.js?dev-sw`,
        {
          type: "module",
          scope: import.meta.env.BASE_URL,
        },
      );
      setWorker(sw);

      const handleInstalled = (event: WorkboxLifecycleEvent) => {
        if (!event.isUpdate) {
          updateWorker(sw, true);
        }
      };
      sw.addEventListener("installed", handleInstalled);

      const handleWaiting = () => updateWorker(sw);
      sw.addEventListener("waiting", handleWaiting);

      const handleControlling = () => {
        if (!isRefreshing.current) {
          window.location.reload();
          isRefreshing.current = true;
        }
      };
      sw.addEventListener("controlling", handleControlling);

      sw.register();

      return () => {
        sw.removeEventListener("installed", handleInstalled);
        sw.removeEventListener("waiting", handleWaiting);
        sw.removeEventListener("controlling", handleControlling);
      };
    }
  }, [updateWorker]);

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}
