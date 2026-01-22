/**
 * Ingestion Router
 *
 * Routes incoming leads to appropriate handlers based on source
 */

import { Lead } from '../types';
import { IngestionResult, IngestionSource } from './base-handler';
import { emailHandler } from './email-handler';
import { crmHandler } from './crm-handler';
import { linkedinHandler } from './linkedin-handler';
import { webhookHandler } from './webhook-handler';

export class IngestionRouter {
  private handlers = {
    email: emailHandler,
    crm: crmHandler,
    linkedin: linkedinHandler,
    webhook: webhookHandler,
  };

  /**
   * Process incoming lead data from any source
   */
  async ingest(
    sourceType: IngestionSource['type'],
    data: any
  ): Promise<IngestionResult> {
    const handler = this.handlers[sourceType];

    if (!handler) {
      return {
        success: false,
        error: `No handler found for source type: ${sourceType}`,
      };
    }

    try {
      return await handler.process(data);
    } catch (error: any) {
      return {
        success: false,
        error: `Ingestion failed: ${error.message}`,
        metadata: {
          sourceType,
          errorStack: error.stack,
        },
      };
    }
  }

  /**
   * Validate data before ingestion
   */
  validate(sourceType: IngestionSource['type'], data: any): {
    valid: boolean;
    errors?: string[];
  } {
    const handler = this.handlers[sourceType];

    if (!handler) {
      return {
        valid: false,
        errors: [`No handler found for source type: ${sourceType}`],
      };
    }

    return handler.validate(data);
  }

  /**
   * Get available source types
   */
  getAvailableSources(): IngestionSource['type'][] {
    return Object.keys(this.handlers) as IngestionSource['type'][];
  }

  /**
   * Register a custom handler
   */
  registerHandler(sourceType: string, handler: any): void {
    this.handlers[sourceType as keyof typeof this.handlers] = handler;
  }
}

export const ingestionRouter = new IngestionRouter();
