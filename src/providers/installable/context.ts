import { createContext } from "react";

import { InstallableContext } from "./types.ts";

export const Context = createContext<InstallableContext>({
  isInstallable: false,
  event: undefined,
});
