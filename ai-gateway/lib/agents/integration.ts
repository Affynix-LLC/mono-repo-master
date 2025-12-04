import { toolRegistry } from '../tools/registry';
import axios from 'axios';

export class IntegrationAgent {
  async execute(task: string, parameters: any): Promise<any> {
    switch (task) {
      case 'http_get':
        return toolRegistry.execute('http_get', parameters);
      case 'http_post':
        return toolRegistry.execute('http_post', parameters);
      case 'get_affynix_products':
        return toolRegistry.execute('get_affynix_products', parameters);
      case 'update_affynix_product':
        return toolRegistry.execute('update_affynix_product', parameters);
      case 'create_affynix_product':
        return toolRegistry.execute('create_affynix_product', parameters);
      default:
        // Generic integration task
        if (parameters.url) {
          const method = task.toLowerCase().includes('post') ? 'post' : 'get';
          const response = await axios({
            method,
            url: parameters.url,
            data: parameters.data,
            headers: parameters.headers,
          });
          return response.data;
        }
        throw new Error(`Unknown integration task: ${task}`);
    }
  }
}

export const integrationAgent = new IntegrationAgent();

