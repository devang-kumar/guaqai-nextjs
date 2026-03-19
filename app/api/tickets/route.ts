import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        client_id: session.client_id,
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
      },
      orderBy: { created_at: 'desc' },
    });
    return NextResponse.json(tickets);
  } catch {
    // Demo fallback when DB not connected
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        client_id: session.client_id,
        room_id: body.roomId,
        guest_name: body.guestName,
        category: body.category,
        description: body.description,
        status: body.status ?? 'New',
        priority: body.priority ?? 'Medium',
        assigned_to: body.assignedTo,
      },
    });

    // Trigger n8n webhook if configured
    if (process.env.N8N_TICKET_WEBHOOK_URL) {
      fetch(process.env.N8N_TICKET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket, hotel: session.client_id }),
      }).catch(console.error);
    }

    return NextResponse.json(ticket, { status: 201 });
  } catch (err) {
    console.error('[TICKETS POST]', err);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}
