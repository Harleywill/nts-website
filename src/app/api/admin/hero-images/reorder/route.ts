import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessHeroEditor } from "@/lib/hero/auth";

// Admin: set the display order. Body is every slide id, in the new order.
export async function PUT(request: NextRequest) {
  const denied = await denyUnlessHeroEditor(request);
  if (denied) return denied;
  try {
    const { ids } = (await request.json()) as { ids?: unknown };
    if (!Array.isArray(ids) || !ids.every((id) => Number.isInteger(id))) {
      return NextResponse.json({ error: "ids must be an array of integers" }, { status: 400 });
    }
    await prisma.$transaction(
      (ids as number[]).map((id, index) =>
        prisma.heroImage.update({ where: { id }, data: { order: index } })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder hero images:", error);
    return NextResponse.json({ error: "Failed to reorder hero images" }, { status: 500 });
  }
}
