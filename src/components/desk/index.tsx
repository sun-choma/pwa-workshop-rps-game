import { ReactNode } from "react";

import { HStack, Text, VStack } from "@chakra-ui/react";
import { HeartIcon, HeartOffIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";

import { MAX_LIVES } from "@/providers/game/constants.ts";

import "./styles.css";
import { nodeArray } from "@/utils/common.ts";

interface DeskProps {
  title: string;
  lives: number;
  children: ReactNode;
}

export function Desk({ title, lives, children }: DeskProps) {
  return (
    <VStack className="card-desk">
      <HStack className="player-info" w="full" justifyContent="space-around">
        <Text>{title}</Text>
        <HStack>
          {nodeArray({
            item: (index) => <HeartOffIcon key={index} />,
            length: MAX_LIVES - lives,
          })}
          {nodeArray({
            item: (index) => <HeartIcon key={index} />,
            length: lives,
          })}
        </HStack>
      </HStack>
      <AnimatePresence initial={false} mode="wait">
        {children}
      </AnimatePresence>
    </VStack>
  );
}
