import { NextRequest, NextResponse } from "next/server";
import { hasPermission, isAdministrator, UserRole } from "@/lib/admin/permissions";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface AuthResult {
  success: boolean;
  user?: {
    userId: number;
    username: string;
    role: string;
    passwordChanged: boolean;
  };
  error?: string;
}

/**
 * Verifies authentication from request and retrieves user with role
 * Extracts token from:
 * 1. Authorization header (Bearer token)
 * 2. admin-session cookie
 */
export async function verifyAuthWithUser(
  request: NextRequest
): Promise<AuthResult> {
  try {
    let token: string | null = null;

    // Check Authorization header first (Bearer token)
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }

    // Fall back to admin-session cookie
    if (!token) {
      const sessionCookie = request.cookies.get("admin-session");
      if (sessionCookie) {
        token = sessionCookie.value;
      }
    }

    if (!token) {
      return { success: false, error: "No authentication token provided" };
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload || typeof payload !== "object") {
      return { success: false, error: "Invalid or expired token" };
    }

    // Get user from database to retrieve role
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: { id: true, username: true, role: true, passwordChanged: true },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      user: {
        userId: user.id,
        username: user.username,
        role: user.role,
        passwordChanged: user.passwordChanged,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Route guard: returns a 401/403 response unless the request carries a valid
 * session for a user allowed to access `resource` (see RESOURCE_PERMISSIONS),
 * or null if the request may proceed. Pass "admin" to allow administrators only.
 */
export async function denyUnlessPermitted(
  request: NextRequest,
  resource: string
): Promise<NextResponse | null> {
  const auth = await verifyAuthWithUser(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = auth.user.role as UserRole;
  const allowed = resource === "admin" ? isAdministrator(role) : hasPermission(role, resource);
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
