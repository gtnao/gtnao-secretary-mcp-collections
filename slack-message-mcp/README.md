# Slack Message MCP Server

An MCP (Model Context Protocol) server that enables Claude to send messages to a specific Slack channel.

## Features

- Send plain text messages to Slack
- Send rich formatted messages using Slack Block Kit
- Support for both public and private channels
- Built with TypeScript and comprehensive testing

## Prerequisites

- Node.js 16 or higher
- A Slack workspace with a configured bot
- Bot User OAuth Token with appropriate permissions

## Installation

```bash
npm install
npm run build
```

## Configuration

1. Create a Slack App at https://api.slack.com/apps
2. Add OAuth scopes:
   - `chat:write` (for public channels)
   - `chat:write.public` (for public channels without joining)
   - `groups:write` (for private channels)
3. Install the app to your workspace
4. Copy the Bot User OAuth Token (starts with `xoxb-`)
5. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env`:
```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_CHANNEL_ID=C1234567890
```

## Usage

### As MCP Server

Add to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "slack-message": {
      "command": "node",
      "args": ["/path/to/slack-message-mcp/dist/index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_CHANNEL_ID": "C1234567890"
      }
    }
  }
}
```

### Available Tools

#### send_message

Send a message to the configured Slack channel.

Parameters:
- `message` (string, optional): Plain text message to send
- `blocks` (array, optional): Slack Block Kit blocks for rich formatting

Either `message` or `blocks` must be provided, but not both.

Example usage:
```javascript
// Plain text message
{
  "message": "Hello from MCP!"
}

// Rich formatted message
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Hello *MCP*! This is a _formatted_ message."
      }
    }
  ]
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run in development mode
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

## Architecture

- **TDD Approach**: All features developed using Test-Driven Development
- **No Classes**: Functional programming approach with functions and objects
- **Type Safety**: Full TypeScript with strict mode
- **Testing**: Comprehensive test coverage with Vitest and MSW for API mocking

## License

MIT