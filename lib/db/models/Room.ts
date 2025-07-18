// Modelo de habitación adaptado a la operativa real del hotel
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRoom extends Document {
  number: string;
  type: string;
  status: 'free' | 'dirty' | 'occupied';
  floor?: number;
  features?: string[];
  images?: string[];
}

const RoomSchema: Schema = new Schema<IRoom>(
  {
    number: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['free', 'dirty', 'occupied'], default: 'free' },
    floor: { type: Number },
    features: [{ type: String }],
    images: [{ type: String }],
  },
  { timestamps: true },
);

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
export default Room;
