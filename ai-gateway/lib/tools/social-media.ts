/**
 * Social Media Tools
 * 
 * Tools for posting to social media platforms
 */

import { z } from 'zod';
import { ToolDefinition } from './types';
import axios from 'axios';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const socialMediaTools: ToolDefinition[] = [
  {
    name: 'generate_social_post',
    description: 'Generate a social media post from product information or topic',
    parameters: z.object({
      product: z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        affiliateLink: z.string().optional(),
      }).optional(),
      topic: z.string().optional(),
      platform: z.enum(['twitter', 'facebook', 'linkedin', 'instagram']).describe('Target social media platform'),
      tone: z.enum(['professional', 'casual', 'enthusiastic', 'informative']).optional(),
    }),
    execute: async (args) => {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is required for social post generation');
      }

      let prompt = '';
      
      if (args.product) {
        prompt = `Generate a ${args.platform} post for this product:
        
Product: ${args.product.name}
${args.product.description ? `Description: ${args.product.description}` : ''}
${args.product.price ? `Price: $${args.product.price}` : ''}
${args.product.category ? `Category: ${args.product.category}` : ''}

Platform: ${args.platform}
${args.tone ? `Tone: ${args.tone}` : ''}

Create an engaging post that:
- Highlights the product benefits
- Includes a call-to-action
- Is appropriate for ${args.platform}
- ${args.product.affiliateLink ? 'Mentions the link naturally' : ''}
- Stays within platform character limits`;
      } else if (args.topic) {
        prompt = `Generate a ${args.platform} post about: ${args.topic}

Platform: ${args.platform}
${args.tone ? `Tone: ${args.tone}` : ''}

Create an engaging post that is appropriate for ${args.platform} and stays within platform character limits`;
      } else {
        throw new Error('Either product or topic must be provided');
      }

      const modelName = process.env.OPENAI_MODEL || 'gpt-4-turbo';
      const result = await generateText({
        model: openai(modelName),
        messages: [{ role: 'user', content: prompt }],
      });

      return {
        platform: args.platform,
        post: result.text,
        wordCount: result.text.split(/\s+/).length,
        characterCount: result.text.length,
      };
    },
  },
  {
    name: 'post_to_twitter',
    description: 'Post content to Twitter/X',
    parameters: z.object({
      content: z.string().describe('Tweet content (max 280 characters)'),
      media_url: z.string().url().optional().describe('Optional media URL to attach'),
    }),
    execute: async (args) => {
      // Twitter API v2 integration
      const twitterApiKey = process.env.TWITTER_API_KEY;
      const twitterApiSecret = process.env.TWITTER_API_SECRET;
      const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
      const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

      if (!twitterApiKey || !twitterAccessToken) {
        return {
          success: false,
          error: 'Twitter API credentials not configured',
          note: 'Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET',
        };
      }

      // For now, return a mock response indicating the post would be sent
      // Actual Twitter API integration would go here
      return {
        success: true,
        message: 'Twitter post would be sent (API integration needed)',
        content: args.content,
        characterCount: args.content.length,
        note: 'Configure Twitter API v2 OAuth 2.0 for actual posting',
      };
    },
  },
  {
    name: 'post_to_facebook',
    description: 'Post content to Facebook page',
    parameters: z.object({
      content: z.string().describe('Post content'),
      page_id: z.string().optional().describe('Facebook page ID'),
      media_url: z.string().url().optional().describe('Optional media URL to attach'),
    }),
    execute: async (args) => {
      const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
      const facebookPageId = args.page_id || process.env.FACEBOOK_PAGE_ID;

      if (!facebookAccessToken || !facebookPageId) {
        return {
          success: false,
          error: 'Facebook API credentials not configured',
          note: 'Set FACEBOOK_ACCESS_TOKEN and FACEBOOK_PAGE_ID',
        };
      }

      // For now, return a mock response
      return {
        success: true,
        message: 'Facebook post would be sent (API integration needed)',
        content: args.content,
        pageId: facebookPageId,
        note: 'Configure Facebook Graph API for actual posting',
      };
    },
  },
  {
    name: 'post_to_linkedin',
    description: 'Post content to LinkedIn',
    parameters: z.object({
      content: z.string().describe('Post content'),
      visibility: z.enum(['PUBLIC', 'CONNECTIONS']).optional().describe('Post visibility'),
    }),
    execute: async (args) => {
      const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;

      if (!linkedinAccessToken) {
        return {
          success: false,
          error: 'LinkedIn API credentials not configured',
          note: 'Set LINKEDIN_ACCESS_TOKEN',
        };
      }

      // For now, return a mock response
      return {
        success: true,
        message: 'LinkedIn post would be sent (API integration needed)',
        content: args.content,
        visibility: args.visibility || 'PUBLIC',
        note: 'Configure LinkedIn API for actual posting',
      };
    },
  },
];

