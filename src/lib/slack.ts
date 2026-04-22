import { DesignRequest, Stage } from './types';

const STAGE_COLORS: Record<Stage, string> = {
  'Submitted': '#6366F1',
  'Assigned': '#8B5CF6',
  'In Progress': '#F59E0B',
  'Review': '#3B82F6',
  'Fabrication': '#10B981',
  'Complete': '#22C55E'
};

interface SlackBlock {
  type: string;
  text?: { type: string; text: string; emoji?: boolean };
  elements?: unknown[];
  fields?: { type: string; text: string }[];
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
  await sendSlackNotification({
    text: `New design request: ${request.title}`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'New Design Request', emoji: true }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Title:*\n${request.title}` },
          { type: 'mrkdwn', text: `*Priority:*\n${request.priority}` }
        ]
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Assignee:*\n${request.assignee}` },
          { type: 'mrkdwn', text: `*Created by:*\n${userName}` }
        ]
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Stage: ${request.stage}` }
        ]
      }
    ]
  });
}

export async function notifyStageChange(request: DesignRequest, oldStage: Stage, newStage: Stage, userName: string): Promise<void> {
  const isComplete = newStage === 'Complete';
  const emoji = isComplete ? ':tada:' : ':arrow_forward:';
  
  await sendSlackNotification({
    text: `${emoji} Request moved to ${newStage}: ${request.title}`,
    blocks: [
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Title:*\n${request.title}` },
          { type: 'mrkdwn', text: `*Updated by:*\n${userName}` }
        ]
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `${emoji} *Stage:* ${oldStage} → *${newStage}*` }
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
        text: { type: 'mrkdwn', text: `*${userName}* added a note to *${request.title}*` }
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: note }
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