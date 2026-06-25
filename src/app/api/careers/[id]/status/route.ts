import { NextResponse } from 'next/server';
import { verifyAuthWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAuthWithUser(request);
    const { status } = await request.json();

    if (!['DRAFT', 'PUBLISHED', 'CLOSED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const job = await prisma.job.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.error('Failed to update career status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
