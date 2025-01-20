import { useCallback, useEffect, useState } from "react";

export function usePwa() {
  const [isInstalled, setInstalled] = useState<boolean>(false);

  const getInstalled = useCallback((event: MediaQueryListEvent) => {
    const agent = navigator.userAgent;

    const isIos = !!agent.match(/iPhone|iPad|iPod/);
    const isSafari = !!agent.match(/Safari/);

    const isStandalone = event.matches;

    setInstalled(isStandalone || (isIos && !isSafari));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    media.addEventListener("change", getInstalled);
    return () => {
      media.removeEventListener("change", getInstalled);
    };
  }, []);

  return { isInstalled };
}
