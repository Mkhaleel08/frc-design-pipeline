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

  // Use OAuth v2 access endpoint
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

  // Try to get user info from the OAuth response and team.info
  let userId = tokenData.authed_user?.id || '';
  let userName = 'Team Member';
  let userEmail = '';
  let userImage = '';
  
  // Try to get user info from authed_user in response
  if (tokenData.authed_user) {
    userId = tokenData.authed_user.id || userId;
  }
  
  // Get team info to at least have some data
  if (userId) {
    try {
      const profileRes = await fetch('https://slack.com/api/users.profile.get?user=' + userId + '&token=' + accessToken);
      const profileData = await profileRes.json();
      console.log('User profile response:', JSON.stringify(profileData));
      
      if (profileData.ok && profileData.profile) {
        userName = profileData.profile.real_name || profileData.profile.display_name || userName;
        userEmail = profileData.profile.email || '';
        userImage = profileData.profile.image_72 || '';
      }
    } catch (e) {
      console.error('Failed to get user profile:', e);
    }
  }
  
  const user = {
    id: userId || 'unknown',
    name: userName,
    real_name: userName,
    image_72: userImage,
    email: userEmail,
  };

  await setSession({
    user,
    accessToken: accessToken,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  return NextResponse.redirect(new URL('/', request.url));
}