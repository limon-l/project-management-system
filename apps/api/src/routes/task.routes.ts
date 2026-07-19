import type { FastifyInstance } from "fastify";
import {
  getProjectTasks,
  getTaskById,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  getTaskChecklist,
  addChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "../services/index.js";
import { authMiddleware, authorize } from "../middleware/index.js";
import { requireTaskAccess, requireChecklistItemAccess } from "../middleware/taskAuth.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";

export async function taskRoutes(app: FastifyInstance): Promise<void> {
  // List project tasks
  app.get(
    "/projects/:projectId/tasks",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const { columnId } = request.query as { columnId?: string };
        const tasks = await getProjectTasks(projectId, columnId);
        sendSuccess(reply, tasks);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get task
  app.get(
    "/tasks/:taskId",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const task = await getTaskById(taskId);
        sendSuccess(reply, task);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Create task
  app.post(
    "/projects/:projectId/tasks",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const task = await createTask(projectId, request.user!.userId, request.body);
        sendSuccess(reply, task, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Update task
  app.patch(
    "/tasks/:taskId",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const task = await updateTask(taskId, request.body, request.user?.userId);
        sendSuccess(reply, task);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Move task
  app.put(
    "/tasks/:taskId/move",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const task = await moveTask(taskId, request.body);
        sendSuccess(reply, task);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Delete task
  app.delete(
    "/tasks/:taskId",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        await deleteTask(taskId);
        sendSuccess(reply, { message: "Task deleted" });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get task checklist
  app.get(
    "/tasks/:taskId/checklist",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const items = await getTaskChecklist(taskId);
        sendSuccess(reply, items);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Add checklist item
  app.post(
    "/tasks/:taskId/checklist",
    { preHandler: [authMiddleware, requireTaskAccess] },
    async (request, reply) => {
      try {
        const { taskId } = request.params as { taskId: string };
        const item = await addChecklistItem(taskId, request.body);
        sendSuccess(reply, item, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Update checklist item
  app.patch(
    "/checklist/:itemId",
    { preHandler: [authMiddleware, requireChecklistItemAccess] },
    async (request, reply) => {
      try {
        const { itemId } = request.params as { itemId: string };
        const item = await updateChecklistItem(
          itemId,
          request.user!.userId,
          request.body
        );
        sendSuccess(reply, item);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Delete checklist item
  app.delete(
    "/checklist/:itemId",
    { preHandler: [authMiddleware, requireChecklistItemAccess] },
    async (request, reply) => {
      try {
        const { itemId } = request.params as { itemId: string };
        await deleteChecklistItem(itemId);
        sendSuccess(reply, { message: "Checklist item deleted" });
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
