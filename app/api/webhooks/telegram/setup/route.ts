import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/webhooks/telegram/setup?secret=YOUR_ADMIN_SECRET
// Call this once after deploying to register your webhook URL with Telegram
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL;

  if (!token) return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 400 });
  if (!appUrl) return NextResponse.json({ error: 'NEXTAUTH_URL not set' }, { status: 400 });

  const webhookUrl = `${appUrl.replace(/\/$/, '')}/api/webhooks/telegram`;

  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl }),
  });

  const data = await res.json();
  return NextResponse.json({ webhookUrl, telegram: data });
}
