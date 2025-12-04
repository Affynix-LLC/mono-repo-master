import { route } from '../../router';

export async function transformJson(args: { data: any; transformation: string }) {
  try {
    const prompt = `Transform the following JSON data according to this description: "${args.transformation}"

Data:
${JSON.stringify(args.data, null, 2)}

Return only the transformed JSON data, no explanation.`;
    
    const result = await route(prompt);
    // Try to parse as JSON, if it fails return as-is
    try {
      return JSON.parse(result.text);
    } catch {
      return result.text;
    }
  } catch (error: any) {
    throw new Error(`JSON transformation failed: ${error.message}`);
  }
}

export async function aggregateData(args: {
  data: any[];
  groupBy: string;
  operation: 'sum' | 'count' | 'avg' | 'min' | 'max';
  field?: string;
}) {
  try {
    const grouped: Record<string, any[]> = {};
    
    // Group data
    for (const item of args.data) {
      const key = item[args.groupBy];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    }

    // Aggregate
    const result: Record<string, any> = {};
    for (const [key, items] of Object.entries(grouped)) {
      switch (args.operation) {
        case 'count':
          result[key] = items.length;
          break;
        case 'sum':
          if (!args.field) throw new Error('Field required for sum operation');
          result[key] = items.reduce((sum, item) => sum + (Number(item[args.field]) || 0), 0);
          break;
        case 'avg':
          if (!args.field) throw new Error('Field required for avg operation');
          const sum = items.reduce((s, item) => s + (Number(item[args.field]) || 0), 0);
          result[key] = sum / items.length;
          break;
        case 'min':
          if (!args.field) throw new Error('Field required for min operation');
          result[key] = Math.min(...items.map((item) => Number(item[args.field]) || 0));
          break;
        case 'max':
          if (!args.field) throw new Error('Field required for max operation');
          result[key] = Math.max(...items.map((item) => Number(item[args.field]) || 0));
          break;
      }
    }

    return result;
  } catch (error: any) {
    throw new Error(`Data aggregation failed: ${error.message}`);
  }
}

