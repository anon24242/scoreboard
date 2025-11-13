'use server';

import { z } from 'zod';
import { updateMatchData as dbUpdateMatchData } from '@/lib/db';
import type { MatchData } from '@/lib/types';

const numberSchema = z.preprocess(
  (val) => (val === '' ? undefined : parseFloat(String(val))),
  z
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Must be a positive number')
);

const wicketsSchema = numberSchema.max(10, 'Wickets cannot exceed 10');

const MatchFormSchema = z.object({
  teamAName: z.string().min(1, 'Team A name is required'),
  teamAScore: numberSchema,
  teamAWickets: wicketsSchema,
  teamAOvers: numberSchema,
  teamBName: z.string().min(1, 'Team B name is required'),
  teamBScore: numberSchema,
  teamBWickets: wicketsSchema,
  teamBOvers: numberSchema,
  striker: z.string().min(1, 'Striker name is required'),
  nonStriker: z.string().min(1, 'Non-striker name is required'),
  bowler: z.string().min(1, 'Bowler name is required'),
  status: z.string().min(1, 'Status is required'),
});

export async function updateMatchData(formData: unknown) {
  const validatedFields = MatchFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data } = validatedFields;

  const newMatchData: MatchData = {
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
    striker: data.striker,
    nonStriker: data.nonStriker,
    bowler: data.bowler,
    status: data.status,
  };

  try {
    await dbUpdateMatchData(newMatchData);
    return { success: true };
  } catch (error) {
    return { errors: { _form: ['Failed to update match data.'] } };
  }
}
