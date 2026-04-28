import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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
    const body = await request.json();
    const newsItem = await prisma.newsItem.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        featured: body.featured || false,
      },
    });
    return NextResponse.json(newsItem);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create news item" },
      { status: 500 }
    );
  }
}
