import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { verifyAuthWithUser } from "@/lib/auth-middleware";
import { isAdministrator, UserRole } from "@/lib/admin/permissions";

export async function GET(request: NextRequest) {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName: "NTS Ltd",
          phone: "01482 838080",
          email: "info@nt.services",
          address: "Unit F2 Rotterdam Park",
          city: "Hull",
          postalCode: "HU7 0AN",
          logoVersion: 1,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and check authorization
    const authResult = await verifyAuthWithUser(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only administrators can modify settings
    const userRole = authResult.user.role as UserRole;
    if (!isAdministrator(userRole)) {
      return NextResponse.json(
        { error: "Forbidden: Only administrators can modify settings" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Get or create first settings record
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName: "NTS Ltd",
          phone: "01482 838080",
          email: "info@nt.services",
        },
      });
    }

    // Update settings (only update fields that are provided)
    const updated = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        ...(body.phone !== undefined && { phone: body.phone || settings.phone }),
        ...(body.email !== undefined && { email: body.email || settings.email }),
        ...(body.address !== undefined && { address: body.address || settings.address }),
      },
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName,
      phone,
      email,
      address,
      city,
      postalCode,
      facebookUrl,
      linkedinUrl,
      twitterUrl,
      logoVersion
    } = body;

    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName: companyName || "NTS Ltd",
          phone: phone || "01482 838080",
          email: email || "info@nt.services",
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          facebookUrl: facebookUrl || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
          logoVersion: logoVersion || 1,
        },
      });
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          companyName: companyName || settings.companyName,
          phone: phone || settings.phone,
          email: email || settings.email,
          address: address !== undefined ? address : settings.address,
          city: city !== undefined ? city : settings.city,
          postalCode: postalCode !== undefined ? postalCode : settings.postalCode,
          facebookUrl: facebookUrl !== undefined ? facebookUrl : settings.facebookUrl,
          linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : settings.linkedinUrl,
          twitterUrl: twitterUrl !== undefined ? twitterUrl : settings.twitterUrl,
          logoVersion: logoVersion !== undefined ? logoVersion : settings.logoVersion,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
