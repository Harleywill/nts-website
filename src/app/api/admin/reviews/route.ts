import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const review = await prisma.googleReview.create({
      data: {
        author: body.author,
        text: body.text,
        rating: body.rating || 5,
        imageUrl: body.imageUrl || null,
        published: body.published ?? false,
        order: body.order || 0,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.googleReview.findMany({
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
