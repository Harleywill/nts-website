import { NextRequest, NextResponse } from "next/server";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

/**
 * Returns an error response if the request isn't from a signed-in user allowed
 * to manage hero images, or null if it may proceed.
 */
export async function denyUnlessHeroEditor(request: NextRequest): Promise<NextResponse | null> {
  const auth = await verifyAuthWithUser(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasPermission(auth.user.role as UserRole, "hero")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
