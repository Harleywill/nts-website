import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessPermitted } from "@/lib/auth-middleware";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await denyUnlessPermitted(request, "admin");
  if (denied) return denied;

  const { id } = await params;
  try {
    await prisma.accreditation.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if ((error as any)?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
