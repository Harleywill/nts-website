import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reviews = await prisma.googleReview.findMany({
      where: {
        published: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({
      reviews,
    });
  } catch (error) {
    console.error("Error fetching Google reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
