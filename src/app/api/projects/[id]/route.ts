import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { images: true },
    });
    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch project" },
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
    
    // Handle gallery images: delete existing and create new ones
    if (body.gallery) {
      await prisma.projectImage.deleteMany({
        where: { projectId: parseInt(id) },
      });
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        date: body.date ? new Date(body.date) : undefined,
        imageUrl: body.imageUrl,
        featured: body.featured,
        clientName: body.clientName,
        duration: body.duration,
        highlights: body.highlights,
        metrics: body.metrics,
        images: {
          create: body.gallery?.map((url: string) => ({
            imageUrl: url,
            alt: body.title,
          })) || [],
        },
      },
      include: { images: true },
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
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
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
