import { WebClient } from '@slack/web-api';
import type { KnownBlock } from '@slack/types';
import type { SendMessageInput } from '../schemas/input.js';

export interface SlackMessageResult {
  success: boolean;
  ts: string;
}

export const sendSlackMessage = async (
  token: string,
  channelId: string,
  input: SendMessageInput
): Promise<SlackMessageResult> => {
  const client = new WebClient(token);

  try {
    let result;
    
    if (input.message !== undefined) {
      result = await client.chat.postMessage({
        channel: channelId,
        text: input.message,
      });
    } else if (input.blocks !== undefined) {
      result = await client.chat.postMessage({
        channel: channelId,
        blocks: input.blocks as KnownBlock[],
      });
    } else {
      throw new Error('No message or blocks provided');
    }

    if (!result.ok) {
      throw new Error(`Slack API returned ok: false`);
    }

    return {
      success: true,
      ts: result.ts!,
    };
  } catch (error) {
    if (error instanceof Error) {
      // Handle Slack API errors
      if ('data' in error && typeof error.data === 'object' && error.data !== null) {
        const slackError = error.data as { error?: string };
        if (slackError.error !== undefined) {
          throw new Error(`Slack API error: ${slackError.error}`);
        }
      }
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};