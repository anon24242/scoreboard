'use server';

import { z } from 'zod';
import { updateMatch, addMatch } from '@/lib/db';
import type { MatchData } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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
  status: z.string().min(1, 'Status is required'),
});

export async function saveMatchData(formData: unknown) {
  const validatedFields = MatchFormSchema.safeParse(formData);

  if (!validatedFields.success) {
    console.error('Validation Error:', validatedFields.error.flatten());
    return {
      errors: validatedFields.error.flatten().fieldErrors,
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
    return { errors: { _form: ['Failed to save match data.'] } };
  }

  revalidatePath('/admin');
  redirect('/admin');
}
