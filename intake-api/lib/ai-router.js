import OpenAI from 'openai';
import { classifyCategoryToSubdomain } from '../utils/subdomainRouter.js';
import { saveRoutingDecision, getSimilarRoutings } from './learning-db.js';

/**
 * AI-Powered Subdomain Router
 * 
 * Uses OpenAI embeddings and LLM to intelligently route offers to subdomains
 * based on semantic understanding of the offer content.
 */

const openaiApiKey = process.env.OPENAI_API_KEY;
let openai = null;

if (openaiApiKey) {
  openai = new OpenAI({ apiKey: openaiApiKey });
} else {
  console.warn('[AI Router] OPENAI_API_KEY not set - AI routing disabled, using static routing');
}

// Subdomain descriptions for embedding comparison
const SUBDOMAIN_DESCRIPTIONS = {
  business: 'Business development, digital marketing, e-commerce, entrepreneurship, online business tools, marketing strategies, business growth',
  marketing: 'Digital marketing, email marketing, social media marketing, SEO, advertising, marketing automation, content marketing',
  health: 'Health, fitness, wellness, nutrition, supplements, weight loss, beauty, anti-aging, mental health, physical wellness',
  money: 'Money, finance, investing, wealth building, financial freedom, personal finance, money management, financial independence',
  finance: 'Finance, investing, stocks, trading, financial planning, investment education, wealth management',
  crypto: 'Cryptocurrency, crypto trading, blockchain, Bitcoin, Ethereum, crypto investing, digital assets, DeFi',
  tech: 'Technology, software, tech tools, productivity software, tech gadgets, software development, tech solutions',
  ai: 'Artificial intelligence, AI tools, machine learning, AI software, automation, AI-powered solutions',
  software: 'Software, applications, SaaS, software tools, productivity software, business software',
  home: 'Home improvement, home decor, lifestyle products, home organization, home maintenance, household items',
  lifestyle: 'Lifestyle, personal development, self-improvement, life transformation, motivation, success, personal growth',
  relationships: 'Relationships, dating, romance, relationship advice, dating coaching, relationship improvement, social skills',
  education: 'Education, courses, training, online learning, educational content, skill development, learning programs',
  general: 'General products, miscellaneous items, uncategorized offers, general marketplace'
};

// Cache for subdomain embeddings (computed once)
let subdomainEmbeddingsCache = null;

/**
 * Get embedding for text using OpenAI
 */
async function getEmbedding(text) {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('[AI Router] Error getting embedding:', error);
    throw error;
  }
}

/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Get or compute subdomain embeddings
 */
async function getSubdomainEmbeddings() {
  if (subdomainEmbeddingsCache) {
    return subdomainEmbeddingsCache;
  }

  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  try {
    const embeddings = {};
    const subdomains = Object.keys(SUBDOMAIN_DESCRIPTIONS);
    
    // Get embeddings for all subdomains in parallel
    const embeddingPromises = subdomains.map(async (subdomain) => {
      const description = SUBDOMAIN_DESCRIPTIONS[subdomain];
      const embedding = await getEmbedding(description);
      return { subdomain, embedding };
    });

    const results = await Promise.all(embeddingPromises);
    results.forEach(({ subdomain, embedding }) => {
      embeddings[subdomain] = embedding;
    });

    subdomainEmbeddingsCache = embeddings;
    return embeddings;
  } catch (error) {
    console.error('[AI Router] Error computing subdomain embeddings:', error);
    throw error;
  }
}

/**
 * Find best matching subdomain using embeddings
 */
async function findBestSubdomainByEmbedding(offerEmbedding) {
  try {
    const subdomainEmbeddings = await getSubdomainEmbeddings();
    const similarities = [];

    for (const [subdomain, embedding] of Object.entries(subdomainEmbeddings)) {
      const similarity = cosineSimilarity(offerEmbedding, embedding);
      similarities.push({ subdomain, similarity });
    }

    // Sort by similarity (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities[0]; // Return best match
  } catch (error) {
    console.error('[AI Router] Error finding best subdomain:', error);
    throw error;
  }
}

/**
 * Use LLM to make final routing decision with context
 */
