import { route } from './router';

export async function ask(prompt: string) {
  const res = await route(prompt);
  return res.text;
}
