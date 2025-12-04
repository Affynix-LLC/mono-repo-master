import { route } from '../../router';
import { toolRegistry } from '../tools/registry';

export class ContentAgent {
  async execute(task: string, parameters: any): Promise<any> {
    switch (task) {
      case 'generate_product_description':
        return toolRegistry.execute('generate_product_description', parameters);
      case 'generate_seo_content':
        return toolRegistry.execute('generate_seo_content', parameters);
      case 'generate_subdomain_content':
        return toolRegistry.execute('generate_subdomain_content', parameters);
      case 'optimize_product_description':
        return toolRegistry.execute('optimize_product_description', parameters);
      default:
        // Generic content generation
        const prompt = `Generate content: ${task}\n\nParameters: ${JSON.stringify(parameters, null, 2)}`;
        const result = await route(prompt);
        return result.text;
    }
  }
}

export const contentAgent = new ContentAgent();

