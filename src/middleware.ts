import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the authorization header
  const authHeader = request.headers.get('authorization');

  // Credentials: admin / password
  const credentials = Buffer.from('admin:password').toString('base64');
  const expectedAuth = `Basic ${credentials}`;

  // Check if auth header matches
  if (authHeader !== expectedAuth) {
    // Return 401 Unauthorized with WWW-Authenticate header to trigger browser login
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="NTS Website"',
      },
    });
  }

  // If authorized, continue to next middleware/route
  return NextResponse.next();
}

// Apply middleware to all routes except static files and api
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
