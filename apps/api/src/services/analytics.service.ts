import { Project, Task, ProjectMember, Activity, WorkspaceMember } from "../models/index.js";

export async function getWorkspaceAnalytics(workspaceId: string) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const projects = await Project.find({ workspaceId, archived: false }).lean();
  const projectIds = projects.map((p) => p._id.toString());

  if (projectIds.length === 0) {
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalTasks: 0,
      completedTasks: 0,
      overdueTasks: 0,
      tasksCompletedThisWeek: 0,
      tasksByStatus: {} as Record<string, number>,
      tasksByPriority: {} as Record<string, number>,
      workloadByMember: [] as { userId: string; name: string; taskCount: number }[],
      upcomingDeadlines: [] as { taskId: string; taskKey: string; title: string; dueDate: string }[],
      recentActivity: 0,
    };
  }

  const [
    tasks,
    completedThisWeek,
    overdueTasks,
    recentActivity,
    members,
  ] = await Promise.all([
    Task.find({ projectId: { $in: projectIds } }).lean(),
    Task.countDocuments({
      projectId: { $in: projectIds },
      completed: true,
      updatedAt: { $gte: weekAgo },
    }),
    Task.countDocuments({
      projectId: { $in: projectIds },
      dueDate: { $lt: now },
      completed: false,
    }),
    Activity.countDocuments({
      projectId: { $in: projectIds },
      createdAt: { $gte: weekAgo },
    }),
    WorkspaceMember.find({ workspaceId })
      .populate("userId", "name")
      .lean(),
  ]);

  const statusCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {};
  const workloadMap = new Map<string, { name: string; count: number }>();

  for (const t of tasks) {
    statusCounts[t.completed ? "completed" : "incomplete"] =
      (statusCounts[t.completed ? "completed" : "incomplete"] ?? 0) + 1;
    if (!t.completed) {
      priorityCounts[t.priority] = (priorityCounts[t.priority] || 0) + 1;
    }
    for (const aid of t.assigneeIds) {
      const id = aid.toString();
      const entry = workloadMap.get(id) || { name: "", count: 0 };
      entry.count++;
      workloadMap.set(id, entry);
    }
  }

  for (const m of members) {
    const u = m.userId as unknown as { _id: { toString(): string }; name: string } | null;
    if (u) {
      const existing = workloadMap.get(u._id.toString());
      if (existing) existing.name = u.name;
    }
  }

  const workloadByMember = Array.from(workloadMap.entries())
    .map(([userId, data]) => ({ userId, name: data.name || "Unknown", taskCount: data.count }))
    .sort((a, b) => b.taskCount - a.taskCount);

  const upcomingDeadlines = await Task.find({
    projectId: { $in: projectIds },
    dueDate: { $gte: now, $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) },
    completed: false,
  })
    .select("key title dueDate")
    .sort({ dueDate: 1 })
    .limit(10)
    .lean();

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "ACTIVE").length,
    completedProjects: projects.filter((p) => p.status === "COMPLETED").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.completed).length,
    overdueTasks,
    tasksCompletedThisWeek: completedThisWeek,
    tasksByStatus: statusCounts,
    tasksByPriority: priorityCounts,
    workloadByMember,
    upcomingDeadlines: upcomingDeadlines.map((t) => ({
      taskId: t._id.toString(),
      taskKey: t.key,
      title: t.title,
      dueDate: t.dueDate?.toISOString() ?? "",
    })),
    recentActivity,
  };
}

export async function getProjectAnalytics(projectId: string) {
  const now = new Date();

  const [tasks, project] = await Promise.all([
    Task.find({ projectId }).lean(),
    Project.findById(projectId).lean(),
  ]);

  if (!project) {
    return null;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate < now && !t.completed).length;

  const byPriority: Record<string, number> = {};
  const byAssignee = new Map<string, number>();
  const byLabel = new Map<string, number>();

  for (const t of tasks) {
    if (!t.completed) {
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    }
    for (const aid of t.assigneeIds) {
      const id = aid.toString();
      byAssignee.set(id, (byAssignee.get(id) ?? 0) + 1);
    }
    for (const lid of t.labelIds) {
      const id = lid.toString();
      byLabel.set(id, (byLabel.get(id) ?? 0) + 1);
    }
  }

  const members = await ProjectMember.find({ projectId })
    .populate("userId", "name")
    .lean();

  const tasksByAssignee = Array.from(byAssignee.entries()).map(([userId, count]) => {
    const member = members.find(
      (m) => m.userId.toString() === userId
    );
    const u = member?.userId as unknown as { name: string } | undefined;
    return { userId, name: u?.name ?? "Unknown", taskCount: count };
  }).sort((a, b) => b.taskCount - a.taskCount);

  return {
    totalTasks,
    completedTasks,
    completionPercentage,
    overdueTasks,
    tasksByPriority: byPriority,
    tasksByAssignee,
    status: project.status,
  };
}
