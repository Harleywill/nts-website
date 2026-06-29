import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { date: "desc" },
      include: { images: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission
    const userRole = authResult.user.role as UserRole;
    if (!hasPermission(userRole, "projects")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create projects" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        date: body.date ? new Date(body.date) : new Date(),
        imageUrl: body.imageUrl,
        cropX: body.cropX ?? 0.5,
        cropY: body.cropY ?? 0.5,
        cropWidth: body.cropWidth ?? 1,
        cropHeight: body.cropHeight ?? 1,
        featured: body.featured || false,
        clientName: body.clientName || null,
        duration: body.duration || null,
        highlights: body.highlights || null,
        metrics: body.metrics || null,
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
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
