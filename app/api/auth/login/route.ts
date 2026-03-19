import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, clientId } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Demo mode: allow hardcoded credentials when DB is not set up
    if (process.env.DEMO_MODE === 'true' || !process.env.DATABASE_URL?.includes('postgresql')) {
      const demoUsers: Record<string, { role: 'admin' | 'staff'; name: string }> = {
        'admin@hotel.com': { role: 'admin', name: 'Admin User' },
        'frontdesk@hotel.com': { role: 'staff', name: 'Front Desk' },
      };
      const demoUser = demoUsers[email];
      if (demoUser && password === 'demo123') {
        const token = await signToken({
          id: 'demo-1',
          email,
          name: demoUser.name,
          role: demoUser.role,
          permissions: demoUser.role === 'admin' ? ['all'] : ['dashboard', 'inbox', 'tickets'],
          client_id: 1,
        });
        const res = NextResponse.json({ success: true, role: demoUser.role });
        res.cookies.set('guaqai_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
        return res;
      }
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'admin' | 'staff',
      permissions: user.permissions,
      client_id: user.client_id,
    });

    const res = NextResponse.json({ success: true, role: user.role });
    res.cookies.set('guaqai_token', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 7, path: '/' });
    return res;
  } catch (err) {
    console.error('[AUTH LOGIN]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
