import { NextRequest, NextResponse } from "next/server";
import { verifyAuthWithUser } from "@/lib/auth-middleware";

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthWithUser(request);

    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      userId: authResult.user.userId,
      username: authResult.user.username,
      role: authResult.user.role,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
