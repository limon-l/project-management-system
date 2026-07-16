import mongoose from "mongoose";
import { getEnv } from "./env.js";
import { logger } from "../utils/logger.js";

// Configure connection event listeners once at module import
mongoose.connection.on("error", (err) => {
  logger.error({ err }, "MongoDB connection error");
});

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  logger.info("MongoDB connected successfully");
});

export async function connectDatabase(): Promise<void> {
  const state = mongoose.connection.readyState as any;
  // Check if we already have an active connection (1 = connected, 2 = connecting)
  if (state === 1 || state === 2) {
    return;
  }

  const env = getEnv();

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
}

export async function disconnectDatabase(): Promise<void> {
  const state = mongoose.connection.readyState as any;
  if (state === 0) {
    return;
  }
  await mongoose.disconnect();
}
