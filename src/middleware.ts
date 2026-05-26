import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Middleware disabled - all routes allowed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin(.*)'],
};
