import { z } from 'zod';
import { ToolDefinition } from '../types';
import { route } from '../../../router';

export const affynixContentTools: ToolDefinition[] = [
  {
    name: 'generate_subdomain_content',
    description: 'Generate SEO-optimized content for a specific Affynix subdomain',
    parameters: z.object({
      subdomain: z.string().describe('Subdomain (business, money, health, relationships, home, lifestyle)'),
      topic: z.string().describe('Content topic'),
      keywords: z.array(z.string()).describe('SEO keywords'),
      productCount: z.number().optional().describe('Number of products to reference'),
    }),
    execute: async (args) => {
      const prompt = `Generate SEO-optimized content for ${args.subdomain}.affynix.com about: ${args.topic}

Keywords: ${args.keywords.join(', ')}
${args.productCount ? `Reference approximately ${args.productCount} products.` : ''}

Create engaging, valuable content that naturally incorporates the keywords and aligns with the ${args.subdomain} subdomain theme.`;
      
      const result = await route(prompt);
      return {
        subdomain: args.subdomain,
        topic: args.topic,
        content: result.text,
        wordCount: result.text.split(/\s+/).length,
      };
    },
  },
  {
    name: 'optimize_product_description',
    description: 'Optimize a product description for a specific Affynix subdomain',
    parameters: z.object({
      subdomain: z.string().describe('Target subdomain'),
      productName: z.string().describe('Product name'),
      currentDescription: z.string().describe('Current product description'),
      category: z.string().describe('Product category'),
    }),
    execute: async (args) => {
      const prompt = `Optimize this product description for ${args.subdomain}.affynix.com:

Product: ${args.productName}
Category: ${args.category}
Current Description: ${args.currentDescription}

Create an optimized description that:
1. Aligns with the ${args.subdomain} subdomain theme
2. Is SEO-friendly
3. Highlights benefits and features
4. Is compelling and conversion-focused`;
      
      const result = await route(prompt);
      return {
        subdomain: args.subdomain,
        productName: args.productName,
        optimizedDescription: result.text,
      };
    },
  },
];

