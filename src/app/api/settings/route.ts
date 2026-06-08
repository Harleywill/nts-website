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
