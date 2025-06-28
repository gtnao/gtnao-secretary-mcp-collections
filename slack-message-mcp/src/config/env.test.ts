import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateEnv, getConfig } from './env.js';

describe('Environment validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('validateEnv', () => {
    it('should throw error when SLACK_BOT_TOKEN is missing', () => {
      delete process.env.SLACK_BOT_TOKEN;
      process.env.SLACK_CHANNEL_ID = 'C1234567890';

      expect(() => validateEnv()).toThrow('SLACK_BOT_TOKEN is required');
    });

    it('should throw error when SLACK_CHANNEL_ID is missing', () => {
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
      delete process.env.SLACK_CHANNEL_ID;

      expect(() => validateEnv()).toThrow('SLACK_CHANNEL_ID is required');
    });

    it('should throw error when SLACK_CHANNEL_ID has invalid format', () => {
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
      process.env.SLACK_CHANNEL_ID = 'invalid-channel-id';

      expect(() => validateEnv()).toThrow(
        'SLACK_CHANNEL_ID must start with C (public channel) or G (private channel)'
      );
    });

    it('should not throw when all required env vars are valid', () => {
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
      process.env.SLACK_CHANNEL_ID = 'C1234567890';

      expect(() => validateEnv()).not.toThrow();
    });

    it('should accept private channel IDs starting with G', () => {
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
      process.env.SLACK_CHANNEL_ID = 'G1234567890';

      expect(() => validateEnv()).not.toThrow();
    });
  });

  describe('getConfig', () => {
    it('should return validated config object', () => {
      process.env.SLACK_BOT_TOKEN = 'xoxb-test-token';
      process.env.SLACK_CHANNEL_ID = 'C1234567890';

      const config = getConfig();

      expect(config).toEqual({
        slackBotToken: 'xoxb-test-token',
        slackChannelId: 'C1234567890',
      });
    });

    it('should throw error when getting invalid config', () => {
      delete process.env.SLACK_BOT_TOKEN;

      expect(() => getConfig()).toThrow('SLACK_BOT_TOKEN is required');
    });
  });
});