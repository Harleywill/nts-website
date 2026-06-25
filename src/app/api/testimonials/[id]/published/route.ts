import { NextResponse } from 'next/server';
import { verifyAuthWithUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await verifyAuthWithUser(request);
    const { published } = await request.json();

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(params.id) },
      data: { published },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Failed to update testimonial:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
