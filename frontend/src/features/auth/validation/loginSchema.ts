import { z } from 'zod';

export const loginSchema = z.object({
  userId: z
    .string()
    .min(1, 'User ID is required'),

  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),

  captcha: z
    .string()
    .min(1, 'Captcha is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;