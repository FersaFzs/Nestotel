import { z } from 'zod';

// Esquema para la información del huésped
const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  dni: z.string().min(9, 'El DNI debe tener al menos 9 caracteres'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 caracteres'),
  address: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
  city: z.string().min(2, 'La ciudad debe tener al menos 2 caracteres'),
  country: z.string().min(2, 'El país debe tener al menos 2 caracteres'),
  postalCode: z.string().min(4, 'El código postal debe tener al menos 4 caracteres'),
});

export const reservationSchema = z.object({
  // Datos de la reserva
  userId: z.string().min(1, 'El ID de usuario es obligatorio'),
  userEmail: z.string().email('Email inválido'),
  roomId: z.string().min(1, 'La habitación es obligatoria'),
  checkIn: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de entrada inválida',
  }),
  checkOut: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de salida inválida',
  }),
  guests: z.number().min(1, 'Debe haber al menos una persona').max(6, 'Máximo 6 huéspedes'),
  totalPrice: z.number().min(0, 'El precio debe ser positivo'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),

  // Información personal del huésped principal
  guestInfo: guestInfoSchema,

  // Información adicional
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'cash', 'transfer'], {
    required_error: 'Debe seleccionar un método de pago',
  }),
  paymentStatus: z.enum(['pending', 'paid', 'failed']).optional(),

  // Datos de llegada
  estimatedArrivalTime: z.string().optional(),
  flightNumber: z.string().optional(),
  carRental: z.boolean().optional(),

  // Notas administrativas
  adminNotes: z.string().optional(),
});
