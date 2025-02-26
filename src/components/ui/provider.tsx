import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import type { ThemeProviderProps } from "next-themes";
import { ColorModeProvider } from "@/components/ui/color-mode";

export function Provider(props: ThemeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...props} defaultTheme="dark" />
    </ChakraProvider>
  );
}
