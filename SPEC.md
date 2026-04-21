# FRC Design Pipeline App - Specification

## Project Overview
- **Project Name:** FRC Design Pipeline
- **Type:** Next.js Kanban webapp with App Router
- **Core Functionality:** Manage design requests through stages with Slack auth, notifications, and persistent storage
- **Target Users:** FRC robotics team members with Slack accounts

## Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS
- Upstash Redis (Vercel KV replacement) for persistence
- Slack OAuth for authentication
- Slack Incoming Webhooks for notifications
- Vercel deployment

## UI/UX Specification

### Layout Structure
- **Sticky Header** (64px): Logo, view toggle, user avatar/logout
- **Stats Bar** (48px): Count per stage
- **Main Content**: Kanban board or Activity Log view
- **Modals**: Request detail, create form

### Visual Design
- **Background:** #0D0D0D
- **Surface:** #1A1A1A
- **Surface Elevated:** #242424
- **Border:** #333333
- **Text Primary:** #FFFFFF
- **Text Secondary:** #A0A0A0
- **Accent:** #22C55E (green)

### Stage Colors
- Submitted: #6366F1 (Indigo)
- Assigned: #8B5CF6 (Violet)
- In Progress: #F59E0B (Amber)
- Review: #3B82F6 (Blue)
- Fabrication: #10B981 (Emerald)
- Complete: #22C55E (Green)

### Priority Colors
- High: #EF4444
- Medium: #F59E0B
- Low: #22C55E

## Data Model

```typescript
interface DesignRequest {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  role: 'Designer' | 'Fabrication' | 'Lead';
  attachments: string;
  notes: string;
  stage: Stage;
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  createdBy: string; // Slack user ID
}

interface Activity {
  id: string;
  type: 'created' | 'stage_change' | 'note_added';
  message: string;
  timestamp: string;
  userId: string;
}

type Stage = 'Submitted' | 'Assigned' | 'In Progress' | 'Review' | 'Fabrication' | 'Complete';
```

## API Routes

| Route | Method | Description |
|-------|--------|------------|
| /api/auth/login | GET | Slack OAuth login redirect |
| /api/auth/callback | GET | Slack OAuth callback |
| /api/auth/logout | POST | Clear session |
| /api/auth/me | GET | Get current user |
| /api/requests | GET | List all requests |
| /api/requests | POST | Create request |
| /api/requests/[id] | GET | Get request |
| /api/requests/[id] | PUT | Update request |
| /api/requests/[id] | DELETE | Delete request |
| /api/requests/[id]/advance | POST | Advance stage |
| /api/requests/[id]/note | POST | Add note |

## Environment Variables

```
SLACK_CLIENT_ID
SLACK_CLIENT_SECRET
SLACK_SIGNING_SECRET
SLACK_REDIRECT_URI
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
SLACK_WEBHOOK_URL
AUTH_SECRET
```

## Slack Notifications

Events that trigger notifications:
1. New request created
2. Stage advanced
3. Request completed (reached Complete stage)
4. Note added

## Security

- All /api/* routes require valid Slack session
- Session stored as HTTP-only cookie
- Server-side input sanitization
- Environment variables for all secrets
- Rate limiting on API routes

## Acceptance Criteria

1. ✓ User can sign in with Slack
2. ✓ User sees their Slack avatar/name after login
3. ✓ Can create new design requests
4. ✓ Requests persist in Upstash Redis
5. ✓ Kanban board shows all requests by stage
6. ✓ Can click card to see details
7. ✓ Can advance stage
8. ✓ Slack notifications sent on events
9. ✓ Activity log shows all events
10. ✓ Stats bar shows counts
11. ✓ Data persists server-side
12. ✓ Unauthenticated users redirected to login