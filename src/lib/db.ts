import { type MatchData } from './types';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'lib', 'database.json');

async function readDb(): Promise<MatchData[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If the file doesn't exist, return initial data
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [
        {
          id: 'match1',
          teamA: { name: 'IND', score: 185, wickets: 5, overs: 19.2 },
          teamB: { name: 'AUS', score: 120, wickets: 8, overs: 17.0 },
          status: 'IND won by 65 runs.',
        },
      ];
    }
    console.error('Error reading database:', error);
    return [];
  }
}

async function writeDb(matches: MatchData[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(matches, null, 2), 'utf-8');
}


export async function getMatches(): Promise<MatchData[]> {
  return await readDb();
}

export async function getMatchById(id: string): Promise<MatchData | undefined> {
  const matches = await readDb();
  return matches.find((m) => m.id === id);
}

export async function updateMatch(
  id: string,
  data: Omit<MatchData, 'id'>
): Promise<MatchData> {
  const matches = await readDb();
  const matchIndex = matches.findIndex((m) => m.id === id);
  if (matchIndex === -1) {
    throw new Error('Match not found');
  }
  matches[matchIndex] = { ...matches[matchIndex], ...data, id: id };
  await writeDb(matches);

  revalidatePath('/');
  revalidatePath(`/admin`);
  revalidatePath(`/admin/edit/${id}`);
  revalidatePath(`/admin/live/${id}`);
  return matches[matchIndex];
}

export async function addMatch(
  data: Omit<MatchData, 'id'>
): Promise<MatchData> {
  const matches = await readDb();
  const newMatch: MatchData = {
    id: `match${Date.now()}`,
    ...data,
  };
  matches.push(newMatch);
  await writeDb(matches);

  revalidatePath('/');
  revalidatePath('/admin');
  return newMatch;
}

export async function replaceMatches(newMatches: MatchData[]): Promise<void> {
  await writeDb(newMatches);
  revalidatePath('/');
  revalidatePath('/admin');
}
