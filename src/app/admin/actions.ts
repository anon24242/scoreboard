'use server';

import { z } from 'zod';
import { updateMatch, addMatch, getMatchById, replaceMatches } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { MatchData } from '@/lib/types';


const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
);

const wicketsSchema = numberSchema.refine(
  (val) => val <= 10,
  { message: 'Wickets cannot exceed 10' }
);


const MatchFormSchema = z.object({
  id: z.string().optional(),
  teamAName: z.string().min(1, 'Team A name is required'),
  teamAScore: numberSchema,
  teamAWickets: wicketsSchema,
  teamAOvers: numberSchema,
  teamBName: z.string().min(1, 'Team B name is required'),
  teamBScore: numberSchema,
  teamBWickets: wicketsSchema,
  teamBOvers: numberSchema,
  status: z.string(),
});

export type State = {
  errors?: {
    id?: string[];
    teamAName?: string[];
    teamAScore?: string[];
    teamAWickets?: string[];
    teamAOvers?: string[];
    teamBName?: string[];
    teamBScore?: string[];
    teamBWickets?: string[];
    teamBOvers?: string[];
    status?: string[];
    _form?: string[];
  };
  message?: string | null;
};


export async function saveMatchData(prevState: State, formData: FormData) {
  const validatedFields = MatchFormSchema.safeParse({
    id: formData.get('id'),
    teamAName: formData.get('teamAName'),
    teamAScore: formData.get('teamAScore'),
    teamAWickets: formData.get('teamAWickets'),
    teamAOvers: formData.get('teamAOvers'),
    teamBName: formData.get('teamBName'),
    teamBScore: formData.get('teamBScore'),
    teamBWickets: formData.get('teamBWickets'),
    teamBOvers: formData.get('teamBOvers'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save match data. Please check the form for errors.',
    };
  }

  const { data } = validatedFields;

  const matchPayload = {
    teamA: {
      name: data.teamAName,
      score: data.teamAScore,
      wickets: data.teamAWickets,
      overs: data.teamAOvers,
    },
    teamB: {
      name: data.teamBName,
      score: data.teamBScore,
      wickets: data.teamBWickets,
      overs: data.teamBOvers,
    },
    status: data.status,
  };

  try {
    if (data.id && data.id !== 'new') {
      await updateMatch(data.id, matchPayload);
    } else {
      await addMatch(matchPayload);
    }
  } catch (error) {
     return {
      errors: { _form: ['Failed to save match data.'] },
      message: 'Database Error: Failed to Save Match.',
    };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/admin');
}


export async function liveUpdate(matchId: string, team: 'teamA' | 'teamB', field: 'score' | 'wickets' | 'overs', delta: number) {
  const match = await getMatchById(matchId);
  if (!match) {
    return { error: 'Match not found' };
  }

  const teamData = match[team];
  if (field === 'overs') {
      const currentOvers = teamData.overs;
      const integerPart = Math.floor(currentOvers);
      const decimalPart = Math.round((currentOvers - integerPart) * 10);
      
      if (delta > 0 && decimalPart + 1 > 5) {
          teamData.overs = integerPart + 1;
      } else if (delta < 0 && decimalPart - 1 < 0) {
          teamData.overs = Math.max(0, integerPart - 1 + 0.5);
      } else {
          teamData.overs = parseFloat((currentOvers + delta).toFixed(1));
      }
  } else {
    teamData[field] += delta;
  }
  

  if (teamData.wickets > 10) teamData.wickets = 10;
  if (teamData.wickets < 0) teamData.wickets = 0;
  if (teamData.score < 0) teamData.score = 0;
  if (teamData.overs < 0) teamData.overs = 0;
  
  await updateMatch(matchId, match);

  revalidatePath(`/admin/live/${matchId}`);
  revalidatePath('/');
  return { success: true };
}

const TeamScoreSchema = z.object({
    name: z.string(),
    score: z.number(),
    wickets: z.number(),
    overs: z.number(),
});

const MatchDataSchema = z.object({
    id: z.string(),
    teamA: TeamScoreSchema,
    teamB: TeamScoreSchema,
    status: z.string(),
});

const MatchesArraySchema = z.array(MatchDataSchema);


export async function importMatchesFromJson(jsonContent: string) {
  try {
    const data = JSON.parse(jsonContent);
    const validatedData = MatchesArraySchema.safeParse(data);

    if (!validatedData.success) {
      console.error(validatedData.error);
      return { success: false, message: 'Invalid JSON structure.' };
    }
    
    await replaceMatches(validatedData.data as MatchData[]);
    
    revalidatePath('/admin');
    revalidatePath('/');
    
    return { success: true, message: 'Data imported successfully!' };
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to import data: ${message}` };
  }
}
