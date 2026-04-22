import { DesignRequest, Stage } from './types';

const STAGE_COLORS: Record<Stage, string> = {
  'Submitted': '#6366F1',
  'Assigned': '#8B5CF6',
  'In Progress': '#F59E0B',
  'Review': '#3B82F6',
  'Fabrication': '#10B981',
  'Complete': '#22C55E'
};

const APP_URL = process.env.APP_URL || 'https://frc-design-pipeline.vercel.app';

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: unknown[];
  fields?: { type: string; text: string }[];
  accessory?: unknown;
}

interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
}

export async function sendSlackNotification(message: SlackMessage): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('No SLACK_WEBHOOK_URL configured, skipping notification');
    return;
  }

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
}

export async function notifyNewRequest(request: DesignRequest, userName: string): Promise<void> {
  const priorityEmoji = request.priority === 'High' ? ':red_circle:' : request.priority === 'Medium' ? ':large_yellow_circle:' : ':green_circle:';
  
  await sendSlackNotification({
    text: `New design request: ${request.title}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'New Design Request', emoji: true }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${request.title}*` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `${priorityEmoji} *Priority:*\n${request.priority}` },
          { type: 'mrkdwn', text: `:clipboard: *Stage:*\n${request.stage}` },
          { type: 'mrkdwn', text: `:bust_in_silhouette: *Assignee:*\n${request.assignee || 'Unassigned'}` },
          { type: 'mrkdwn', text: `:pencil2: *Created by:*\n${userName}` }
        ]
      },
      { type: 'divider' },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Created: ${new Date(request.createdAt).toLocaleString()}` }
        ]
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Request', emoji: true },
            url: `${APP_URL}/?request=${request.id}`,
            style: 'primary'
          }
        ]
      }
    ]
  });
}

export async function notifyStageChange(request: DesignRequest, oldStage: Stage, newStage: Stage, userName: string): Promise<void> {
  const isComplete = newStage === 'Complete';
  const emoji = isComplete ? ':tada:' : ':arrow_forward:';
  const headerEmoji = isComplete ? ':party: Request Completed!' : ':arrows_clockwise: Stage Changed';
  
  await sendSlackNotification({
    text: `${emoji} Request moved to ${newStage}: ${request.title}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `${emoji} *Request moved to ${newStage}*${isComplete ? ' :tada:' : ''}` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${request.title}*` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `:arrow_left: *Old Stage:*\n${oldStage}` },
          { type: 'mrkdwn', text: `:arrow_right: *New Stage:*\n${newStage}` },
          { type: 'mrkdwn', text: `:bust_in_silhouette: *Updated by:*\n${userName}` }
        ]
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Updated: ${new Date().toLocaleString()}` }
        ]
      }
    ]
  });
}

export async function notifyNoteAdded(request: DesignRequest, note: string, userName: string): Promise<void> {
  await sendSlackNotification({
    text: `Note added to: ${request.title}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `:memo: *Note added to ${request.title}*` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `>${note.replace(/\n/g, '\n>')}` }
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `:bust_in_silhouette: Added by *${userName}* at ${new Date().toLocaleString()}` }
        ]
      }
    ]
  });
}

export async function notifyRequestDeleted(request: DesignRequest, userName: string): Promise<void> {
  await sendSlackNotification({
    text: `Request deleted: ${request.title}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${request.title}* was deleted by *${userName}*` }
      }
    ]
  });
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export async function sendSlackDM(userId: string, message: string): Promise<void> {
  const botToken = process.env.SLACK_BOT_TOKEN;
  if (!botToken) {
    console.log('No SLACK_BOT_TOKEN configured, skipping DM');
    return;
  }

  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${botToken}`
    },
    body: JSON.stringify({
      channel: userId,
      text: message,
    }),
  });
}

export async function notifyAssignment(request: DesignRequest, assignedToName: string): Promise<void> {
  await sendSlackNotification({
    text: `Request assigned: ${request.title}`,
    blocks: [
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*${request.title}* has been assigned to *${assignedToName}*` }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Priority:*\n${request.priority}` },
          { type: 'mrkdwn', text: `*Stage:*\n${request.stage}` }
        ]
      }
    ]
  });
}