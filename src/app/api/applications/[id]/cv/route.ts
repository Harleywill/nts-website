import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";
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

    if (!application.cvUrl || !application.cvFilename) {
      return NextResponse.json(
        { error: "No CV file associated with this application" },
        { status: 404 }
      );
    }

    // Extract filename using path.basename
    const fileName = path.basename(application.cvUrl);

    // Build the file path
    const filePath = join(process.cwd(), "public", "uploads", "cv", fileName);

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine the content type based on file extension
    const ext = fileName.toLowerCase().split(".").pop();
    let contentType = "application/octet-stream";

    if (ext === "pdf") {
      contentType = "application/pdf";
    } else if (ext === "doc" || ext === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error downloading CV:", error);
    return NextResponse.json(
      { error: "Failed to download CV file" },
      { status: 500 }
    );
  }
}
