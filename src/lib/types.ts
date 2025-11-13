export interface TeamScore {
  name: string;
  score: number;
  wickets: number;
  overs: number;
}

export interface MatchData {
  teamA: TeamScore;
  teamB: TeamScore;
  striker: string;
  nonStriker: string;
  bowler: string;
  status: string;
}
