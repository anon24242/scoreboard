'use server';
/**
 * @fileOverview A flow to generate a cricket match status summary.
 *
 * - generateMatchStatus - A function that generates a descriptive status for a cricket match.
 * - MatchStatusInput - The input type for the generateMatchStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TeamScoreSchema = z.object({
  name: z.string().describe('The name of the team.'),
  score: z.number().describe('The total score of the team.'),
  wickets: z.number().describe('The number of wickets fallen for the team.'),
  overs: z.number().describe('The number of overs played by the team.'),
});

export const MatchStatusInputSchema = z.object({
  teamA: TeamScoreSchema,
  teamB: TeamScoreSchema,
  totalOvers: z.number().optional().default(20).describe('Total overs in the match per inning.'),
});
export type MatchStatusInput = z.infer<typeof MatchStatusInputSchema>;


const prompt = ai.definePrompt({
  name: 'generateMatchStatusPrompt',
  input: { schema: MatchStatusInputSchema },
  output: { schema: z.string() },
  prompt: `You are a cricket commentator. Based on the following scores, provide a short, exciting, one-sentence summary of the match status.

Assume it's a T20 match ({{totalOvers}} overs per side) unless otherwise specified.

Team A: {{teamA.name}} - {{teamA.score}}/{{teamA.wickets}} ({{teamA.overs}} overs)
Team B: {{teamB.name}} - {{teamB.score}}/{{teamB.wickets}} ({{teamB.overs}} overs)

Generate a compelling summary of the current situation. For example: '{{teamA.name}} needs 36 runs from 24 balls to win.' or '{{teamB.name}} are in a strong position, with {{teamA.name}} needing a miracle.'`,
});

const generateMatchStatusFlow = ai.defineFlow(
  {
    name: 'generateMatchStatusFlow',
    inputSchema: MatchStatusInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || 'Match is getting interesting.';
  }
);


export async function generateMatchStatus(input: MatchStatusInput): Promise<string> {
    return await generateMatchStatusFlow(input);
}
