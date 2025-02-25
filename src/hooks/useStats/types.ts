export interface StatsResponse {
  player_with_most_matches: {
    name: string;
    count: number;
  };
  pair_with_most_rematches: {
    players: string[];
    count: number;
  } | null;
  player_with_most_perfect_victories: {
    name: string;
    count: number;
  } | null;
  most_used_emoji: {
    symbol: string;
    count: number;
  };
  longest_match: {
    by_time: {
      players: string[];
      winner: string;
      ms: number;
    };
    by_turns: {
      players: string[];
      winner: string;
      turns: number;
    };
  };
  shortest_match: {
    by_time: {
      players: string[];
      winner: string;
      ms: number;
    };
    by_turns: {
      players: string[];
      winner: string;
      turns: number;
    };
  };
}
