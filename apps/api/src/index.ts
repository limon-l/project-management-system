import Fastify from "fastify";
import { createServer } from "http";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import multipart from "@fastify/multipart";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { getEnv, validateEnv } from "./config/env.js";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/index.js";
import { logger } from "./utils/logger.js";
import { initSocketIO } from "./socket/index.js";

async function main() {
  validateEnv();
  const env = getEnv();

  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        env.NODE_ENV !== "production"
          ? { target: "pino-pretty", options: { colorize: true } }
          : undefined,
    },
    bodyLimit: 1048576, // 1MB for API
  });

  // Security headers
  app.addHook("onRequest", async (_request, reply) => {
    reply.header("X-Content-Type-Options", "nosniff");
    reply.header("X-Frame-Options", "DENY");
    reply.header("X-XSS-Protection", "0");
    reply.header("Referrer-Policy", "strict-origin-when-cross-origin");
    reply.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    reply.header(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' ws: wss:"
    );
  });

  // Plugins
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(",").map((o) => o.trim()),
    credentials: true,
  });

  await app.register(cookie);

  await app.register(rateLimit, {
    max: 200,
    timeWindow: "1 minute",
  });

  await app.register(multipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
      files: 1,
    },
  });

  // Error handler
  app.setErrorHandler(errorHandler);

  // Routes
  await registerRoutes(app);

  // Database
  await connectDatabase();
  logger.info("Connected to MongoDB");

  // Create HTTP server and attach Socket.IO
  const httpServer = createServer(app.server);
  initSocketIO(httpServer);

  // Start server
  await app.listen({ port: env.API_PORT, host: env.API_HOST });
  logger.info(`API server running on port ${env.API_PORT}`);

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("Shutting down...");
    try {
      await disconnectDatabase();
      logger.info("Disconnected from MongoDB");
    } catch (err) {
      logger.error({ err }, "Error disconnecting from MongoDB");
    }
    await app.close();
    httpServer.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err: unknown) => {
  logger.error({ err }, "Failed to start server");
  process.exit(1);
});
