import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testimonial = await prisma.testimonial.create({
      data: {
        text: body.text,
        name: body.name,
        company: body.company || null,
        projectId: body.projectId ? parseInt(body.projectId) : null,
        featured: body.featured || false,
      },
    });
    return NextResponse.json(testimonial);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
