import { z } from 'zod/v4';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  twitterUrl: z.url().optional().nullable(),
  websiteUrl: z.url().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
