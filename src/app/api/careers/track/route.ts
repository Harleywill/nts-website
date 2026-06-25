import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get('ref')?.trim().toUpperCase();
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!ref || !email) {
    return NextResponse.json({ error: 'Reference and email are required.' }, { status: 400 });
  }

  const application = await prisma.application.findFirst({
    where: { reference: ref },
    select: {
      reference: true,
      fullName: true,
      email: true,
      status: true,
      submittedAt: true,
      updatedAt: true,
      job: { select: { title: true, location: true, department: true } },
    },
  });

  if (!application || application.email.toLowerCase() !== email) {
    return NextResponse.json(
      { error: 'No application found with those details. Please check your reference number and email address.' },
      { status: 404 }
    );
  }

  // Don't expose the stored email in the response
  const { email: _email, ...safe } = application;
  return NextResponse.json(safe);
}
