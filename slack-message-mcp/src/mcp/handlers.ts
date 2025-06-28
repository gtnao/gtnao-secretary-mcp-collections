import type { 
  ListToolsRequest, 
  CallToolRequest,
  ListToolsResult,
  CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { 
  ErrorCode,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getConfig } from '../config/env.js';
import { sendSlackMessage } from '../slack/client.js';
import { sendMessageSchema } from '../schemas/input.js';

export const handleListTools = (_request: ListToolsRequest): Promise<ListToolsResult> => {
  return Promise.resolve({
    tools: [
      {
        name: 'send_message',
        title: 'Send Slack Message',
        description: 'Send a message to the configured Slack channel',
        inputSchema: zodToJsonSchema(sendMessageSchema) as { 
          type: 'object'; 
          [x: string]: unknown;
        },
      },
    ],
  });
};

export const handleCallTool = async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name, arguments: args } = request.params;

  if (name !== 'send_message') {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Unknown tool: ${name}`
    );
  }

  try {
    // Validate input
    const validatedInput = sendMessageSchema.parse(args);
    
    // Get config
    const config = getConfig();
    
    // Send message
    const result = await sendSlackMessage(
      config.slackBotToken,
      config.slackChannelId,
      validatedInput
    );

    return {
      content: [
        {
          type: 'text',
          text: `Message sent successfully! Timestamp: ${result.ts}`,
        },
      ],
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(
        ErrorCode.InvalidParams,
        error.errors[0]?.message ?? 'Invalid input'
      );
    }
    
    if (error instanceof Error) {
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to send Slack message: ${error.message}`
      );
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      'Unknown error occurred'
    );
  }
};