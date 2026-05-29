import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (!apiKey || !agentId) {
      console.error('Missing API key or agent ID');
      return NextResponse.json(
        { error: 'Missing API key or agent ID' },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const requestAgentId = body.agent_id || agentId;

    console.log('🔄 Creating Retell web call for agent:', requestAgentId);

    // Call official Retell API v2 endpoint
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        agent_id: requestAgentId,
        metadata: body.metadata,
        retell_llm_dynamic_variables: body.retell_llm_dynamic_variables,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Retell API error:', response.status, error);
      return NextResponse.json(
        { error: 'Failed to create web call', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Web call created successfully');
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error creating web call:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
