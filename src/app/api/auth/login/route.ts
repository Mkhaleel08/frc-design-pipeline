import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Redis } from '@upstash/redis';
import { getUserByEmail } from '@/lib/db';
import { setSession, getClientIp } from '@/lib/auth';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const BLOCK_MINUTES = 15;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate_limit:login:${ip}`;
  const attempts = await redis.get<number>(key) || 0;
  return attempts >= MAX_ATTEMPTS;
}

async function recordFailedAttempt(ip: string) {
  const key = `rate_limit:login:${ip}`;
  const current = await redis.get<number>(key) || 0;
  await redis.set(key, current + 1, { ex: WINDOW_MINUTES * 60 });
}

async function resetFailedAttempts(ip: string) {
  const key = `rate_limit:login:${ip}`;
  await redis.del(key);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    
    // Check rate limit
    const isRateLimited = await checkRateLimit(ip);
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user in database
    const user = await getUserByEmail(email);
    
    if (!user) {
      await recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      await recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Reset rate limit on successful login
    await resetFailedAttempts(ip);

    // Create session
    await setSession({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        slackMemberId: user.slackMemberId,
      },
      accessToken: 'password-auth',
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ 
      ok: true, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}