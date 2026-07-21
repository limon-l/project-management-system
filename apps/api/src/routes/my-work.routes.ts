import type { FastifyInstance } from "fastify";
import { Task } from "../models/index.js";
import { authMiddleware } from "../middleware/index.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";
import { getUserAssignedTasks } from "../services/index.js";

export async function myWorkRoutes(app: FastifyInstance): Promise<void> {
  // My assigned tasks (used by dashboard "My Tasks" widget)
  app.get(
    "/tasks/my",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const tasks = await getUserAssignedTasks(request.user!.userId);
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

  app.get(
    "/my-work/tasks",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { groupBy } = request.query as {
        groupBy?: "project" | "dueDate" | "priority";
      };

      const raw = await Task.find({ assigneeIds: userId })
        .populate("assigneeIds", "name avatarUrl")
        .populate("labelIds", "name color")
        .sort({ dueDate: 1 })
        .lean();

      const tasks = raw.map((t) => ({
        id: t._id.toString(),
        key: t.key,
        title: t.title,
        priority: t.priority,
        dueDate: t.dueDate,
        completed: t.completed,
        projectId: t.projectId.toString(),
        assigneeIds: (Array.isArray(t.assigneeIds) ? t.assigneeIds : []).map(
          (a: unknown) => {
            const u = a as { _id?: { toString(): string }; id?: string; name?: string; avatarUrl?: string | null };
            return {
              id: u._id?.toString() ?? u.id ?? "",
              name: u.name ?? "",
              avatarUrl: u.avatarUrl ?? null,
            };
          }
        ),
        labelIds: (Array.isArray(t.labelIds) ? t.labelIds : []).map(
          (l: unknown) => {
            const label = l as { _id?: { toString(): string }; id?: string; name?: string; color?: string };
            return {
              id: label._id?.toString() ?? label.id ?? "",
              name: label.name ?? "",
              color: label.color ?? "",
            };
          }
        ),
      }));

      const now = new Date();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const weekEnd = new Date(todayEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (groupBy === "project") {
        const grouped: Record<string, typeof tasks> = {};
        for (const t of tasks) {
          const pid = t.projectId;
          if (!grouped[pid]) grouped[pid] = [];
          grouped[pid].push(t);
        }
        sendSuccess(reply, { tasks, groups: grouped });
      } else if (groupBy === "dueDate") {
        const grouped = {
          overdue: tasks.filter((t) => t.dueDate && t.dueDate < now && !t.completed),
          today: tasks.filter(
            (t) => t.dueDate && t.dueDate >= now && t.dueDate <= todayEnd && !t.completed
          ),
          upcoming: tasks.filter(
            (t) => t.dueDate && t.dueDate > todayEnd && t.dueDate <= weekEnd && !t.completed
          ),
          later: tasks.filter(
            (t) => t.dueDate && t.dueDate > weekEnd && !t.completed
          ),
          noDate: tasks.filter((t) => !t.dueDate && !t.completed),
          completed: tasks.filter((t) => t.completed),
        };
        sendSuccess(reply, { tasks, groups: grouped });
      } else if (groupBy === "priority") {
        const order = ["URGENT", "HIGH", "MEDIUM", "LOW", "NO_PRIORITY"];
        const grouped: Record<string, typeof tasks> = { completed: [] };
        for (const p of order) grouped[p] = [];
        for (const t of tasks) {
          if (t.completed) {
            grouped.completed.push(t);
          } else {
            const arr = grouped[t.priority];
            if (arr) {
              arr.push(t);
            } else {
              grouped[t.priority] = [t];
            }
          }
        }
        sendSuccess(reply, { tasks, groups: grouped });
      } else {
        sendSuccess(reply, { tasks });
      }
    }
  );

  // Dashboard summary counts
  app.get(
    "/my-work/summary",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const userId = request.user!.userId;
      const now = new Date();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const [total, completed, overdue, dueToday] = await Promise.all([
        Task.countDocuments({ assigneeIds: userId }),
        Task.countDocuments({ assigneeIds: userId, completed: true }),
        Task.countDocuments({ assigneeIds: userId, dueDate: { $lt: now }, completed: false }),
        Task.countDocuments({
          assigneeIds: userId,
          dueDate: { $gte: now, $lte: todayEnd },
          completed: false,
        }),
      ]);

      sendSuccess(reply, { total, completed, overdue, dueToday });
    }
  );
}
