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
      case 'generate_api_route':
        return toolRegistry.execute('generate_api_route', parameters);
      case 'generate_typescript_types':
        return toolRegistry.execute('generate_typescript_types', parameters);
      case 'generate_integration_code':
        return toolRegistry.execute('generate_integration_code', parameters);
      case 'generate_test_file':
        return toolRegistry.execute('generate_test_file', parameters);
      case 'generate_deployment_script':
        return toolRegistry.execute('generate_deployment_script', parameters);
      case 'validate_environment_variables':
        return toolRegistry.execute('validate_environment_variables', parameters);
      case 'generate_api_documentation':
        return toolRegistry.execute('generate_api_documentation', parameters);
      case 'analyze_code':
        return toolRegistry.execute('analyze_code', parameters);
      case 'generate_validators':
        return toolRegistry.execute('generate_validators', parameters);
      case 'generate_error_handlers':
        return toolRegistry.execute('generate_error_handlers', parameters);
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

