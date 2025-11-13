import { type MatchData } from './types';
import { revalidatePath } from 'next/cache';

// This is a simple in-memory store.
// In a real application, you would use a database like Firestore.
let matches: MatchData[] = [
  {
    id: 'match1',
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
    status: 'IND needs 15 runs in 4 balls to win.',
  },
];

export async function getMatches(): Promise<MatchData[]> {
  // Simulate async database operation
  return Promise.resolve(matches);
}

export async function getMatchById(id: string): Promise<MatchData | undefined> {
  return Promise.resolve(matches.find((m) => m.id === id));
}

export async function updateMatch(
  id: string,
  data: Omit<MatchData, 'id'>
): Promise<MatchData> {
  const matchIndex = matches.findIndex((m) => m.id === id);
  if (matchIndex === -1) {
    throw new Error('Match not found');
  }
  matches[matchIndex] = { ...matches[matchIndex], ...data, id: id };
  revalidatePath('/');
  revalidatePath(`/admin`);
  revalidatePath(`/admin/edit/${id}`);
  revalidatePath(`/admin/live/${id}`);
  return Promise.resolve(matches[matchIndex]);
}

export async function addMatch(
  data: Omit<MatchData, 'id'>
): Promise<MatchData> {
  const newMatch: MatchData = {
    id: `match${Date.now()}`,
    ...data,
  };
  matches.push(newMatch);
  revalidatePath('/');
  revalidatePath('/admin');
  return Promise.resolve(newMatch);
}
