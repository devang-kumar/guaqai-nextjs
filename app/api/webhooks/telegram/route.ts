import { NextRequest, NextResponse } from 'next/server';
import { generateBotResponse } from '@/app/actions/ai';

export const dynamic = 'force-dynamic';

// In-memory session store (replace with Redis/DB in production)
const sessions: Record<string, { stage: string; history: string[] }> = {};

async function sendTelegramMessage(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body?.message;

    if (!message?.text || !message?.chat?.id) {
      return NextResponse.json({ ok: true });
    }

    const chatId: number = message.chat.id;
    const userText: string = message.text;
    const sessionKey = chatId.toString();

    // Init session
    if (!sessions[sessionKey]) {
      sessions[sessionKey] = { stage: 'CHECK_IN', history: [] };
    }

    const session = sessions[sessionKey];
    session.history.push(`User: ${userText}`);

    // Stage transitions
    const lower = userText.toLowerCase();
    if (lower.includes('checkout') || lower.includes('leaving')) {
      session.stage = 'CHECKOUT';
    } else if (lower.includes('pulse') || lower.includes('how am i')) {
      session.stage = 'PULSE_CHECK';
    }

    const hotelName = process.env.HOTEL_NAME || 'Country Inn & Suites';
    const signature = process.env.HOTEL_SIGNATURE || 'Hotel Management';

    const reply = await generateBotResponse(
      userText,
      session.stage,
      hotelName,
      '', // knowledge base — wire to DB/file in production
      ''  // affiliate contacts
    );

    session.history.push(`Bot: ${reply}`);

    // Keep history bounded
    if (session.history.length > 20) session.history = session.history.slice(-20);

    await sendTelegramMessage(chatId, reply);

    // Optionally store message in DB
    if (process.env.DATABASE_URL && process.env.DEMO_MODE !== 'true') {
      try {
        const { prisma } = await import('@/lib/prisma');
        await prisma.whatsAppLog.create({
          data: {
            client_id: 1,
            phone: chatId.toString(),
            direction: 'IN',
            message_content: userText,
          },
        });
        await prisma.whatsAppLog.create({
          data: {
            client_id: 1,
            phone: chatId.toString(),
            direction: 'OUT',
            message_content: reply,
          },
        });
      } catch (e) {
        console.error('[TELEGRAM DB LOG]', e);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[TELEGRAM WEBHOOK]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
