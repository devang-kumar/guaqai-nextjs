import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  try {
    const ticket = await prisma.ticket.update({
      where: { id, client_id: session.client_id },
      data: {
        ...(body.status ? { status: body.status } : {}),
        ...(body.assignedTo !== undefined ? { assigned_to: body.assignedTo } : {}),
        ...(body.priority ? { priority: body.priority } : {}),
      },
    });
    return NextResponse.json(ticket);
  } catch (err) {
    console.error('[TICKET PATCH]', err);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.ticket.delete({ where: { id, client_id: session.client_id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[TICKET DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
