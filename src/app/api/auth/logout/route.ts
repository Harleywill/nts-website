import { NextRequest, NextResponse } from "next/server";

// Cookies set at login. Both must be cleared or the middleware still sees a
// valid session and admin pages stay reachable after "logout".
const SESSION_COOKIES = ["admin-session", "auth-status"];

function clearSession(response: NextResponse) {
  for (const name of SESSION_COOKIES) {
    response.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });
  }
  return response;
}

export async function POST(request: NextRequest) {
  // Redirect back to the login page on the same host the request came from.
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  return clearSession(response);
}

// Allow a plain GET (e.g. a link) to log out too.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  return clearSession(response);
}
