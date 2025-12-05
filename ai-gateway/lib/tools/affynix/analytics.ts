import { z } from 'zod';
import { ToolDefinition } from '../types';
import { affynixClient } from '../../integrations/affynix/client';

export const affynixAnalyticsTools: ToolDefinition[] = [
  {
    name: 'get_affynix_analytics',
    description: 'Get analytics data for Affynix platform',
    parameters: z.object({
      subdomain: z.string().optional().describe('Subdomain to get analytics for'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
    }),
    execute: async (args) => {
      const dateRange = args.startDate && args.endDate
        ? { start: args.startDate, end: args.endDate }
        : undefined;
      
      return affynixClient.getAnalytics(args.subdomain, dateRange);
    },
  },
  {
    name: 'generate_analytics_report',
    description: 'Generate a human-readable analytics report',
    parameters: z.object({
      subdomain: z.string().optional().describe('Subdomain to report on'),
      startDate: z.string().optional().describe('Start date (YYYY-MM-DD)'),
      endDate: z.string().optional().describe('End date (YYYY-MM-DD)'),
      format: z.enum(['summary', 'detailed']).optional().describe('Report format'),
    }),
    execute: async (args) => {
      const dateRange = args.startDate && args.endDate
        ? { start: args.startDate, end: args.endDate }
        : undefined;
      
      const analytics = await affynixClient.getAnalytics(args.subdomain, dateRange);
      
      // Generate report using AI
      if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith('sk-')) {
        throw new Error('OPENAI_API_KEY is required for report generation');
      }

      const { generateText } = await import('ai');
      const { createOpenAI } = await import('@ai-sdk/openai');
      
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const prompt = `Generate a ${args.format || 'summary'} analytics report based on this data:

${JSON.stringify(analytics, null, 2)}

Create a clear, actionable report that highlights key metrics, trends, and insights.`;
      
      const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
      const result = await generateText({
        model: openai(modelName),
        messages: [{ role: 'user', content: prompt }],
      });
      return {
        subdomain: args.subdomain || 'all',
        report: result.text,
        data: analytics,
      };
    },
  },
];

