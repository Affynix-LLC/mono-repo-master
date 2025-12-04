import { requireAuth } from '../../../../lib/auth';
import { generateApiRoute } from '../../../../lib/tools/backend/generate-route';
import { generateTypeScriptTypes } from '../../../../lib/tools/backend/generate-types';
import { generateIntegrationCode } from '../../../../lib/tools/backend/generate-integration';
import { generateTestFile } from '../../../../lib/tools/backend/generate-tests';

// POST /api/backend/generate/route - Generate API route
export async function POST(req: Request) {
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json() as {
      type: 'route' | 'types' | 'integration' | 'tests';
      spec: any;
    };

    const { type, spec } = body;

    let result: any;

    switch (type) {
      case 'route':
        result = {
          code: await generateApiRoute(spec),
          type: 'route',
        };
        break;

      case 'types':
        result = {
          types: await generateTypeScriptTypes(spec),
          type: 'types',
        };
        break;

      case 'integration':
        result = {
          code: await generateIntegrationCode(spec),
          type: 'integration',
        };
        break;

      case 'tests':
        result = {
          testCode: await generateTestFile(spec),
          type: 'tests',
        };
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown generation type: ${type}` }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Backend generate error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

