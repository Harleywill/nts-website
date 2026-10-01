import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Public: published hero slides for the home page carousel, in display order.
export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { id: "asc" }],
      select: { id: true, imageUrl: true, caption: true, alt: true },
    });
    return NextResponse.json(images);
  } catch (error) {
    console.error("Failed to fetch hero images:", error);
    return NextResponse.json({ error: "Failed to fetch hero images" }, { status: 500 });
  }
}
