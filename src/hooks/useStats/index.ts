import { useEffect, useRef, useState } from "react";

import type { StatsResponse } from "@/hooks/useStats/types";
import type { ApiResponse } from "@/types/common";

export function useStats(shouldRefresh?: boolean) {
  const [stats, setStats] = useState<ApiResponse<StatsResponse | null>>();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  const controller = useRef(new AbortController());

  useEffect(() => {
    if (shouldRefresh) {
      setLoading(true);
      controller.current = new AbortController();
      fetch(`/api/stats`, { signal: controller.current.signal })
        .then((res) =>
          res
            .json()
            .then((response: ApiResponse<StatsResponse | null>) =>
              setStats(response),
            ),
        )
        .catch((error) => {
          if (error instanceof Error) setError(error);
          else throw error;
        })
        .finally(() => setLoading(false));

      const ctrl = controller.current;
      return () => ctrl.abort();
    }
  }, [shouldRefresh]);

  return { stats, isLoading, error };
}
