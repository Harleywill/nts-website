import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export interface AuthResult {
  success: boolean;
  user?: {
    userId: number;
    username: string;
    role: string;
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
      select: { id: true, username: true, role: true },
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
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return { success: false, error: "Authentication failed" };
  }
}

/**
 * Simple auth check for routes that just need to verify authentication exists
 */
export function isAdminAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const sessionCookie = request.cookies.get("admin-session");
  return !!(
    (authHeader && authHeader.startsWith("Bearer ")) ||
    (sessionCookie && sessionCookie.value)
  );
}
