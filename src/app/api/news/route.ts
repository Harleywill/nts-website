import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/db";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, UserRole } from "@/lib/admin/permissions";

export async function GET() {
  try {
    const newsItems = await prisma.newsItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(newsItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
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
    if (!hasPermission(userRole, "news")) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to create news items" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const featured = formData.get("featured") === "true";
    const imageFile = formData.get("image") as File | null;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    let imageUrl = "";

    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads/news directory
      const uploadsDir = join("/var/www/uploads/news");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const extension = imageFile.name.split(".").pop();
      const filename = `${timestamp}-${random}.${extension}`;

      // Save file
      const filepath = join(uploadsDir, filename);
      await writeFile(filepath, buffer);
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
    console.error("News creation error:", error);
    return NextResponse.json({ error: "Failed to create news item" }, { status: 500 });
  }
}
