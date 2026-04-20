import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  message: z.string().min(10).max(2000),
  hp: z.literal(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
