import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { hasPermission, isAdministrator, UserRole } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and get user
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check permission - only administrators can list users
    const userRole = authResult.user.role as UserRole;
    if (!isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to view users" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
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

    // Check permission - only administrators can create users
    const userRole = authResult.user.role as UserRole;
    if (!isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can create users" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { username, password, role } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    const validRoles = ['administrator', 'editor', 'viewer'];
    const newUserRole = role && validRoles.includes(role) ? role : 'editor';

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: newUserRole,
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
