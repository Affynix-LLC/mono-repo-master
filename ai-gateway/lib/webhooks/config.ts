import { WebhookConfig } from './types';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CONFIG_FILE = join(process.cwd(), '.webhooks.json');

export async function loadWebhooks(): Promise<WebhookConfig[]> {
  try {
    const content = await readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function saveWebhooks(webhooks: WebhookConfig[]): Promise<void> {
  await writeFile(CONFIG_FILE, JSON.stringify(webhooks, null, 2), 'utf-8');
}

export async function getWebhook(id: string): Promise<WebhookConfig | null> {
  const webhooks = await loadWebhooks();
  return webhooks.find((w) => w.id === id) || null;
}

export async function createWebhook(webhook: WebhookConfig): Promise<void> {
  const webhooks = await loadWebhooks();
  webhooks.push(webhook);
  await saveWebhooks(webhooks);
}

export async function updateWebhook(
  id: string,
  updates: Partial<WebhookConfig>
): Promise<void> {
  const webhooks = await loadWebhooks();
  const index = webhooks.findIndex((w) => w.id === id);
  if (index === -1) {
    throw new Error(`Webhook ${id} not found`);
  }
  webhooks[index] = { ...webhooks[index], ...updates, updatedAt: new Date() };
  await saveWebhooks(webhooks);
}

export async function deleteWebhook(id: string): Promise<void> {
  const webhooks = await loadWebhooks();
  const filtered = webhooks.filter((w) => w.id !== id);
  await saveWebhooks(filtered);
}

