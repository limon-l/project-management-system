import type { FastifyInstance } from "fastify";
import { searchWorkspace } from "../services/search.service.js";
import { authMiddleware, authorize } from "../middleware/index.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";

export async function searchRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/workspaces/:workspaceId/search",
    {
      preHandler: [authMiddleware, authorize({ requireWorkspace: true })],
      config: { rateLimit: { max: 60, timeWindow: "1 minute" } },
    },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as { workspaceId: string };
        const query = request.query as {
          q?: string;
          type?: "tasks" | "projects" | "members";
          assigneeId?: string;
          priority?: string;
          labelId?: string;
          dueDateFrom?: string;
          dueDateTo?: string;
          completed?: string;
          columnId?: string;
          page?: string;
          limit?: string;
        };

        const results = await searchWorkspace({
          workspaceId,
          query: query.q || "",
          type: query.type,
          assigneeId: query.assigneeId,
          priority: query.priority,
          labelId: query.labelId,
          dueDateFrom: query.dueDateFrom,
          dueDateTo: query.dueDateTo,
          completed: query.completed !== undefined ? query.completed === "true" : undefined,
          columnId: query.columnId,
          page: Math.max(1, parseInt(query.page || "1", 10) || 1),
          limit: Math.min(100, Math.max(1, parseInt(query.limit || "20", 10) || 20)),
        });

        sendSuccess(reply, results);
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
