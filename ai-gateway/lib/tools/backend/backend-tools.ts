import { z } from 'zod';
import { ToolDefinition } from '../types';
import { generateApiRoute } from './generate-route';
import { generateTypeScriptTypes } from './generate-types';
import { generateIntegrationCode } from './generate-integration';
import { generateTestFile } from './generate-tests';
import { generateDeploymentScript } from './generate-deployment';
import { validateEnvVars, generateEnvExample, syncEnvVars } from './env-manager';
import { generateApiDocumentation } from './generate-docs';
import { analyzeCode } from './analyze-code';
import { generateValidators } from './generate-validators';
import { generateErrorHandlers } from './generate-error-handlers';

export const backendTools: ToolDefinition[] = [
  {
    name: 'generate_api_route',
    description: 'Generate a complete Next.js API route file with validation, error handling, and TypeScript types',
    parameters: z.object({
      method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']).describe('HTTP method'),
      path: z.string().describe('API route path (e.g., /api/products)'),
      description: z.string().describe('Description of what the route does'),
      auth: z.boolean().optional().describe('Whether authentication is required'),
      body: z.record(z.string()).optional().describe('Request body schema (field name -> type)'),
      query: z.record(z.string()).optional().describe('Query parameters (param name -> type)'),
      response: z.record(z.string()).optional().describe('Response schema (field name -> type)'),
    }),
    execute: async (args) => {
      const code = await generateApiRoute({
        method: args.method,
        path: args.path,
        description: args.description,
        auth: args.auth || false,
        body: args.body,
        query: args.query,
        response: args.response,
      });
      return {
        code,
        path: args.path,
        method: args.method,
      };
    },
  },
  {
    name: 'generate_typescript_types',
    description: 'Generate TypeScript type definitions from schemas, Airtable tables, or descriptions',
    parameters: z.object({
      source: z.enum(['airtable', 'api', 'json', 'description']).describe('Source of type information'),
      table: z.string().optional().describe('Airtable table name (if source is airtable)'),
      schema: z.any().optional().describe('JSON schema or API schema (if source is json or api)'),
      description: z.string().optional().describe('Description of the types to generate (if source is description)'),
      output: z.string().optional().describe('Output file path (optional)'),
    }),
    execute: async (args) => {
      const types = await generateTypeScriptTypes({
        source: args.source,
        table: args.table,
        schema: args.schema,
        description: args.description,
        output: args.output,
      });
      return {
        types,
        source: args.source,
        output: args.output,
      };
    },
  },
  {
    name: 'generate_integration_code',
    description: 'Generate integration code for Airtable, Vercel, or Cloudflare APIs with error handling',
    parameters: z.object({
      service: z.enum(['airtable', 'vercel', 'cloudflare']).describe('Service to integrate with'),
      operation: z.string().describe('Operation to perform'),
      description: z.string().optional().describe('Detailed description of what the integration should do'),
      config: z.record(z.any()).optional().describe('Configuration options'),
    }),
    execute: async (args) => {
      const code = await generateIntegrationCode({
        service: args.service,
        operation: args.operation,
        description: args.description,
        config: args.config,
      });
      return {
        code,
        service: args.service,
        operation: args.operation,
      };
    },
  },
  {
    name: 'generate_test_file',
    description: 'Generate test files for API routes with success, error, and validation test cases',
    parameters: z.object({
      routePath: z.string().describe('Path to the API route being tested'),
      routeCode: z.string().optional().describe('The route code to test (optional, helps generate better tests)'),
      testFramework: z.enum(['jest', 'vitest']).optional().describe('Testing framework to use'),
      description: z.string().optional().describe('Description of what to test'),
    }),
    execute: async (args) => {
      const testCode = await generateTestFile({
        routePath: args.routePath,
        routeCode: args.routeCode,
        testFramework: args.testFramework,
        description: args.description,
      });
      return {
        testCode,
        routePath: args.routePath,
        testFramework: args.testFramework || 'jest',
      };
    },
  },
  {
    name: 'generate_deployment_script',
    description: 'Generate deployment scripts with validation, rollback, and health checks',
    parameters: z.object({
      environment: z.enum(['development', 'staging', 'production']).describe('Target environment'),
      platform: z.enum(['vercel', 'docker', 'custom']).describe('Deployment platform'),
      project: z.string().optional().describe('Project name'),
      validation: z.boolean().optional().describe('Include validation steps'),
      rollback: z.boolean().optional().describe('Include rollback support'),
    }),
    execute: async (args) => {
      const script = await generateDeploymentScript({
        environment: args.environment,
        platform: args.platform,
        project: args.project,
        validation: args.validation !== false,
        rollback: args.rollback !== false,
      });
      return {
        script,
        environment: args.environment,
        platform: args.platform,
      };
    },
  },
  {
    name: 'validate_environment_variables',
    description: 'Validate that required environment variables are present in a project',
    parameters: z.object({
      projectPath: z.string().describe('Path to the project directory'),
      requiredVars: z.array(z.string()).describe('List of required environment variable names'),
    }),
    execute: async (args) => {
      return await validateEnvVars(args.projectPath, args.requiredVars);
    },
  },
  {
    name: 'generate_env_example',
    description: 'Generate .env.example file from environment variable definitions',
    parameters: z.object({
      projectPath: z.string().describe('Path to the project directory'),
      envVars: z.array(z.object({
        name: z.string(),
        required: z.boolean(),
        description: z.string().optional(),
        defaultValue: z.string().optional(),
      })).describe('Environment variable definitions'),
    }),
    execute: async (args) => {
      const example = await generateEnvExample(args.projectPath, args.envVars);
      return {
        example,
        path: args.projectPath,
      };
    },
  },
  {
    name: 'sync_environment_variables',
    description: 'Sync environment variables from one project to another',
    parameters: z.object({
      sourcePath: z.string().describe('Source project path'),
      targetPath: z.string().describe('Target project path'),
      varsToSync: z.array(z.string()).describe('Environment variable names to sync'),
    }),
    execute: async (args) => {
      return await syncEnvVars(args.sourcePath, args.targetPath, args.varsToSync);
    },
  },
  {
    name: 'generate_api_documentation',
    description: 'Generate API documentation in OpenAPI, Swagger, or Markdown format',
    parameters: z.object({
      format: z.enum(['openapi', 'markdown', 'swagger']).describe('Documentation format'),
      routes: z.array(z.string()).optional().describe('List of route paths'),
      routeFiles: z.array(z.string()).optional().describe('Paths to route files to analyze'),
    }),
    execute: async (args) => {
      const docs = await generateApiDocumentation({
        format: args.format,
        routes: args.routes,
        routeFiles: args.routeFiles,
      });
      return {
        documentation: docs,
        format: args.format,
      };
    },
  },
  {
    name: 'analyze_code',
    description: 'Analyze code for patterns, issues, refactoring opportunities, and security concerns',
    parameters: z.object({
      filePath: z.string().optional().describe('Path to the file to analyze'),
      code: z.string().optional().describe('Code to analyze (if filePath not provided)'),
      analysisType: z.enum(['patterns', 'issues', 'refactoring', 'security', 'all']).describe('Type of analysis to perform'),
    }),
    execute: async (args) => {
      const analysis = await analyzeCode({
        filePath: args.filePath,
        code: args.code,
        analysisType: args.analysisType,
      });
      return {
        analysis,
        type: args.analysisType,
      };
    },
  },
  {
    name: 'generate_validators',
    description: 'Generate Zod, Yup, or Joi validation schemas from TypeScript types',
    parameters: z.object({
      types: z.string().describe('TypeScript type definitions'),
      framework: z.enum(['zod', 'yup', 'joi']).optional().describe('Validation framework to use'),
    }),
    execute: async (args) => {
      const validators = await generateValidators({
        types: args.types,
        framework: args.framework,
      });
      return {
        validators,
        framework: args.framework || 'zod',
      };
    },
  },
  {
    name: 'generate_error_handlers',
    description: 'Generate standardized error handling code with logging and recovery patterns',
    parameters: z.object({
      framework: z.enum(['nextjs', 'express', 'generic']).optional().describe('Framework to generate for'),
      logging: z.boolean().optional().describe('Include error logging'),
      recovery: z.boolean().optional().describe('Include error recovery patterns'),
    }),
    execute: async (args) => {
      const handlers = await generateErrorHandlers({
        framework: args.framework,
        logging: args.logging,
        recovery: args.recovery,
      });
      return {
        handlers,
        framework: args.framework || 'nextjs',
      };
    },
  },
];

