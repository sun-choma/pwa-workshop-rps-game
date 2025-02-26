import { useState } from "react";
import {
  AlertContent,
  AlertIndicator,
  AlertRoot,
  AlertTitle,
  HStack,
  IconButton,
  ListRoot,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ChartColumnIcon, DownloadIcon } from "lucide-react";

import { useInstallable } from "@/providers/installable/useInstallable";
import {
  DialogCloseTrigger,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DialogActionTrigger,
} from "@/components/ui/dialog";
import { RowItem, RowTitle } from "@/components/actions-header/list";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/useStats";
import { msToObject } from "@/utils/common";

export function ActionsHeader() {
  const [isOpen, setOpen] = useState(false);

  const { isInstallable, event } = useInstallable();
  const { stats: response, isLoading, error } = useStats(isOpen);
  const stats = response?.payload;

  const today = new Date().toLocaleDateString("en-CA").split("-").join("/");
  const longestTimings = msToObject(stats?.longest_match.by_time.ms || 0);

  return (
    <HStack
      as="header"
      w="full"
      maxW="calc(var(--thick-square-size) * 5)"
      position="absolute"
    >
      {isInstallable && (
        <IconButton
          variant="outline"
          borderStyle="dashed"
          borderColor="darkgray"
          w="calc(var(--thin-square-size) * 3)"
          h="calc(var(--thin-square-size) * 3)"
          onClick={() => event?.prompt()}
        >
          <DownloadIcon />
        </IconButton>
      )}
      <DialogRoot open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
        <DialogTrigger asChild>
          <IconButton
            variant="outline"
            borderStyle="dashed"
            borderColor="darkgray"
            w="calc(var(--thin-square-size) * 3)"
            h="calc(var(--thin-square-size) * 3)"
            ml="auto"
          >
            <ChartColumnIcon />
          </IconButton>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Today's highlights</DialogTitle>
            <Text>Past games statistics for {today}</Text>
            {response?.meta?.isCached && (
              <AlertRoot status="warning" marginTop="0.5rem">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>
                    Response served from cache. It may be outdated
                  </AlertTitle>
                </AlertContent>
              </AlertRoot>
            )}
          </DialogHeader>
          <DialogBody mx="auto">
            {isLoading && <Spinner size="xl" />}
            {!isLoading && error !== undefined && (
              <AlertRoot status="error" marginTop="0.5rem">
                <AlertIndicator />
                <AlertContent>
                  <AlertTitle>Statistics Unavailable</AlertTitle>
                  <AlertContent>
                    We encountered a problem accessing the statistics. Ensure
                    your network connection is active and attempt again.
                  </AlertContent>
                </AlertContent>
              </AlertRoot>
            )}
            {!isLoading && stats === null && (
              <Text>No statistics recorded for today yet</Text>
            )}
            {!isLoading && !!stats && (
              <ListRoot pl="1rem" gap="0.5rem">
                <RowTitle label="Devoted Player">
                  <RowItem>
                    Keep&nbsp;<b>{stats.player_with_most_matches.name}</b>
                    &nbsp;away from gambling!
                  </RowItem>
                  <RowItem>
                    He already participated in&nbsp;
                    {stats.player_with_most_matches.count}&nbsp;games (and may
                    still be going)
                  </RowItem>
                </RowTitle>

                {stats.pair_with_most_rematches && (
                  <RowTitle label="Arch Nemesis Showdown">
                    <RowItem>
                      <b>{stats.pair_with_most_rematches.players[0]}</b>
                      &nbsp;vs.&nbsp;
                      <b>{stats.pair_with_most_rematches.players[1]}</b>
                      &nbsp;battle was legendary
                    </RowItem>
                    <RowItem>
                      It took total of {stats.pair_with_most_rematches.count}
                      &nbsp;games
                    </RowItem>
                  </RowTitle>
                )}

                <RowTitle label="Emoji of the Day">
                  <RowItem>
                    {stats.most_used_emoji.symbol} is quite an interesting
                    choice
                  </RowItem>
                  <RowItem>
                    There were at least&nbsp;{stats.most_used_emoji.count}
                    &nbsp;username(s) with this symbol
                  </RowItem>
                </RowTitle>

                {stats.player_with_most_perfect_victories && (
                  <RowTitle label="Flawless Victory">
                    <RowItem>
                      <b>{stats.player_with_most_perfect_victories.name}</b>
                      &nbsp;reads his opponents like an open book
                    </RowItem>
                    <RowItem>
                      Despite the 10% probability he managed to pull it
                      off&nbsp;
                      {stats.player_with_most_perfect_victories.count}
                      &nbsp;times
                    </RowItem>
                  </RowTitle>
                )}

                <RowTitle label="Marathon Runners">
                  <RowItem>
                    I envy&nbsp;<b>{stats.longest_match.by_time.players[0]}</b>
                    &nbsp;and&nbsp;
                    <b>{stats.longest_match.by_time.players[1]}</b>
                    &nbsp;endurance
                  </RowItem>
                  <RowItem>
                    That match lasted for&nbsp;
                    {longestTimings.hours > 0 &&
                      `${longestTimings.hours} hours `}
                    {longestTimings.minutes > 0 &&
                      `${longestTimings.minutes} minutes `}
                    {longestTimings.seconds > 0 &&
                      `${longestTimings.seconds} seconds`}
                  </RowItem>
                </RowTitle>

                <RowTitle label="4D Chess Masters">
                  <RowItem>
                    <b>{stats.longest_match.by_turns.players[0]}</b>
                    &nbsp;and&nbsp;
                    <b>{stats.longest_match.by_turns.players[1]}</b>&nbsp;are
                    playing on a whole different level
                  </RowItem>
                  <RowItem>
                    It took {stats.longest_match.by_turns.turns} turns to finish
                    the game
                  </RowItem>
                </RowTitle>

                <RowTitle label="Lightning fast">
                  <RowItem>
                    Sonic is no match for&nbsp;
                    <b>{stats.shortest_match.by_time.players[0]}</b>
                    &nbsp;and&nbsp;
                    <b>{stats.shortest_match.by_time.players[1]}</b>
                  </RowItem>
                  <RowItem>
                    That match ended in mere&nbsp;
                    {(stats.shortest_match.by_time.ms / 1000).toFixed(1)}{" "}
                    seconds
                  </RowItem>
                </RowTitle>

                <RowTitle label="Blitzkrieg">
                  <RowItem>
                    <b>{stats.shortest_match.by_turns.winner}</b>&nbsp;is
                    inevitable
                  </RowItem>
                  <RowItem>
                    It took him {stats.shortest_match.by_turns.turns} turns and
                    a snap of fingers to win the game
                  </RowItem>
                </RowTitle>
              </ListRoot>
            )}
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Close</Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </HStack>
  );
}
