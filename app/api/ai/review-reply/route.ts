import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateReviewReply } from '@/app/actions/ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { guestName, rating, comment, hotelName, signature } = await req.json();
    const reply = await generateReviewReply(guestName, rating, comment, hotelName, signature);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[AI REVIEW REPLY]', err);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
