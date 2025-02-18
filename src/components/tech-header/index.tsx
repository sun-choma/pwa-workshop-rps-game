import { HStack, Image, VStack, Box } from "@chakra-ui/react";

import "./styles.css";

export function TechHeader() {
  return (
    <VStack gap="0">
      <HStack h="var(--thick-square-size)">
        <a href="http://sun-asterisk.com/">
          <Image
            src="logo/sunbear.svg"
            className="sunbear"
            h="6rem"
            w="6rem"
            mx="1rem"
          />
        </a>
      </HStack>
      <HStack gap="3.5rem" h="var(--thick-square-size)">
        <a href="https://react.dev/">
          <Image
            src="logo/react-logo.svg"
            className="react"
            h="5rem"
            w="5rem"
            objectFit="fill"
          />
        </a>
        <Box className="cross" />
        <a href="https://vite.dev/">
          <Image
            src="logo/vite-logo.svg"
            h="5rem"
            w="5rem"
            objectFit="fill"
            className="vite"
          />
        </a>
      </HStack>
    </VStack>
  );
}
