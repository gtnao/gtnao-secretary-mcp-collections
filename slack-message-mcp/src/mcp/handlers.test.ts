import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleListTools, handleCallTool } from './handlers.js';
import type { ListToolsRequest, CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { sendMessageSchema } from '../schemas/input.js';

// Mock dependencies
vi.mock('../config/env', () => ({
  getConfig: vi.fn(() => ({
    slackBotToken: 'xoxb-test-token',
    slackChannelId: 'C1234567890',
  })),
}));

vi.mock('../slack/client', () => ({
  sendSlackMessage: vi.fn(() => Promise.resolve({
    success: true,
    ts: '1234567890.123456',
  })),
}));

describe('MCP Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleListTools', () => {
    it('should return send_message tool', async () => {
      const request: ListToolsRequest = {
        method: 'tools/list',
      };

      const response = await handleListTools(request);

      expect(response).toEqual({
        tools: [
          {
            name: 'send_message',
            title: 'Send Slack Message',
            description: 'Send a message to the configured Slack channel',
            inputSchema: zodToJsonSchema(sendMessageSchema),
          },
        ],
      });
    });
  });

  describe('handleCallTool', () => {
    it('should send text message successfully', async () => {
      const { sendSlackMessage } = await import('../slack/client.js');
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'send_message',
          arguments: {
            message: 'Hello from MCP!',
          },
        },
      };

      const response = await handleCallTool(request);

      expect(sendSlackMessage).toHaveBeenCalledWith(
        'xoxb-test-token',
        'C1234567890',
        { message: 'Hello from MCP!' }
      );

      expect(response).toEqual({
        content: [{
          type: 'text',
          text: 'Message sent successfully! Timestamp: 1234567890.123456',
        }],
      });
    });

    it('should send blocks message successfully', async () => {
      const { sendSlackMessage } = await import('../slack/client.js');
      const blocks = [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hello *MCP*!',
          },
        },
      ];

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'send_message',
          arguments: {
            blocks,
          },
        },
      };

      const response = await handleCallTool(request);

      expect(sendSlackMessage).toHaveBeenCalledWith(
        'xoxb-test-token',
        'C1234567890',
        { blocks }
      );

      expect(response).toEqual({
        content: [{
          type: 'text',
          text: 'Message sent successfully! Timestamp: 1234567890.123456',
        }],
      });
    });

    it('should handle unknown tool', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'unknown_tool',
          arguments: {},
        },
      };

      await expect(handleCallTool(request)).rejects.toThrow('Unknown tool: unknown_tool');
    });

    it('should handle invalid arguments', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'send_message',
          arguments: {}, // No message or blocks
        },
      };

      await expect(handleCallTool(request)).rejects.toThrow('Either message or blocks must be provided');
    });

    it('should handle Slack API errors', async () => {
      const { sendSlackMessage } = await import('../slack/client.js');
      vi.mocked(sendSlackMessage).mockRejectedValueOnce(
        new Error('Slack API error: channel_not_found')
      );

      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'send_message',
          arguments: {
            message: 'Test message',
          },
        },
      };

      await expect(handleCallTool(request)).rejects.toThrow(
        'Failed to send Slack message: Slack API error: channel_not_found'
      );
    });
  });
});