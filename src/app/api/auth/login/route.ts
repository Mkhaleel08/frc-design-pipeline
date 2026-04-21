import { NextResponse } from 'next/server';
import { getSlackAuthUrl } from '@/lib/auth';

export async function GET() {
  const clientId = process.env.SLACK_CLIENT_ID;
  console.log('SLACK_CLIENT_ID:', clientId);
  console.log('SLACK_REDIRECT_URI:', process.env.SLACK_REDIRECT_URI);
  
  if (!clientId) {
    return NextResponse.json({ error: 'SLACK_CLIENT_ID not configured' }, { status: 500 });
  }
  
  const authUrl = getSlackAuthUrl();
  return NextResponse.redirect(authUrl);
}
