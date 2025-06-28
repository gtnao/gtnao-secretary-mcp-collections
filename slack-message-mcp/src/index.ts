#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp/server.js';

const main = async (): Promise<void> => {
  try {
    // Create server
    const server = createMcpServer();
    
    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect server to transport
    await server.connect(transport);
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      await server.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await server.close();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
};

// Run the server
void main();