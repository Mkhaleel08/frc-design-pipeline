import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { SlackUser, Session } from './types';

const AUTH_COOKIE = 'frc-session';
const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-change-in-production');

export async function createToken(session: Session): Promise<string> {
  return new SignJWT({ user: session.user, accessToken: session.accessToken })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const exp = payload.exp! * 1000;
    if (Date.now() > exp) return null;
    return {
      user: payload.user as SlackUser,
      accessToken: payload.accessToken as string,
      expiresAt: exp,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSession(session: Session): Promise<void> {
  const token = await createToken(session);
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export function getSlackAuthUrl(): string {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirectUri = process.env.SLACK_REDIRECT_URI;
  const scopes = ['users:read', 'users.profile:read', 'chat:write'];
  const state = Math.random().toString(36).substring(7);

  // Log for debugging
  console.log('Building auth URL with:');
  console.log('  client_id:', clientId);
  console.log('  redirect_uri:', redirectUri);

  const url = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes.join(',')}&redirect_uri=${encodeURIComponent(redirectUri!)}&state=${state}`;
  console.log('  final URL:', url.substring(0, 200));

  return url;
}
