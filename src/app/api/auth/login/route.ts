import { NextResponse } from 'next/server';
import { getSlackAuthUrl } from '@/lib/auth';

export async function GET() {
  const authUrl = getSlackAuthUrl();
  return NextResponse.redirect(authUrl);
}