async function llmRoute(offer, embeddingMatch, similarRoutings = []) {
  if (!openai) {
    return embeddingMatch.subdomain; // Fallback to embedding match
  }

  try {
    const subdomains = Object.keys(SUBDOMAIN_DESCRIPTIONS).join(', ');
    
    let context = '';
    if (similarRoutings.length > 0) {
      const examples = similarRoutings.slice(0, 3).map(r => 
        `- "${r.offerName}" (${r.category}) → ${r.subdomain}${r.correctSubdomain ? ` (corrected to: ${r.correctSubdomain})` : ''}`
      ).join('\n');
      context = `\n\nSimilar past routings:\n${examples}`;
    }

    const prompt = `You are an expert at categorizing affiliate offers for routing to subdomains.

Available subdomains: ${subdomains}

Offer details:
- Name: ${offer.name}
- Category: ${offer.category || 'Not specified'}
- Summary: ${offer.summary || 'No summary'}
- Network: ${offer.network}

Embedding-based match: ${embeddingMatch.subdomain} (confidence: ${(embeddingMatch.similarity * 100).toFixed(1)}%)${context}

Determine the best subdomain for this offer. Consider:
1. The primary focus of the offer
2. The target audience
3. The content and purpose

Respond with ONLY the subdomain name (e.g., "health", "business", "money"), nothing else.`;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a routing assistant. Respond with only the subdomain name.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 20
    });

    const llmSubdomain = response.choices[0].message.content.trim().toLowerCase();
    
    // Validate the LLM response is a valid subdomain
    if (SUBDOMAIN_DESCRIPTIONS[llmSubdomain]) {
      return llmSubdomain;
    }

    // If LLM returned invalid subdomain, use embedding match
    console.warn(`[AI Router] LLM returned invalid subdomain "${llmSubdomain}", using embedding match`);
    return embeddingMatch.subdomain;
  } catch (error) {
    console.error('[AI Router] Error in LLM routing:', error);
    return embeddingMatch.subdomain; // Fallback to embedding match
  }
}

/**
 * Main routing function
 */
export async function routeOffer(offer) {
  // Fallback to static routing if OpenAI is not configured
  if (!openai) {
    console.log('[AI Router] Using static routing (OpenAI not configured)');
    const staticSubdomain = classifyCategoryToSubdomain(offer.category);
    return { subdomain: staticSubdomain, confidence: 0.5, method: 'static' };
  }

  try {
    // Build offer text for embedding
    const offerText = `${offer.name} ${offer.category || ''} ${offer.summary || ''}`.trim();
    
    if (!offerText) {
      console.warn('[AI Router] Empty offer text, using static routing');
      const staticSubdomain = classifyCategoryToSubdomain(offer.category);
      return { subdomain: staticSubdomain, confidence: 0.5, method: 'static' };
    }

    // Get embedding for the offer
    const offerEmbedding = await getEmbedding(offerText);

    // Find best match using embeddings
    const embeddingMatch = await findBestSubdomainByEmbedding(offerEmbedding);

    // Get similar past routings for context
    const similarRoutings = await getSimilarRoutings(offer);

    // Use LLM for final decision
    const finalSubdomain = await llmRoute(offer, embeddingMatch, similarRoutings);

    // Calculate confidence (use embedding similarity as base, adjust based on LLM agreement)
    let confidence = embeddingMatch.similarity;
    if (finalSubdomain === embeddingMatch.subdomain) {
      confidence = Math.min(0.95, confidence + 0.1); // Boost confidence if LLM agrees
    } else {
      confidence = Math.max(0.3, confidence - 0.1); // Lower confidence if LLM disagrees
    }

    // Record routing decision for learning
    await saveRoutingDecision(offer, finalSubdomain, confidence).catch(err => {
      console.error('[AI Router] Error saving routing decision:', err);
    });

    console.log(`[AI Router] Routed "${offer.name}" → ${finalSubdomain} (confidence: ${(confidence * 100).toFixed(1)}%)`);

    return {
      subdomain: finalSubdomain,
      confidence,
      method: 'ai',
      embeddingMatch: embeddingMatch.subdomain,
      embeddingSimilarity: embeddingMatch.similarity
    };
  } catch (error) {
    console.error('[AI Router] Error in AI routing, falling back to static:', error);
    
    // Fallback to static routing
    const staticSubdomain = classifyCategoryToSubdomain(offer.category);
    return { subdomain: staticSubdomain, confidence: 0.5, method: 'static-fallback' };
  }
}

