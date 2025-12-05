import { NextResponse } from 'next/server';

/**
 * Social Media Posting API
 * 
 * Endpoint to trigger social media posts via ai-gateway
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { platform, content, product } = body;

    if (!platform || !content) {
      return NextResponse.json(
        { error: 'Platform and content are required' },
        { status: 400 }
      );
    }

    // Forward to ai-gateway for processing
    const aiGatewayUrl = process.env.AI_GATEWAY_URL || 'https://ai.affynix.ai';
    const apiKey = process.env.AI_GATEWAY_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI Gateway API key not configured' },
        { status: 500 }
      );
    }

    // Determine which tool to use based on platform
    const toolMap = {
      twitter: 'post_to_twitter',
      facebook: 'post_to_facebook',
      linkedin: 'post_to_linkedin',
    };

    const tool = toolMap[platform.toLowerCase()];
    if (!tool) {
      return NextResponse.json(
        { error: `Unsupported platform: ${platform}` },
        { status: 400 }
      );
    }

    // Call ai-gateway chat API to execute the tool
    const response = await fetch(`${aiGatewayUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        message: `Use the ${tool} tool to post this content: ${content}`,
        tools: [tool],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: 'Failed to post to social media', details: error },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      platform,
      result,
    });
  } catch (error) {
    console.error('[Social Media API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'social-media-posting',
    supportedPlatforms: ['twitter', 'facebook', 'linkedin'],
  });
}

