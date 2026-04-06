import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function formatEvidencePct(pct: number | null): string {
  if (pct === null) return 'unknown';
  return `${Math.round(pct)}%`;
}

export function difficultyLabel(level: number | null): string {
  if (level === null) return 'Unknown';
  return ['', 'Beginner', 'Easy', 'Moderate', 'Advanced', 'Expert'][level] ?? 'Unknown';
}
