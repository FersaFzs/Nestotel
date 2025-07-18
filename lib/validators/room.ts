import { z } from 'zod';

export const roomSchema = z.object({
  number: z.string().min(1, 'El número es obligatorio'),
  type: z.string().min(1, 'El tipo es obligatorio'),
  status: z.enum(['free', 'dirty', 'occupied']).optional(),
  floor: z.number().optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).optional(),
});
