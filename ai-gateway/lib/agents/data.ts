import { toolRegistry } from '../tools/registry';
import { route } from '../../router';

export class DataAgent {
  async execute(task: string, parameters: any): Promise<any> {
    switch (task) {
      case 'transform_json':
        return toolRegistry.execute('transform_json', parameters);
      case 'aggregate_data':
        return toolRegistry.execute('aggregate_data', parameters);
      case 'process_csv':
        // CSV processing would be implemented here
        throw new Error('CSV processing not yet implemented');
      default:
        // Generic data processing
        const prompt = `Process data: ${task}\n\nParameters: ${JSON.stringify(parameters, null, 2)}`;
        const result = await route(prompt);
        return result.text;
    }
  }
}

export const dataAgent = new DataAgent();

