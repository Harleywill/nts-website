import { NextRequest, NextResponse } from 'next/server';

// Google's published IP ranges (CIDR notation)
// These are used by Googlebot, Google Tag Manager, Google Analytics, and other Google services
const GOOGLE_IP_RANGES = [
  '35.184.0.0/13',
  '35.192.0.0/11',
  '35.224.0.0/13',
  '35.232.0.0/14',
  '35.236.0.0/14',
  '35.240.0.0/13',
  '64.233.160.0/19',
  '66.102.0.0/20',
  '66.249.64.0/19',
  '72.14.192.0/18',
  '74.6.0.0/16',
  '74.125.0.0/16',
  '173.194.0.0/16',
  '199.36.153.4/30',
  '199.36.153.8/30',
  '216.58.192.0/19',
  '216.239.32.0/19',
];

// Utility function to check if IP is in CIDR range
function isIPInRange(ip: string, cidr: string): boolean {
  const [range, bits] = cidr.split('/');
  const mask = ~(Math.pow(2, 32 - parseInt(bits, 10)) - 1);

  const ipParts = ip.split('.').map(Number);
  const rangeParts = range.split('.').map(Number);

  const ipNum = ipParts.reduce((acc, part) => (acc << 8) + part, 0);
  const rangeNum = rangeParts.reduce((acc, part) => (acc << 8) + part, 0);

  return (ipNum & mask) === (rangeNum & mask);
}

// Check if request is from Google
function isGoogleRequest(request: NextRequest): boolean {
  // Get client IP from various headers (in order of preference)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
             request.headers.get('cf-connecting-ip') ||
             request.headers.get('x-real-ip') ||
             request.ip ||
             '';

  // Check against Google IP ranges
  return GOOGLE_IP_RANGES.some(range => isIPInRange(ip, range));
}

export function middleware(request: NextRequest) {
  // Allow Google services to access the site without authentication
  if (isGoogleRequest(request)) {
    return NextResponse.next();
  }

  // Get the authorization header
  const authHeader = request.headers.get('authorization');

  // Credentials: admin / 301974
  const credentials = Buffer.from('admin:301974').toString('base64');
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

// Apply middleware to admin UI pages only (not API routes)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
