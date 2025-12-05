// Secure API key authentication middleware

interface AuthResult {
  authorized: boolean;
  error?: Response;
}

/**
 * Verify API key from request headers
 * Supports multiple methods:
 * - x-api-key header
 * - Authorization: Bearer <token>
 * - x-vercel-protection-bypass (for Vercel protection bypass)
 */
export function verifyApiKey(req: Request): boolean {
  // Get API key from various sources
  const apiKey = 
    req.headers.get('x-api-key') || 
    req.headers.get('authorization')?.replace('Bearer ', '').trim() ||
    req.headers.get('x-vercel-protection-bypass'); // For Vercel bypass token
  
  // Get valid keys from environment
  const validKeys = [
    process.env.API_KEY,
    process.env.AI_GATEWAY_API_KEY,
    process.env.VERCEL_PROTECTION_BYPASS, // If using Vercel bypass
  ].filter(Boolean) as string[];
  
  // If no API keys configured, deny access (fail secure)
  if (validKeys.length === 0) {
    console.warn('No API keys configured - denying all access');
    return false;
  }
  
  // Check if provided key matches any valid key
  if (!apiKey) {
    return false;
  }
  
  return validKeys.includes(apiKey);
}

/**
 * Require authentication - returns error response if not authorized
 */
export function requireAuth(req: Request): Response | null {
  if (!verifyApiKey(req)) {
    return new Response(
      JSON.stringify({ 
        error: 'Unauthorized',
        message: 'Invalid or missing API key. Provide x-api-key header or Authorization: Bearer <token>',
        code: 'UNAUTHORIZED'
      }),
      {
        status: 401,
        headers: { 
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer realm="AI Gateway"'
        },
      }
    );
  }
  return null;
}

/**
 * Optional authentication - allows public access but logs authenticated requests
 */
export function optionalAuth(req: Request): { authenticated: boolean; apiKey?: string } {
  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '').trim();
  const authenticated = apiKey ? verifyApiKey(req) : false;
  
  return {
    authenticated,
    apiKey: authenticated ? apiKey : undefined,
  };
}

/**
 * Check if request is from allowed origin (for CORS)
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
  
  // If no origins configured, allow all (for API gateway)
  if (allowedOrigins.length === 0) {
    return true;
  }
  
  return allowedOrigins.some(allowed => {
    if (allowed.includes('*')) {
      const pattern = allowed.replace(/\*/g, '.*');
      return new RegExp(`^${pattern}$`).test(origin);
    }
    return origin === allowed;
  });
}

