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
    if (logoVersion && !["old", "new"].includes(logoVersion)) {
      return NextResponse.json(
        { error: "Invalid logoVersion. Must be 'old' or 'new'" },
        { status: 400 }
      );
    }

    // Build update data - only include provided fields
    const updateData: any = {};
    if (logoVersion !== undefined) updateData.logoVersion = logoVersion;
    if (companyName !== undefined) updateData.companyName = companyName;
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (postalCode !== undefined) updateData.postalCode = postalCode;
    if (facebookUrl !== undefined) updateData.facebookUrl = facebookUrl;
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (twitterUrl !== undefined) updateData.twitterUrl = twitterUrl;

    const settings = await prisma.siteSettings.update({
      where: { id: 1 },
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
