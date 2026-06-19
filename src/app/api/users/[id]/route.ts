import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { isAdministrator, UserRole } from "@/lib/admin/permissions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify JWT token from cookie or auth header
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission - only administrators can view other users
    const { id } = await params;
    const userId = parseInt(id);
    const userRole = authResult.user.role as UserRole;
    if (authResult.user.userId !== userId && !isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: You can only view your own profile" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = parseInt(id);
    const userRole = authResult.user.role as UserRole;

    // Users can only update their own password, admins can update anything
    if (authResult.user.userId !== userId && !isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: You can only update your own profile" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { password, role } = body;

    // Check if trying to change role
    if (role !== undefined) {
      // Only administrators can change roles
      if (!isAdministrator(userRole)) {
        return NextResponse.json(
          { error: "Forbidden: Only administrators can change user roles" },
          { status: 403 }
        );
      }

      // Validate role
      const validRoles = ['administrator', 'editor', 'viewer'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const updateData: any = {
      password: hashedPassword,
    };

    // Only admins can update role
    if (role !== undefined && isAdministrator(userRole)) {
      updateData.role = role;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission - only administrators can delete users
    const userRole = authResult.user.role as UserRole;
    if (!isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can delete users" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = parseInt(id);

    // Prevent deleting yourself
    if (authResult.user.userId === userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists first
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
