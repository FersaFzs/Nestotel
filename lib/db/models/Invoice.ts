// Modelo base de factura (preparado para integración con Verifacti y normativa española)
// Cuando se confirme el pago, se enviará la factura en JSON a Verifacti,
// que devolverá el QR y emitirá el XML y lo enviará a la AEAT.
// Guardamos los enlaces/estados para trazabilidad y cumplimiento legal.
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvoice extends Document {
  number: string; // Número de factura, correlativo
  date: Date;
  clientName: string;
  clientNIF: string;
  clientAddress?: string;
  reservation: mongoose.Types.ObjectId; // Referencia a la reserva
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vat: number; // % IVA
  }>;
  total: number;
  vatTotal: number;
  grandTotal: number;
  pdfUrl?: string; // URL al PDF generado
  qrUrl?: string; // URL o base64 del QR devuelto por Verifacti
  xmlUrl?: string; // URL al XML FacturaE generado
  aeatStatus?: 'pending' | 'sent' | 'error'; // Estado de envío a AEAT
  aeatResponse?: string; // Respuesta o log de la AEAT
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema<IInvoice>(
  {
    number: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    clientName: { type: String, required: true },
    clientNIF: { type: String, required: true },
    clientAddress: { type: String },
    reservation: { type: Schema.Types.ObjectId, ref: 'Reservation', required: true },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        vat: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    vatTotal: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    pdfUrl: { type: String },
    qrUrl: { type: String },
    xmlUrl: { type: String },
    aeatStatus: { type: String, enum: ['pending', 'sent', 'error'], default: 'pending' },
    aeatResponse: { type: String },
  },
  { timestamps: true },
);

const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
export default Invoice;
