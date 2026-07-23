import type { FastifyInstance } from "fastify";
import { Notification } from "../models/index.js";
import {
  getNotifications,
  markNotificationsRead,
} from "../services/notification.service.js";
import { authMiddleware } from "../middleware/index.js";
import { sendSuccess, sendError, AppError, getRequestUser } from "../utils/helpers.js";

export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  // Get notifications
  app.get(
    "/",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const { page, limit } = request.query as { page?: string; limit?: string };
        const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit ?? "20", 10) || 20));
        const result = await getNotifications(getRequestUser(request).userId, pageNum, limitNum);
        sendSuccess(reply, result);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Unread count
  app.get(
    "/unread-count",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const count = await Notification.countDocuments({
          recipientId: getRequestUser(request).userId,
          read: false,
        });
        sendSuccess(reply, { count });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Mark as read
  app.post(
    "/read",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const { notificationIds } = (request.body ?? {}) as {
          notificationIds?: string[];
        };
        await markNotificationsRead(getRequestUser(request).userId, notificationIds);
        sendSuccess(reply, { message: "Notifications marked as read" });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );
}
