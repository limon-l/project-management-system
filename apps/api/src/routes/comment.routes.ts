import type { FastifyInstance } from "fastify";
import {
  getTaskComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comment.service.js";
import { authMiddleware } from "../middleware/index.js";
import { requireTaskAccess, requireCommentAccess } from "../middleware/taskAuth.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";

export async function commentRoutes(app: FastifyInstance): Promise<void> {
  // Get task comments
  app.get(
    "/tasks/:taskId/comments",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };
      const { page, limit } = request.query as { page?: string; limit?: string };
      const result = await getTaskComments(
        taskId,
        page ? parseInt(page) : 1,
        limit ? parseInt(limit) : 50
      );
      sendSuccess(reply, result);
    }
  );

  // Create comment
  app.post(
    "/tasks/:taskId/comments",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const comment = await createComment(
          taskId,
          request.user!.userId,
          request.body
        );
        sendSuccess(reply, comment, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Update comment
  app.patch(
    "/comments/:commentId",
    { preHandler: [authMiddleware, requireCommentAccess] },
    async (request, reply) => {
      try {
        const { commentId } = request.params as { commentId: string };
        const comment = await updateComment(
          commentId,
          request.user!.userId,
          request.body
        );
        sendSuccess(reply, comment);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Delete comment
  app.delete(
    "/comments/:commentId",
    { preHandler: [authMiddleware, requireCommentAccess] },
    async (request, reply) => {
      try {
        const { commentId } = request.params as { commentId: string };
        await deleteComment(commentId, request.user!.userId);
        sendSuccess(reply, { message: "Comment deleted" });
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
