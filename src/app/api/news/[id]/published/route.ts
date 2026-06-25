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

    const newsItem = await prisma.newsItem.update({
      where: { id: parseInt(params.id) },
      data: { published },
    });

    return NextResponse.json(newsItem);
  } catch (error) {
    console.error('Failed to update news item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
