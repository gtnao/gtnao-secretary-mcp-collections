import { describe, it, expect } from 'vitest';
import { sendMessageSchema } from './input.js';
import type { SendMessageInput } from './input.js';

describe('sendMessageSchema', () => {
  describe('valid inputs', () => {
    it('should accept message only', () => {
      const input = { message: 'Hello, Slack!' };
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });

    it('should accept blocks only', () => {
      const input = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Hello, *Slack*!',
            },
          },
        ],
      };
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(input);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty object', () => {
      const input = {};
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          'Either message or blocks must be provided'
        );
      }
    });

    it('should reject both message and blocks', () => {
      const input = {
        message: 'Hello',
        blocks: [{ type: 'section', text: { type: 'plain_text', text: 'Hi' } }],
      };
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toBe(
          'Only one of message or blocks should be provided'
        );
      }
    });

    it('should reject non-string message', () => {
      const input = { message: 123 };
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain('Expected string');
      }
    });

    it('should reject non-array blocks', () => {
      const input = { blocks: 'not an array' };
      const result = sendMessageSchema.safeParse(input);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0]?.message).toContain('Expected array');
      }
    });
  });

  describe('type inference', () => {
    it('should correctly infer SendMessageInput type', () => {
      const validMessage: SendMessageInput = { message: 'test' };
      const validBlocks: SendMessageInput = { blocks: [] };

      // TypeScript will check these at compile time
      expect(validMessage).toBeDefined();
      expect(validBlocks).toBeDefined();
    });
  });
});