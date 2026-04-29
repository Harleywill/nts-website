import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsItem = await prisma.newsItem.findUnique({
      where: { id: parseInt(id) },
    });
    if (!newsItem) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch news item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const featured = formData.get("featured") === "true";
    const imageFile = formData.get("image") as File | null;

    const existingNews = await prisma.newsItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 }
      );
    }

    let imageUrl = existingNews.imageUrl;

    if (imageFile) {
      const buffer = await imageFile.arrayBuffer();
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name}`;
      const uploadDir = join(process.cwd(), "public/uploads/news");

      await mkdir(uploadDir, { recursive: true });
      await writeFile(join(uploadDir, filename), Buffer.from(buffer));

      imageUrl = `/uploads/news/${filename}`;
    }

    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        imageUrl,
        featured,
      },
    });
    return NextResponse.json(newsItem);
  } catch (error) {
    console.error("Error updating news item:", error);
    return NextResponse.json(
      { error: "Failed to update news item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.newsItem.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete news item" },
      { status: 500 }
    );
  }
}
