'use server';

import { z } from 'zod';
import { updateMatch, addMatch, getMatchById } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateMatchStatus } from '@/ai/flows/generate-match-status';

const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
);

const wicketsSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
    .max(10, 'Wickets cannot exceed 10')
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
  status: z.string().optional(), // Status is now optional
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
    status: data.status || '',
  };

  // Generate status if it's empty
  if (!matchPayload.status) {
      matchPayload.status = await generateMatchStatus({
          teamA: matchPayload.teamA,
          teamB: matchPayload.teamB,
      });
  }


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
      
      if (decimalPart + 1 > 5) {
          teamData.overs = integerPart + 1;
      } else {
          teamData.overs = parseFloat((integerPart + (decimalPart + 1) / 10).toFixed(1));
      }
  } else {
    teamData[field] += delta;
  }
  

  if (teamData.wickets > 10) teamData.wickets = 10;
  if (teamData.wickets < 0) teamData.wickets = 0;
  if (teamData.score < 0) teamData.score = 0;
  

  const newStatus = await generateMatchStatus({
    teamA: match.teamA,
    teamB: match.teamB,
  });

  match.status = newStatus;

  await updateMatch(matchId, match);

  revalidatePath(`/admin/live/${matchId}`);
  revalidatePath('/');
  return { success: true };
}
