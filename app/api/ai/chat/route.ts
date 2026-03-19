import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateBotResponse } from '@/app/actions/ai';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const isDemo = process.env.DEMO_MODE === 'true' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !process.env.DATABASE_URL;
  if (!session && !isDemo) {
    // If it's a demo deployment and no DB is strictly configured for auth, we bypass the 401
    // Otherwise return 401
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  } catch (err: any) {
    console.error('[AI CHAT]', err);
    // Return a graceful reply instead of a 500 so the UI doesn't break
    return NextResponse.json({ reply: 'I am unable to process your request right now. Please contact the front desk for assistance.' });
  }
}
