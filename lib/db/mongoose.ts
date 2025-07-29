import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

type MongooseCache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}
const cached = globalWithMongoose.mongoose as MongooseCache;

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('Falta la variable de entorno MONGODB_URI');
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then(mongoose => {
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
