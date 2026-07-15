import type { FastifyInstance } from "fastify";
import { Task } from "../models/index.js";
import { authMiddleware } from "../middleware/index.js";
import { sendSuccess } from "../utils/helpers.js";

export async function myWorkRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/my-work/tasks",
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      const userId = request.user!.userId;
      const { groupBy } = request.query as {
        groupBy?: "project" | "dueDate" | "priority";
      };

      const tasks = await Task.find({ assigneeIds: userId })
        .populate("assigneeIds", "name avatarUrl")
        .populate("labelIds", "name color")
        .sort({ dueDate: 1 })
        .lean();

      const now = new Date();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const weekEnd = new Date(todayEnd.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (groupBy === "project") {
        const grouped: Record<string, typeof tasks> = {};
        for (const t of tasks) {
          const pid = t.projectId.toString();
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
