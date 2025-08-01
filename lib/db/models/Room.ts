// Modelo de habitación adaptado a la operativa real del hotel
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  number: string;
  type: string;
  description: string;
  price: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  status: 'free' | 'dirty' | 'occupied';
  floor?: number;
  isActive: boolean;
}

const RoomSchema: Schema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    status: { type: String, enum: ['free', 'dirty', 'occupied'], default: 'free' },
    floor: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Room: Model<IRoom> = mongoose.models['Room'] || mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
