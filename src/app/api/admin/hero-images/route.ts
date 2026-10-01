import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { denyUnlessHeroEditor } from "@/lib/hero/auth";

// Admin: every hero slide, including hidden ones.
export async function GET(request: NextRequest) {
  const denied = await denyUnlessHeroEditor(request);
  if (denied) return denied;
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch hero images:", error);
    return NextResponse.json({ error: "Failed to fetch hero images" }, { status: 500 });
  }
}

// Admin: add a slide (image already uploaded via /api/upload) to the end.
export async function POST(request: NextRequest) {
  const denied = await denyUnlessHeroEditor(request);
  if (denied) return denied;
  try {
    const { imageUrl } = (await request.json()) as { imageUrl?: string };
    if (typeof imageUrl !== "string" || !imageUrl.startsWith("/")) {
      return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
    }
    const last = await prisma.heroImage.findFirst({ orderBy: { order: "desc" } });
    const image = await prisma.heroImage.create({
      data: { imageUrl, order: (last?.order ?? -1) + 1 },
    });
    return NextResponse.json(image);
  } catch (error) {
    console.error("Failed to create hero image:", error);
    return NextResponse.json({ error: "Failed to create hero image" }, { status: 500 });
  }
}
