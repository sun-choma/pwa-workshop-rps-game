import { ComponentPropsWithoutRef, ReactNode } from "react";

import { HStack, Text, VStack } from "@chakra-ui/react";
import { HeartIcon, HeartOffIcon } from "lucide-react";

import { MAX_LIVES } from "@/providers/game/constants";
import { nodeArray } from "@/utils/common";

import "./styles.css";

interface DeskProps extends ComponentPropsWithoutRef<typeof VStack> {
  title: string;
  lives: number;
  children: ReactNode;
}

export function Desk({ title, lives, children, ...props }: DeskProps) {
  return (
    <VStack className="card-desk" {...props}>
      <HStack className="player-info">
        <Text lineClamp={1}>{title}</Text>
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
      {children}
    </VStack>
  );
}
