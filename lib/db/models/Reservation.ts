// Modelo de reserva adaptado a la operativa real del hotel
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReservation extends Document {
  dni: string;
  name: string;
  surname: string;
  peopleCount: number;
  startDate: Date;
  endDate: Date;
  breakfast?: boolean;
  observations?: string;
  room?: mongoose.Types.ObjectId;
  status: 'pending' | 'checked_in' | 'checked_out' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema<IReservation>(
  {
    dni: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    peopleCount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    breakfast: { type: Boolean },
    observations: { type: String },
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: {
      type: String,
      enum: ['pending', 'checked_in', 'checked_out', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Reservation: Model<IReservation> =
  mongoose.models.Reservation || mongoose.model<IReservation>('Reservation', ReservationSchema);
export default Reservation;
