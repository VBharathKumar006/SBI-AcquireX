import mongoose from "mongoose";
import logger from "../services/logger.js";

let connected = false;

export async function connectMongo() {
  if (connected) return { connected: true };

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.warn("MONGODB_URI not set — using in-memory fallback");
    return { connected: false, reason: "MONGODB_URI not configured" };
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    connected = true;
    logger.info("Connected to MongoDB");
    return { connected: true };
  } catch (err) {
    logger.error("MongoDB connection failed", { error: err.message });
    return { connected: false, reason: err.message };
  }
}

export function isMongoConnected() {
  return connected;
}
