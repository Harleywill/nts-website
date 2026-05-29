import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {

    // Fetch application from database
    const application = await prisma.application.findUnique({
      where: { id },
      select: {
        id: true,
        cvUrl: true,
        cvFilename: true,
        fullName: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Validate that cvUrl is a safe relative path (prevent path traversal)
    if (application.cvUrl.includes('..') || application.cvUrl.startsWith('/')) {
      console.error(`Invalid CV URL format for application ${id}:`, application.cvUrl);
      return NextResponse.json(
        { error: "Invalid CV file reference" },
        { status: 400 }
      );
    }

    if (!application.cvUrl || !application.cvFilename) {
      return NextResponse.json(
        { error: "No CV file associated with this application" },
        { status: 404 }
      );
    }

    // Extract filename using path.basename
    const fileName = path.basename(application.cvUrl);

    // Build the file path
    const filePath = path.join(process.cwd(), "public", "uploads", "cv", fileName);

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Validate file size (10MB max)
    const maxFileSize = 10 * 1024 * 1024;
    if (fileBuffer.length > maxFileSize) {
      console.warn(`CV file too large for application ${id}: ${fileBuffer.length} bytes`);
      return NextResponse.json(
        { error: "File is too large to download" },
        { status: 413 }
      );
    }

    // Determine the content type based on file extension
    const ext = path.extname(fileName).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") {
      contentType = "application/pdf";
    } else if (ext === ".doc") {
      contentType = "application/msword";
    } else if (ext === ".docx") {
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    // Sanitize filename for Content-Disposition header (remove special chars)
    const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('ENOENT')) {
      console.error(`CV file not found on disk for application ${id}:`, errorMsg);
    } else {
      console.error(`Unexpected error reading CV for application ${id}:`, error);
    }
    return NextResponse.json(
      { error: "Failed to download CV file" },
      { status: 500 }
    );
  }
}
