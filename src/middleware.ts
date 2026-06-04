import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // All other /admin/* routes require authentication
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-session');
    
    if (!authCookie) {
      // No session found - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Verify session cookie exists and has value
    try {
      // Basic validation - in production, would verify JWT or session token
      const sessionValue = authCookie.value;
      if (!sessionValue) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      // Session exists, allow access
      return NextResponse.next();
    } catch (error) {
      // Error validating session - redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // All non-admin routes allowed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin(.*)'],
};
