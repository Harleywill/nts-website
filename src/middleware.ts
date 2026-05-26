import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-key'
);

async function verifyAuth(request: NextRequest): Promise<boolean> {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return false;
    }

    // Verify the token
    await jwtVerify(token, SECRET);
    return true;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow login page without authentication
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Verify JWT token for all other admin routes
  const isAuthenticated = await verifyAuth(request);

  if (!isAuthenticated) {
    // Redirect to login page
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, continue to next middleware/route
  return NextResponse.next();
}

// Apply middleware to admin routes only
export const config = {
  matcher: [
    '/admin(.*)',
  ],
};
