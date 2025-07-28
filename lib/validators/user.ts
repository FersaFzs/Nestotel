import { z } from 'zod';

export const userSchema = z.object({
  firebaseUid: z.string().min(1, 'Firebase UID es obligatorio'),
  email: z.string().email('Email inválido'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'admin', 'super_admin'], {
    required_error: 'El rol es obligatorio',
  }),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['user', 'admin', 'super_admin']).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});
