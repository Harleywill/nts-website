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
          email: "info@ntsltd.com",
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
    const { companyName, phone, email, address, city, postalCode, facebookUrl, linkedinUrl, twitterUrl } = body;

    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          companyName: companyName || "NTS Ltd",
          phone: phone || "01482 838080",
          email: email || "info@ntsltd.com",
          address: address || null,
          city: city || null,
          postalCode: postalCode || null,
          facebookUrl: facebookUrl || null,
          linkedinUrl: linkedinUrl || null,
          twitterUrl: twitterUrl || null,
        },
      });
    } else {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          companyName: companyName || settings.companyName,
          phone: phone || settings.phone,
          email: email || settings.email,
          address: address || settings.address,
          city: city || settings.city,
          postalCode: postalCode || settings.postalCode,
          facebookUrl: facebookUrl || settings.facebookUrl,
          linkedinUrl: linkedinUrl || settings.linkedinUrl,
          twitterUrl: twitterUrl || settings.twitterUrl,
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
