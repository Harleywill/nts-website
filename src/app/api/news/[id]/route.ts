import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const body = await request.json();
    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        featured: body.featured,
      },
    });
    return NextResponse.json(newsItem);
  } catch (error) {
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
