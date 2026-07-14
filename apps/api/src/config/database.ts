import mongoose from "mongoose";
import { getEnv } from "./env.js";
import { logger } from "../utils/logger.js";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  const env = getEnv();

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });

  isConnected = true;

  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB connection error");
  });

  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    logger.warn("MongoDB disconnected");
  });
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}
