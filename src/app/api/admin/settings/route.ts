import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { logoVersion, companyName, phone, email, address, city, postalCode, facebookUrl, linkedinUrl, twitterUrl } = body;

    // Validate logoVersion if provided
    // Map "old" -> 1, "new" -> 2, or accept integers directly
    let parsedLogoVersion = undefined;
    if (logoVersion !== undefined) {
      if (logoVersion === "old" || logoVersion === 1) {
        parsedLogoVersion = 1;
      } else if (logoVersion === "new" || logoVersion === 2) {
        parsedLogoVersion = 2;
      } else {
        return NextResponse.json(
          { error: "Invalid logoVersion. Must be 'old' (1) or 'new' (2)" },
          { status: 400 }
        );
      }
    }

    // Build update data - only include provided fields
    const updateData: any = {};
    if (parsedLogoVersion !== undefined) updateData.logoVersion = parsedLogoVersion;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;

    // Ensure we have a siteSettings record to update
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      settings = await prisma.siteSettings.create({
        data: {
          companyName: "NTS Ltd",
          phone: "01482 838080",
          email: "info@nt.services",
          logoVersion: 1,
          ...updateData,
        },
      });
      return NextResponse.json(settings);
    }

    // Update existing settings
    settings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data: updateData,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
