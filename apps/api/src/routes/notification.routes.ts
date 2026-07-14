import type { FastifyInstance } from "fastify";
import { Notification } from "../models/index.js";
import {
  getNotifications,
  markNotificationsRead,
} from "../services/notification.service.js";
import { authMiddleware } from "../middleware/index.js";
import { sendSuccess } from "../utils/helpers.js";

export async function notificationRoutes(app: FastifyInstance): Promise<void> {
  // Get notifications
  app.get(
    "/",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getNotifications(
        request.user!.userId,
        page ? parseInt(page) : 1,
        limit ? parseInt(limit) : 20
      );
      sendSuccess(reply, result);
    }
  );

  // Unread count
  app.get(
    "/unread-count",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const count = await Notification.countDocuments({
        recipientId: request.user!.userId,
        read: false,
      });
      sendSuccess(reply, { count });
    }
  );

  // Mark as read
  app.post(
    "/read",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const { notificationIds } = (request.body || {}) as {
        notificationIds?: string[];
      };
      await markNotificationsRead(request.user!.userId, notificationIds);
      sendSuccess(reply, { message: "Notifications marked as read" });
    }
  );
}
