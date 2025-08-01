// Modelo de reserva adaptado a la operativa real del hotel
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReservation extends Document {
  // Datos de la reserva
  userId: string; // Firebase UID
  userEmail: string;
  roomId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  // Información personal del huésped principal
  guestInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };

  // Información adicional
  specialRequests?: string;
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'transfer';
  paymentStatus: 'pending' | 'paid' | 'failed';

  // Datos de llegada
  estimatedArrivalTime?: string;
  flightNumber?: string;
  carRental?: boolean;

  // Notas administrativas
  adminNotes?: string;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema<IReservation>(
  {
    // Datos de la reserva
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    // Información personal del huésped principal
    guestInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      dni: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true, default: 'España' },
      postalCode: { type: String, required: true },
    },

    // Información adicional
    specialRequests: { type: String },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'cash', 'transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },

    // Datos de llegada
    estimatedArrivalTime: { type: String },
    flightNumber: { type: String },
    carRental: { type: Boolean, default: false },

    // Notas administrativas
    adminNotes: { type: String },
  },
  { timestamps: true },
);

const Reservation: Model<IReservation> =
  mongoose.models['Reservation'] || mongoose.model<IReservation>('Reservation', ReservationSchema);
export default Reservation;
