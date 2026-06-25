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

    return NextResponse.json(authResult.user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
