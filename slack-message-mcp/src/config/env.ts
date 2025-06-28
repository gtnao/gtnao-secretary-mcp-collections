export interface Config {
  slackBotToken: string;
  slackChannelId: string;
}

export const validateEnv = (): void => {
  const { SLACK_BOT_TOKEN, SLACK_CHANNEL_ID } = process.env;

  if (SLACK_BOT_TOKEN === undefined || SLACK_BOT_TOKEN === '') {
    throw new Error('SLACK_BOT_TOKEN is required');
  }

  if (SLACK_CHANNEL_ID === undefined || SLACK_CHANNEL_ID === '') {
    throw new Error('SLACK_CHANNEL_ID is required');
  }

  if (!SLACK_CHANNEL_ID.startsWith('C') && !SLACK_CHANNEL_ID.startsWith('G')) {
    throw new Error(
      'SLACK_CHANNEL_ID must start with C (public channel) or G (private channel)'
    );
  }
};

export const getConfig = (): Config => {
  validateEnv();

  return {
    slackBotToken: process.env.SLACK_BOT_TOKEN as string,
    slackChannelId: process.env.SLACK_CHANNEL_ID as string,
  };
};