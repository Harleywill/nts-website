import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// Next.js self-hosted with `next start` builds its knowledge of the public/
// directory once at process boot, so files uploaded at runtime (after boot)
// 404 indefinitely - even on retry, even with no-cache headers - until the
// next restart. This route serves runtime-uploaded files by reading them
// fresh from disk on every request, bypassing that static-asset resolution
// entirely. The upload routes point new files at this route; anything
// still referencing a raw /uploads/... path predates this fix.
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Reject any segment that isn't a plain filename/directory component -
  // blocks ".." traversal and absolute-path tricks outright.
  if (!segments.length || segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), "public", "uploads", ...segments);

  try {
    const stats = await stat(filePath);
    if (!stats.isFile()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Safe to cache hard: uploaded filenames are timestamp+random, so a
        // given URL's content never changes once created.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    console.error("Error serving upload:", error);
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 });
  }
}
