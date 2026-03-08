import { z } from 'zod/v4';

export const verifyByHashSchema = z.object({
  imageHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid SHA-256 hash'),
});

export const batchVerifySchema = z.object({
  hashes: z.array(z.string().regex(/^0x[a-fA-F0-9]{64}$/)).min(1).max(100),
});

export type VerifyByHashInput = z.infer<typeof verifyByHashSchema>;
export type BatchVerifyInput = z.infer<typeof batchVerifySchema>;
