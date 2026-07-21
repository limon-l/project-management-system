import type { FastifyInstance } from "fastify";
import { authMiddleware, authorize } from "../middleware/index.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";
import { getWorkspaceAnalytics, getProjectAnalytics } from "../services/analytics.service.js";

export async function analyticsRoutes(app: FastifyInstance): Promise<void> {
  // Workspace analytics
  app.get(
    "/workspaces/:workspaceId/analytics",
    { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as { workspaceId: string };
        const data = await getWorkspaceAnalytics(workspaceId);
        sendSuccess(reply, data);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Project analytics
  app.get(
    "/projects/:projectId/analytics",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const data = await getProjectAnalytics(projectId);
        sendSuccess(reply, data);
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
