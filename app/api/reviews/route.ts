import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const platform = searchParams.get('platform');

  try {
    const reviews = await prisma.review.findMany({
      where: {
        client_id: session.client_id,
        ...(status ? { status } : {}),
        ...(platform ? { platform } : {}),
      },
      orderBy: { review_date: 'desc' },
    });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json([]);
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, response, status } = await req.json();
    const review = await prisma.review.update({
      where: { id, client_id: session.client_id },
      data: { response, status: status ?? 'Replied' },
    });
    return NextResponse.json(review);
  } catch (err) {
    console.error('[REVIEW PATCH]', err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
