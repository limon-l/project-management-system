import mongoose from "mongoose";
import { getEnv } from "./env.js";
import { logger } from "../utils/logger.js";

/**
 * Global plugin that adds a consistent `toJSON` transform to every schema.
 * Converts `_id` → `id` (string) and removes `__v` so API responses never
 * leak internal MongoDB fields. Lean queries still need manual mapping via
 * the `toId()` / `toIdArray()` helpers.
 */
function toJSONPlugin(schema: mongoose.Schema): void {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(_doc: unknown, ret: Record<string, unknown>) {
      const raw = ret as { _id?: { toString(): string }; __v?: unknown };
      if (raw._id) {
        ret.id = raw._id.toString();
        delete raw._id;
      }
      delete raw.__v;
      return ret;
    },
  });
}

mongoose.plugin(toJSONPlugin);

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
  const state = mongoose.connection.readyState;
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
  const state = mongoose.connection.readyState;
  if (state === 0) {
    return;
  }
  await mongoose.disconnect();
}
