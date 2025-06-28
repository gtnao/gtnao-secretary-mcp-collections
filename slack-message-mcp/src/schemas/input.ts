import { z } from 'zod';

export const sendMessageSchema = z
  .object({
    message: z.string().optional(),
    blocks: z.array(z.any()).optional(),
  })
  .refine((data) => data.message !== undefined || data.blocks !== undefined, {
    message: 'Either message or blocks must be provided',
  })
  .refine((data) => !(data.message !== undefined && data.blocks !== undefined), {
    message: 'Only one of message or blocks should be provided',
  });

export type SendMessageInput = z.infer<typeof sendMessageSchema>;