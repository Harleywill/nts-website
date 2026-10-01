import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessHeroEditor } from "@/lib/hero/auth";

// Admin: update a slide's caption, alt text or visibility.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await denyUnlessHeroEditor(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    const body = (await request.json()) as { caption?: string; alt?: string; published?: boolean };
    // Blank strings clear the field so the caption disappears from the hero.
    const clean = (v: string) => (v.trim() === "" ? null : v.trim());
    const image = await prisma.heroImage.update({
      where: { id: parseInt(id) },
      data: {
        ...(typeof body.caption === "string" && { caption: clean(body.caption) }),
        ...(typeof body.alt === "string" && { alt: clean(body.alt) }),
        ...(typeof body.published === "boolean" && { published: body.published }),
      },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Failed to update hero image:", error);
    return NextResponse.json({ error: "Failed to update hero image" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await denyUnlessHeroEditor(request);
  if (denied) return denied;
  try {
    const { id } = await params;
    await prisma.heroImage.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete hero image:", error);
    return NextResponse.json({ error: "Failed to delete hero image" }, { status: 500 });
  }
}
