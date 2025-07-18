import { z } from 'zod';

export const reservationSchema = z.object({
  dni: z.string().min(1, 'El DNI es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  surname: z.string().min(1, 'El apellido es obligatorio'),
  peopleCount: z.number().min(1, 'Debe haber al menos una persona'),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de inicio inválida',
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de fin inválida',
  }),
  breakfast: z.boolean().optional(),
  observations: z.string().optional(),
  room: z.string().optional(),
  status: z.enum(['pending', 'checked_in', 'checked_out', 'cancelled']).optional(),
});
