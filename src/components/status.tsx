import { useGame } from "@/providers/game/useGame.ts";
import { GAME_PHASES } from "@/providers/game/types.ts";
import { OUTCOME } from "@/constants.ts";

const RESULT_LABELS = {
  [OUTCOME.DRAW]: "Draw!",
  [OUTCOME.PLAYER_WON]: "✅ Nice one!",
  [OUTCOME.OPPONENT_WON]: "❌ Try again...",
};

export function Status() {
  const {
    game: { remainingTime, phase, turnOutcome },
  } = useGame();

  return (
    <>
      <div>
        {phase === GAME_PHASES.PLAYERS_TURN && remainingTime}
        {phase === GAME_PHASES.TURN_RESULTS && RESULT_LABELS[turnOutcome]}
      </div>
    </>
  );
}
