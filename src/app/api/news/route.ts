import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const newsItems = await prisma.newsItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(newsItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const featured = formData.get("featured") === "true";
    const imageFile = formData.get("image") as File | null;

    let imageUrl: string | null = null;

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name}`;
      const uploadDir = join(process.cwd(), "public/uploads/news");

      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), Buffer.from(buffer));

      imageUrl = `/uploads/news/${filename}`;
    }

    const newsItem = await prisma.newsItem.create({
      data: {
        title,
        content,
        imageUrl,
        featured,
      },
    });
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Error creating news item:", error);
    return NextResponse.json(
      { error: "Failed to create news item" },
      { status: 500 }
    );
  }
}
