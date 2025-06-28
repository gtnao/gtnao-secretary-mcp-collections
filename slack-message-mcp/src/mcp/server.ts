import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { 
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { handleListTools, handleCallTool } from './handlers.js';

export const createMcpServer = (): Server => {
  const server = new Server({
    name: 'slack-message-mcp',
    version: '1.0.0',
    description: 'MCP server for sending messages to Slack',
  }, {
    capabilities: {
      tools: {},
    },
  });

  // Register tools/list handler
  server.setRequestHandler(ListToolsRequestSchema, handleListTools);

  // Register tools/call handler
  server.setRequestHandler(CallToolRequestSchema, handleCallTool);

  return server;
};