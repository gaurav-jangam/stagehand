'use server';
/**
 * @fileOverview An AI assistant for music and cinema.
 *
 * - musicAssistant - A function that answers questions about music, movies, actors, etc.
 * - MusicAssistantInput - The input type for the musicAssistant function.
 * - MusicAssistantOutput - The return type for the musicAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MusicAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about music or cinema.'),
});
export type MusicAssistantInput = z.infer<typeof MusicAssistantInputSchema>;

const MusicAssistantOutputSchema = z.object({
  answer: z.string().describe('The AI\'s answer to the user\'s question.'),
});
export type MusicAssistantOutput = z.infer<typeof MusicAssistantOutputSchema>;

export async function musicAssistant(
  input: MusicAssistantInput
): Promise<MusicAssistantOutput> {
  return musicAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'musicAssistantPrompt',
  input: {schema: MusicAssistantInputSchema},
  output: {schema: MusicAssistantOutputSchema},
  prompt: `You are a world-renowned expert on music and cinema. Your knowledge spans all genres, eras, and cultures. You can answer questions about:
- Music: Artists, bands, albums, songs, lyrics, music theory, history, and genres.
- Movies: Actors, directors, plots, awards, soundtracks, and film history.
- People: Lyricists, composers, singers, actors, directors.

Please provide a comprehensive and engaging answer to the following question. Format your response using Markdown for readability.

User Question: {{{query}}}`,
});

const musicAssistantFlow = ai.defineFlow(
  {
    name: 'musicAssistantFlow',
    inputSchema: MusicAssistantInputSchema,
    outputSchema: MusicAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
