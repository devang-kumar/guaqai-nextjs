import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateReviewReply } from '@/app/actions/ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.DATABASE_URL;
  if (!session && !isDemo) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { guestName, rating, comment, hotelName, signature } = await req.json();
    const reply = await generateReviewReply(guestName, rating, comment, hotelName, signature);
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('[AI REVIEW REPLY]', err);
    return NextResponse.json({ error: err.message || 'AI service unavailable' }, { status: 500 });
  }
}
