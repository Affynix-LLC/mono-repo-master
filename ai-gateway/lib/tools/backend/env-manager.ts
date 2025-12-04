import * as fs from 'fs/promises';
import * as path from 'path';

interface EnvVarInfo {
  name: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
}

export async function validateEnvVars(projectPath: string, requiredVars: string[]): Promise<{
  valid: boolean;
  missing: string[];
  present: string[];
}> {
  const envPath = path.join(projectPath, '.env');
  const envExamplePath = path.join(projectPath, '.env.example');

  let envContent = '';
  try {
    envContent = await fs.readFile(envPath, 'utf-8');
  } catch (error) {
    // .env file doesn't exist
  }

  const envVars = new Set<string>();
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      envVars.add(match[1]);
    }
  }

  const missing = requiredVars.filter(v => !envVars.has(v));
  const present = requiredVars.filter(v => envVars.has(v));

  return {
    valid: missing.length === 0,
    missing,
    present,
  };
}

export async function generateEnvExample(projectPath: string, envVars: EnvVarInfo[]): Promise<string> {
  const lines = [
    '# Environment Variables',
    '# Copy this file to .env and fill in the values',
    '',
  ];

  for (const envVar of envVars) {
    if (envVar.description) {
      lines.push(`# ${envVar.description}`);
    }
    const defaultValue = envVar.defaultValue ? `=${envVar.defaultValue}` : '';
    const required = envVar.required ? ' (required)' : ' (optional)';
    lines.push(`${envVar.name}${defaultValue}${required}`);
    lines.push('');
  }

  return lines.join('\n');
}

export async function syncEnvVars(
  sourcePath: string,
  targetPath: string,
  varsToSync: string[]
): Promise<{ synced: string[]; failed: string[] }> {
  const sourceEnvPath = path.join(sourcePath, '.env');
  const targetEnvPath = path.join(targetPath, '.env');

  let sourceContent = '';
  try {
    sourceContent = await fs.readFile(sourceEnvPath, 'utf-8');
  } catch (error) {
    throw new Error(`Source .env file not found: ${sourceEnvPath}`);
  }

  // Parse source env vars
  const sourceVars: Record<string, string> = {};
  const lines = sourceContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && varsToSync.includes(match[1])) {
      sourceVars[match[1]] = match[2];
    }
  }

  // Read target .env if it exists
  let targetContent = '';
  try {
    targetContent = await fs.readFile(targetEnvPath, 'utf-8');
  } catch (error) {
    // Target .env doesn't exist, create it
  }

  // Update or add vars in target
  const targetLines = targetContent.split('\n');
  const targetVars = new Map<string, number>(); // Map var name to line index

  for (let i = 0; i < targetLines.length; i++) {
    const match = targetLines[i].match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      targetVars.set(match[1], i);
    }
  }

  const synced: string[] = [];
  const failed: string[] = [];

  for (const [varName, varValue] of Object.entries(sourceVars)) {
    if (targetVars.has(varName)) {
      // Update existing
      const lineIndex = targetVars.get(varName)!;
      targetLines[lineIndex] = `${varName}=${varValue}`;
      synced.push(varName);
    } else {
      // Add new
      targetLines.push(`${varName}=${varValue}`);
      synced.push(varName);
    }
  }

  try {
    await fs.writeFile(targetEnvPath, targetLines.join('\n'), 'utf-8');
  } catch (error) {
    failed.push(...synced);
    synced.length = 0;
  }

  return { synced, failed };
}

