import { Task, Project, User, WorkspaceMember } from "../models/index.js";
import { toIdArray } from "../utils/helpers.js";

interface SearchOptions {
  workspaceId: string;
  query: string;
  type?: "tasks" | "projects" | "members";
  assigneeId?: string;
  priority?: string;
  labelId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  completed?: boolean;
  columnId?: string;
  page?: number;
  limit?: number;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function searchWorkspace(opts: SearchOptions) {
  const { workspaceId, query, type, page = 1, limit = 20 } = opts;
  const skip = (page - 1) * limit;
  const textQuery = query?.trim() || "";

  const results: {
    tasks?: unknown[];
    projects?: unknown[];
    members?: unknown[];
  } = {};

  // Search tasks
  if (!type || type === "tasks") {
    const taskFilter: Record<string, unknown> = { projectId: { $in: [] } };

    // Get all project IDs for this workspace
    const projects = await Project.find({ workspaceId }).select("_id").lean();
    const projectIds = projects.map((p) => p._id.toString());
    taskFilter.projectId = { $in: projectIds };

    if (textQuery) {
      taskFilter.$text = { $search: textQuery };
    }
    if (opts.assigneeId) taskFilter.assigneeIds = opts.assigneeId;
    if (opts.priority) taskFilter.priority = opts.priority;
    if (opts.labelId) taskFilter.labelIds = opts.labelId;
    if (opts.completed !== undefined) taskFilter.completed = opts.completed;
    if (opts.columnId) taskFilter.columnId = opts.columnId;
    if (opts.dueDateFrom || opts.dueDateTo) {
      const dueFilter: Record<string, unknown> = {};
      if (opts.dueDateFrom) dueFilter.$gte = new Date(opts.dueDateFrom);
      if (opts.dueDateTo) dueFilter.$lte = new Date(opts.dueDateTo);
      taskFilter.dueDate = dueFilter;
    }

    const tasksQuery = Task.find(taskFilter)
      .populate("assigneeIds", "name avatarUrl")
      .populate("labelIds", "name color")
      .sort(textQuery ? { score: { $meta: "textScore" as const } } : { updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    if (textQuery) {
      tasksQuery.select({ score: { $meta: "textScore" as const } });
    }

    const tasks = await tasksQuery.lean();

    results.tasks = toIdArray(tasks);
  }

  // Search projects
  if (!type || type === "projects") {
    const projectFilter: Record<string, unknown> = { workspaceId, archived: false };
    if (textQuery) {
      projectFilter.$text = { $search: textQuery };
    }

    const projectsQuery = Project.find(projectFilter)
      .sort(textQuery ? { score: { $meta: "textScore" as const } } : { updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    if (textQuery) {
      projectsQuery.select({ score: { $meta: "textScore" as const } });
    }

    const projects = await projectsQuery.lean();

    results.projects = toIdArray(projects);
  }

  // Search members — scoped to workspace
  if (!type || type === "members") {
    const memberUserIds = await WorkspaceMember.find({ workspaceId })
      .select("userId")
      .lean()
      .then((members) => members.map((m) => m.userId));

    const memberFilter: Record<string, unknown> = { _id: { $in: memberUserIds } };
    if (textQuery) {
      const escaped = escapeRegex(textQuery);
      memberFilter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    const members = await User.find(memberFilter)
      .select("name email avatarUrl")
      .limit(limit)
      .lean();

    results.members = members.map((m) => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      avatarUrl: m.avatarUrl,
    }));
  }

  return results;
}
