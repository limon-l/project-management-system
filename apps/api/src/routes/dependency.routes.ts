import type { FastifyInstance } from "fastify";
import {
  getTaskDependencies,
  createDependency,
  deleteDependency,
} from "../services/dependency.service.js";
import { authMiddleware, authorize } from "../middleware/index.js";
import { requireTaskAccess } from "../middleware/taskAuth.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";

export async function dependencyRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/tasks/:taskId/dependencies",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      const { taskId } = request.params as { taskId: string };
      const task = await import("../models/index.js").then((m) =>
        m.Task.findById(taskId).select("projectId").lean()
      );
      if (!task) {
        sendError(reply, 404, "NOT_FOUND", "Task not found");
        return;
      }
      const result = await getTaskDependencies(taskId, task.projectId.toString());
      sendSuccess(reply, result);
    }
  );

  app.post(
    "/tasks/:taskId/dependencies",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const dependency = await createDependency(
          taskId,
          request.user!.userId,
          request.body
        );
        sendSuccess(reply, dependency, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  app.delete(
    "/dependencies/:dependencyId",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const { dependencyId } = request.params as { dependencyId: string };
        const result = await deleteDependency(
          dependencyId,
          request.user!.userId
        );
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
}
