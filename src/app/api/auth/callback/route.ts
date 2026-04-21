import { NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  const tokenResponse = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      code,
      redirect_uri: redirectUri!,
    }),
  });

  const tokenData = await tokenResponse.json();
  
  if (!tokenData.ok || !tokenData.access_token) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  const userResponse = await fetch('https://slack.com/api/users.profile.get', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData = await userResponse.json();
  
  const user = {
    id: userData.profile?.id || tokenData.authed_user?.id,
    name: userData.profile?.real_name || 'Team Member',
    real_name: userData.profile?.real_name || 'Team Member',
    image_72: userData.profile?.image_72 || '',
    email: userData.profile?.email || '',
  };

  await setSession({
    user,
    accessToken: tokenData.access_token,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return NextResponse.redirect(new URL('/', request.url));
}