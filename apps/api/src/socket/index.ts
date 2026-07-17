import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { verifySocketSession } from "./auth.js";
import { registerHandlers } from "./handlers/index.js";
import { logger } from "../utils/logger.js";

let io: Server | null = null;

export function initSocketIO(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(",").map((o) => o.trim()),
      credentials: true,
    },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  io.use(verifySocketSession);

  registerHandlers(io);

  logger.info("Socket.IO initialized");

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
}

export function emitToProject(
  projectId: string,
  event: string,
  data: unknown
): void {
  getIO().to(`project:${projectId}`).emit(event, data);
}

export function emitToWorkspace(
  workspaceId: string,
  event: string,
  data: unknown
): void {
  getIO().to(`workspace:${workspaceId}`).emit(event, data);
}

export function emitToUser(userId: string, event: string, data: unknown): void {
  getIO().to(`user:${userId}`).emit(event, data);
}
