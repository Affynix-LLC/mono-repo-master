/**
 * Scraper Tools
 * 
 * Tools for triggering and managing the Affynix scraper
 */

import { z } from 'zod';
import { ToolDefinition } from './types';
import axios from 'axios';

export const scraperTools: ToolDefinition[] = [
  {
    name: 'trigger_scraper',
    description: 'Trigger the Affynix scraper to run and collect new affiliate offers from all networks',
    parameters: z.object({
      scraper_url: z.string().url().optional().describe('URL of the scraper trigger endpoint'),
      api_key: z.string().optional().describe('API key for scraper authentication'),
    }),
    execute: async (args: { scraper_url?: string; api_key?: string }) => {
      const url = args.scraper_url || process.env.SCRAPER_URL || 'http://localhost:3004/trigger';
      const apiKey = args.api_key || process.env.SCRAPER_API_KEY;

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };

        if (apiKey) {
          headers['X-API-Key'] = apiKey;
        }

        const response = await axios.post(url, {}, { headers, timeout: 5000 });

        return {
          success: true,
          message: 'Scraper triggered successfully',
          data: response.data,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to trigger scraper',
          details: error.response?.data,
        };
      }
    },
  },
];

