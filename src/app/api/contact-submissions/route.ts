import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const submissions = await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { read } = body;

    const updated = await prisma.contactSubmission.update({
      where: { id: parseInt(id) },
      data: { read },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing submission ID" },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // P2025 = record not found, which is fine for delete (idempotent)
    if (error?.code === "P2025") {
      return NextResponse.json({ success: true });
    }

    console.error("Error deleting submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500 }
    );
  }
}
