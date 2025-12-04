import { z } from 'zod';
import { ToolDefinition } from '../types';
import * as products from '../../integrations/affynix/products';

export const affynixProductTools: ToolDefinition[] = [
  {
    name: 'get_affynix_products',
    description: 'Get products from Affynix platform by subdomain',
    parameters: z.object({
      subdomain: z.string().describe('Subdomain to get products for (e.g., business, money, health)'),
    }),
    execute: async (args) => {
      return products.getProductsBySubdomain(args.subdomain);
    },
  },
  {
    name: 'update_affynix_product',
    description: 'Update a product in the Affynix platform',
    parameters: z.object({
      productId: z.string().describe('Product ID to update'),
      updates: z.record(z.any()).describe('Fields to update'),
    }),
    execute: async (args) => {
      return products.updateProductData(args.productId, args.updates);
    },
  },
  {
    name: 'create_affynix_product',
    description: 'Create a new product in the Affynix platform',
    parameters: z.object({
      name: z.string().describe('Product name'),
      category: z.string().describe('Product category'),
      subdomain: z.string().describe('Subdomain (business, money, health, etc.)'),
      description: z.string().optional().describe('Product description'),
      price: z.number().optional().describe('Product price'),
      url: z.string().url().optional().describe('Product URL'),
    }),
    execute: async (args) => {
      return products.createProductWithData(args);
    },
  },
];

