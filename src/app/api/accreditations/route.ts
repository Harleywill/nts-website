import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const ALL_ACCREDITATIONS = [
  { name: "Honeywell", slug: "honeywell" },
  { name: "Toshiba", slug: "toshiba" },
  { name: "FGR", slug: "fgr" },
  { name: "OFTEC", slug: "oftec" },
  { name: "Mitsubishi", slug: "mitsubishi" },
  { name: "Magic Box", slug: "magic-box" },
  { name: "F-Gas", slug: "fgas" },
  { name: "Cylon", slug: "cylon" },
  { name: "CHAS", slug: "chas" },
  { name: "Gas Safe", slug: "gas-safe" },
  { name: "APHC", slug: "aphc" },
  { name: "Alcumus", slug: "alcumus" },
];

async function ensureSeeded() {
  const count = await prisma.accreditation.count();
  if (count === 0) {
    await prisma.accreditation.createMany({
      data: ALL_ACCREDITATIONS.map((a, i) => ({ ...a, enabled: true, order: i })),
    });
  }
}

export async function GET() {
  try {
    await ensureSeeded();
    const accreditations = await prisma.accreditation.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(accreditations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch accreditations" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { updates } = body as { updates: { slug: string; enabled: boolean; order: number }[] };

    await Promise.all(
      updates.map((u) =>
        prisma.accreditation.update({
          where: { slug: u.slug },
          data: { enabled: u.enabled, order: u.order },
        })
      )
    );

    const accreditations = await prisma.accreditation.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(accreditations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update accreditations" }, { status: 500 });
  }
}
