import { ask } from './client';

async function main() {
  const output = await ask("Explain Affynix in two sentences.");
  console.log(output);
}

main().catch(console.error);
