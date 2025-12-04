import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

export async function readFile(args: { path: string }) {
  try {
    const content = await readFile(args.path, 'utf-8');
    return { content, path: args.path };
  } catch (error: any) {
    throw new Error(`Failed to read file: ${error.message}`);
  }
}

export async function writeFile(args: { path: string; content: string }) {
  try {
    await writeFile(args.path, args.content, 'utf-8');
    return { success: true, path: args.path };
  } catch (error: any) {
    throw new Error(`Failed to write file: ${error.message}`);
  }
}

export async function listDirectory(args: { path: string }) {
  try {
    const entries = await readdir(args.path, { withFileTypes: true });
    return {
      path: args.path,
      entries: entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : 'file',
      })),
    };
  } catch (error: any) {
    throw new Error(`Failed to list directory: ${error.message}`);
  }
}

