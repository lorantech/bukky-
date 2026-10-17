import mongoose from "mongoose";
import { env } from "../config/env";

let cached: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  if (cached) return cached;
  try {
    cached = await mongoose.connect(env.MONGO_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000,
    });
    const host = new URL(env.MONGO_URI.replace("mongodb+srv://", "mongodb://")).hostname;
    console.log(`MongoDB connected: ${host}`);
    return cached;
  } catch (error) {
    if (error instanceof Error && /ECONNREFUSED|ENOTFOUND/i.test(error.message)) {
      console.error(
        "MongoDB connection failed: could not reach the database.\n" +
          "- Local Mongo? Start it (e.g. `mongod`) or use Docker: `docker run -d -p 27017:27017 mongo:7`\n" +
          "- Atlas? Set backend/.env MONGO_URI to your mongodb+srv:// connection string and allow your IP in Network Access."
      );
    } else {
      console.error("MongoDB connection failed:", error);
    }
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (cached) {
    await cached.disconnect();
    cached = null;
  }
};