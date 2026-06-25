import { NextResponse } from 'next/server';
import { verifyAuthWithUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const reviews = await prisma.googleReview.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await verifyAuthWithUser(request);
    const body = await request.json();

    const review = await prisma.googleReview.create({
      data: {
        author: body.author,
        rating: body.rating,
        text: body.text,
        imageUrl: body.imageUrl,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Failed to create review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
