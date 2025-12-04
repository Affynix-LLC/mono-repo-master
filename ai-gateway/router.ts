import { generateText } from 'ai';

export async function route(prompt: string) {
  return generateText({
    model: 'openai/gpt-4.1',
    prompt,
  });
}
