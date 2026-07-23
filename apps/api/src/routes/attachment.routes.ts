import type { FastifyInstance } from "fastify";
import { authMiddleware } from "../middleware/index.js";
import { requireTaskAccess, requireAttachmentAccess } from "../middleware/taskAuth.js";
import { sendSuccess, AppError, sendError, getRequestUser } from "../utils/helpers.js";
import {
  uploadAttachment,
  getTaskAttachments,
  deleteAttachment,
} from "../services/attachment.service.js";

export async function attachmentRoutes(app: FastifyInstance): Promise<void> {
  // List attachments
  app.get(
    "/tasks/:taskId/attachments",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const attachments = await getTaskAttachments(taskId);
        sendSuccess(reply, { attachments });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Upload attachment
  app.post(
    "/tasks/:taskId/attachments",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const data = await request.file();

        if (!data) {
          sendError(reply, 400, "BAD_REQUEST", "No file provided");
          return;
        }

        const buffer = await data.toBuffer();
        const attachment = await uploadAttachment(
          taskId,
          getRequestUser(request).userId,
          buffer,
          data.filename,
          data.mimetype
        );

        sendSuccess(reply, { attachment }, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Delete attachment
  app.delete(
    "/attachments/:id",
    { preHandler: [authMiddleware, requireAttachmentAccess] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };
        await deleteAttachment(id, getRequestUser(request).userId);
        sendSuccess(reply, { message: "Attachment deleted" });
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
