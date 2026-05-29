import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

function isAdminAuthenticated(request: NextRequest): boolean {
  return !!request.cookies.get("auth-token");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Check admin authentication
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

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

    // Extract filename from cvUrl (e.g., "/uploads/filename.pdf" -> "filename.pdf")
    const filename = application.cvUrl.split("/").pop();

    if (!filename) {
      return NextResponse.json(
        { error: "Invalid CV file path" },
        { status: 400 }
      );
    }

    // Build the file path securely
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const filePath = join(uploadsDir, filename);

    // Security: Ensure the resolved path is within the uploads directory
    if (!filePath.startsWith(uploadsDir)) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: "CV file not found on server" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Determine the content type based on file extension
    const ext = filename.toLowerCase().split(".").pop();
    let contentType = "application/octet-stream";

    if (ext === "pdf") {
      contentType = "application/pdf";
    } else if (ext === "doc") {
      contentType = "application/msword";
    } else if (ext === "docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (ext === "txt") {
      contentType = "text/plain";
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${application.cvFilename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
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
