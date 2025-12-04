import { z } from 'zod';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: z.ZodSchema<any>;
  execute: (args: any) => Promise<any>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ToolCall {
  tool: string;
  arguments: any;
}

