import { z } from 'zod';
import { ToolDefinition } from './types';
import { toolRegistry } from './registry';
import * as fileOps from './fileOps';
import * as httpTools from './http';
import * as dataTools from './data';
import * as contentTools from './content';
import { affynixProductTools } from './affynix/products';
import { affynixContentTools } from './affynix/content';
import { affynixAnalyticsTools } from './affynix/analytics';

export function registerAllTools(): void {
  // File Operations
  toolRegistry.register({
    name: 'read_file',
    description: 'Read contents of a file',
    parameters: z.object({
      path: z.string().describe('Path to the file'),
    }),
    execute: fileOps.readFile,
  });

  toolRegistry.register({
    name: 'write_file',
    description: 'Write content to a file',
    parameters: z.object({
      path: z.string().describe('Path to the file'),
      content: z.string().describe('Content to write'),
    }),
    execute: fileOps.writeFile,
  });

  toolRegistry.register({
    name: 'list_directory',
    description: 'List files and directories in a path',
    parameters: z.object({
      path: z.string().describe('Directory path'),
    }),
    execute: fileOps.listDirectory,
  });

  // HTTP Operations
  toolRegistry.register({
    name: 'http_get',
    description: 'Make an HTTP GET request',
    parameters: z.object({
      url: z.string().url().describe('URL to fetch'),
      headers: z.record(z.string()).optional().describe('HTTP headers'),
    }),
    execute: httpTools.httpGet,
  });

  toolRegistry.register({
    name: 'http_post',
    description: 'Make an HTTP POST request',
    parameters: z.object({
      url: z.string().url().describe('URL to post to'),
      data: z.any().describe('Data to send'),
      headers: z.record(z.string()).optional().describe('HTTP headers'),
    }),
    execute: httpTools.httpPost,
  });

  // Data Processing
  toolRegistry.register({
    name: 'transform_json',
    description: 'Transform JSON data using a transformation function',
    parameters: z.object({
      data: z.any().describe('JSON data to transform'),
      transformation: z.string().describe('Description of the transformation to apply'),
    }),
    execute: dataTools.transformJson,
  });

  toolRegistry.register({
    name: 'aggregate_data',
    description: 'Aggregate data by specified fields',
    parameters: z.object({
      data: z.array(z.any()).describe('Array of data objects'),
      groupBy: z.string().describe('Field to group by'),
      operation: z.enum(['sum', 'count', 'avg', 'min', 'max']).describe('Aggregation operation'),
      field: z.string().optional().describe('Field to aggregate (if applicable)'),
    }),
    execute: dataTools.aggregateData,
  });

  // Content Generation
  toolRegistry.register({
    name: 'generate_product_description',
    description: 'Generate a product description',
    parameters: z.object({
      productName: z.string().describe('Name of the product'),
      category: z.string().describe('Product category'),
      features: z.array(z.string()).optional().describe('Product features'),
    }),
    execute: contentTools.generateProductDescription,
  });

  toolRegistry.register({
    name: 'generate_seo_content',
    description: 'Generate SEO-optimized content',
    parameters: z.object({
      topic: z.string().describe('Topic for the content'),
      keywords: z.array(z.string()).describe('SEO keywords'),
      length: z.enum(['short', 'medium', 'long']).optional().describe('Content length'),
    }),
    execute: contentTools.generateSeoContent,
  });

  // Affynix Platform Tools
  for (const tool of affynixProductTools) {
    toolRegistry.register(tool);
  }
  for (const tool of affynixContentTools) {
    toolRegistry.register(tool);
  }
  for (const tool of affynixAnalyticsTools) {
    toolRegistry.register(tool);
  }
}

