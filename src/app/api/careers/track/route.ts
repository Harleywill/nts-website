import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('ref')?.trim().toUpperCase();
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!reference || !email) {
    return NextResponse.json({ error: 'Reference and email are required' }, { status: 400 });
  }

  const application = await prisma.application.findFirst({
    where: {
      reference,
      email,
    },
    include: {
      job: { select: { title: true, location: true, department: true } },
    },
  });

  if (!application) {
    return NextResponse.json({ error: 'No application found with those details' }, { status: 404 });
  }

  // Return only non-sensitive fields
  return NextResponse.json({
    reference: application.reference,
    fullName: application.fullName,
    status: application.status,
    submittedAt: application.submittedAt,
    updatedAt: application.updatedAt,
    job: application.job,
  });
}
