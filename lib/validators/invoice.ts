import { z } from 'zod';

export const invoiceSchema = z.object({
  number: z.string().min(1, 'El número de factura es obligatorio'),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha de factura inválida',
  }),
  clientName: z.string().min(1, 'El nombre del cliente es obligatorio'),
  clientNIF: z.string().min(1, 'El NIF del cliente es obligatorio'),
  clientAddress: z.string().optional(),
  reservation: z.string().min(1, 'La reserva es obligatoria'),
  items: z.array(
    z.object({
      description: z.string().min(1),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
      vat: z.number().min(0),
    }),
  ),
  total: z.number().min(0),
  vatTotal: z.number().min(0),
  grandTotal: z.number().min(0),
  pdfUrl: z.string().url().optional(),
});
