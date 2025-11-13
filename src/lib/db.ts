import { type MatchData } from './types';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store.
// In a real application, you would use a database like Firestore.
let matchData: MatchData = {
  teamA: {
    name: 'IND',
    score: 185,
    wickets: 5,
    overs: 19.2,
  },
  teamB: {
    name: 'AUS',
    score: 120,
    wickets: 8,
    overs: 17.0,
  },
  striker: 'V. Kohli',
  nonStriker: 'H. Pandya',
  bowler: 'P. Cummins',
  status: 'IND needs 15 runs in 4 balls to win.',
};

export async function getMatchData(): Promise<MatchData> {
  // Simulate async database operation
  return Promise.resolve(matchData);
}

export async function updateMatchData(data: MatchData): Promise<MatchData> {
  // Simulate async database operation
  matchData = data;
  // Revalidate paths to reflect changes across the app
  revalidatePath('/');
  revalidatePath('/admin');
  return Promise.resolve(matchData);
}
