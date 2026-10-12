import { NextRequest, NextResponse } from "next/server";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { getLiveStatsSyncStatus } from "@/lib/live-stats";

export async function GET(request: NextRequest) {
  const auth = await verifyAuthWithUser(request);
  if (!auth.success || !auth.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await getLiveStatsSyncStatus());
  } catch (error) {
    console.error("Error reading live stats sync status:", error);
    return NextResponse.json({ error: "Failed to read sync status" }, { status: 500 });
  }
}
