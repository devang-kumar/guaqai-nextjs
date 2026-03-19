import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateBotResponse } from '@/app/actions/ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { message, stage, hotelName, knowledgeBase, affiliateContacts } = await req.json();

    const reply = await generateBotResponse(
      message,
      stage ?? 'CHECK_IN',
      hotelName ?? 'Country Inn & Suites',
      knowledgeBase ?? '',
      affiliateContacts ?? ''
    );

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[AI CHAT]', err);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
