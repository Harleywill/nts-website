import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RETELL_API_KEY;
    const agentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (!apiKey || !agentId) {
      return NextResponse.json(
        { error: 'Missing API key or agent ID' },
        { status: 500 }
      );
    }

    console.log('Creating Retell web session for agent:', agentId);

    // Call Retell API v2 to create a web session/call
    const response = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Retell API error:', response.status, error);
      return NextResponse.json(
        { error: 'Failed to create web call session', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Web call session created:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating Retell web call session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
