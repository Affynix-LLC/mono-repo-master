import { route } from '../../router';

export async function generateProductDescription(args: {
  productName: string;
  category: string;
  features?: string[];
}) {
  try {
    const featuresText = args.features?.length
      ? `\nFeatures: ${args.features.join(', ')}`
      : '';
    
    const prompt = `Generate a compelling product description for:
Product: ${args.productName}
Category: ${args.category}${featuresText}

Write a professional, SEO-friendly product description that highlights benefits and features. Keep it concise but informative.`;
    
    const result = await route(prompt);
    return {
      productName: args.productName,
      category: args.category,
      description: result.text,
    };
  } catch (error: any) {
    throw new Error(`Product description generation failed: ${error.message}`);
  }
}

export async function generateSeoContent(args: {
  topic: string;
  keywords: string[];
  length?: 'short' | 'medium' | 'long';
}) {
  try {
    const lengthInstructions = {
      short: 'Write a brief 150-200 word piece',
      medium: 'Write a medium-length 400-600 word piece',
      long: 'Write a comprehensive 1000+ word piece',
    };
    
    const prompt = `Generate SEO-optimized content about: ${args.topic}

Keywords to include: ${args.keywords.join(', ')}

${lengthInstructions[args.length || 'medium']}

Make sure to naturally incorporate the keywords and create engaging, valuable content.`;
    
    const result = await route(prompt);
    return {
      topic: args.topic,
      keywords: args.keywords,
      content: result.text,
      wordCount: result.text.split(/\s+/).length,
    };
  } catch (error: any) {
    throw new Error(`SEO content generation failed: ${error.message}`);
  }
}

