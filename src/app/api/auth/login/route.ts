import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email !== process.env.AUTH_EMAIL || password !== process.env.AUTH_PASSWORD) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  await setSession({
    user: {
      id: email,
      name: email.split('@')[0],
      real_name: email.split('@')[0],
      image_72: '',
      email: email,
    },
    accessToken: 'password-auth',
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return NextResponse.json({ ok: true });
}
