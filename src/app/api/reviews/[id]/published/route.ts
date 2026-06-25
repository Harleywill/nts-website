import { NextResponse } from 'next/server';
import { verifyAuthWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAuthWithUser(request);
    const { published } = await request.json();

    const review = await prisma.googleReview.update({
      where: { id: parseInt(params.id) },
      data: { published },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to update review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
