export interface TeamScore {
  name: string;
  score: number;
  wickets: number;
  overs: number;
}

export interface MatchData {
  id: string;
  teamA: TeamScore;
  teamB: TeamScore;
  status: string;
}
