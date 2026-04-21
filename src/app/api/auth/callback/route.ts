import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    console.log('Error or no code:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = process.env.SLACK_REDIRECT_URI;

  // Use OpenID Connect token endpoint
  const tokenResponse = await fetch('https://slack.com/api/openid.connect.token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      code,
      redirect_uri: redirectUri!,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenResponse.json();
  
  console.log('OpenID token response:', JSON.stringify(tokenData));
  
  if (!tokenData.ok) {
    console.error('OpenID token error:', tokenData);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  const accessToken = tokenData.access_token;
  const idToken = tokenData.id_token;
  
  if (!accessToken || !idToken) {
    console.error('Missing tokens:', tokenData);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }

  // Use OpenID Connect userInfo endpoint
  const userResponse = await fetch('https://slack.com/api/openid.connect.userInfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userData = await userResponse.json();
  
  console.log('OpenID userInfo response:', JSON.stringify(userData));
  
  // Extract user info from OpenID response
  const user = {
    id: userData.sub || 'unknown',
    name: userData.name || 'Team Member',
    real_name: userData.name || 'Team Member',
    image_72: userData.picture || '',
    email: userData.email || '',
  };

  await setSession({
    user,
    accessToken: accessToken,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return NextResponse.redirect(new URL('/', request.url));
}