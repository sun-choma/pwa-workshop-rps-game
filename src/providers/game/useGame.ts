import { useContext } from "react";

import { Context } from "@/providers/game/context.ts";

export function useGame() {
  return useContext(Context);
}
