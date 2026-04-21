# Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at vercel.com
2. **Slack Workspace** - With admin access to create apps

## Step 1: Set Up Slack App

1. Go to https://api.slack.com/apps
2. Create a new Slack App (From scratch)
3. Add OAuth scopes:
   - `users:read`
   - `users.profile:read`
4. Install app to workspace
5. Save the OAuth token (Bot User OAuth Token starts with `xoxb-`)

## Step 2: Create Slack Incoming Webhook

1. In your Slack App settings, go to "Incoming Webhooks"
2. Activate incoming webhooks
3. Add new webhook to desired channel
4. Copy the webhook URL

## Step 3: Set Up Upstash Redis (Vercel Integration)

1. Go to Vercel Dashboard
2. Navigate to your project > Settings > Integrations
3. Search for "Upstash Redis" and install
4. Copy the REST_URL and REST_TOKEN

## Step 4: Deploy to Vercel

1. Push code to GitHub (already done)
2. Import project in Vercel
3. Add Environment Variables in Vercel project settings:

```
SLACK_CLIENT_ID=your_slack_client_id
SLACK_CLIENT_SECRET=your_slack_client_secret
SLACK_SIGNING_SECRET=your_slack_signing_secret
SLACK_REDIRECT_URI=https://your-domain.vercel.app/api/auth/callback
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
SLACK_WEBHOOK_URL=your_slack_webhook_url
AUTH_SECRET=your_random_32_char_secret
```

4. Deploy!

## Step 5: Update Slack OAuth Redirect

1. After first deploy, copy your Vercel URL
2. Go to Slack App OAuth Redirect URLs
3. Add: `https://your-domain.vercel.app/api/auth/callback`

## Troubleshooting

- **Auth fails**: Ensure redirect URI matches in both Vercel env and Slack app settings
- **Redis errors**: Check Upstash credentials are correct
- **Slack notifications not working**: Verify webhook URL is valid

## Local Development

Copy `.env.local.example` to `.env.local` and fill in values, then run `npm run dev`.