import { HStack, IconButton, Presence } from "@chakra-ui/react";
import { SmileIcon } from "lucide-react";

import { GAME_PHASES } from "@/core/game/constants";
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverDescription,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactionEmitter } from "@/components/reaction-emitter";
import { useGame } from "@/providers/game/useGame";
import { useReaction } from "@/hooks/useReaction";

import { REACTION_EMOJI } from "./constants";

export function EmojiSelector() {
  const {
    game: { phase },
    sendEmoji,
  } = useGame();

  const { emoji, addReaction } = useReaction();

  return (
    <>
      <ReactionEmitter bottom="0">{emoji}</ReactionEmitter>
      <Presence
        present={![GAME_PHASES.INIT, GAME_PHASES.MATCHING].includes(phase)}
        animationStyle={{
          _open: "scale-fade-in",
          _closed: "scale-fade-out",
        }}
        animationDuration="moderate"
        lazyMount
        unmountOnExit
      >
        <PopoverRoot lazyMount unmountOnExit>
          <PopoverTrigger asChild>
            <IconButton
              variant="plain"
              w="calc(var(--thin-square-size) * 3)"
              h="calc(var(--thin-square-size) * 3)"
            >
              <SmileIcon />
            </IconButton>
          </PopoverTrigger>
          <PopoverContent portalled={false} maxW="14rem">
            <PopoverArrow />
            <PopoverBody>
              <PopoverTitle fontWeight="semibold">Emoji</PopoverTitle>
              <PopoverDescription>Select emoji to send</PopoverDescription>
              <HStack flexWrap="wrap" mt="1rem">
                {REACTION_EMOJI.map((codepoint) => {
                  const emoji = String.fromCodePoint(codepoint);
                  return (
                    <IconButton
                      key={codepoint}
                      fontSize="xl"
                      variant="outline"
                      onClick={() => {
                        addReaction(emoji);
                        sendEmoji(emoji);
                      }}
                    >
                      {emoji}
                    </IconButton>
                  );
                })}
              </HStack>
            </PopoverBody>
          </PopoverContent>
        </PopoverRoot>
      </Presence>
    </>
  );
}
