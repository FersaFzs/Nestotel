import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().optional(),
  role: z.enum(['user', 'admin']).optional(),
});
