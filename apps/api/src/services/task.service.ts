import { Task, ChecklistItem, Label, Column, Board, Project, Activity, Comment, Attachment, TaskDependency, Notification } from "../models/index.js";
import { AppError, validate } from "../utils/helpers.js";
import {
  createTaskSchema,
  updateTaskSchema,
  moveTaskSchema,
  createChecklistItemSchema,
  updateChecklistItemSchema,
  TASK_PRIORITIES,
} from "@boardflow/shared";
import type { TaskPriority } from "@boardflow/shared";
import { emitToProject } from "../socket/index.js";
import { notifyTaskAssignment } from "./notification.service.js";

export async function getProjectTasks(projectId: string, columnId?: string) {
  const filter: Record<string, unknown> = { projectId };
  if (columnId) filter.columnId = columnId;

  const tasks = await Task.find(filter)
    .populate("assigneeIds", "name avatarUrl")
    .populate("labelIds", "name color")
    .sort({ position: 1 })
    .lean();

  return tasks;
}

export async function getTaskById(taskId: string) {
  const task = await Task.findById(taskId)
    .populate("assigneeIds", "name avatarUrl")
    .populate("labelIds", "name color")
    .populate("creatorId", "name avatarUrl")
    .lean();

  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }
  return task;
}

export async function createTask(
  projectId: string,
  creatorId: string,
  input: unknown
) {
  const data = validate(createTaskSchema, input);

  const column = await Column.findById(data.columnId).lean();
  if (!column) {
    throw new AppError(404, "NOT_FOUND", "Column not found");
  }

  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }

  const lastTask = await Task.findOne({ projectId })
    .sort({ sequence: -1 })
    .lean();
  const sequence = (lastTask?.sequence ?? 0) + 1;
  const key = `${project.key}-${sequence}`;

  const task = await Task.create({
    projectId,
    boardId: column.boardId,
    columnId: data.columnId,
    position: String(sequence * 1000).padStart(7, "0"),
    key,
    title: data.title,
    priority: data.priority || "NO_PRIORITY",
    creatorId,
    assigneeIds: data.assigneeIds || [],
    labelIds: data.labelIds || [],
    startDate: data.startDate || null,
    dueDate: data.dueDate || null,
    sequence,
    completed: false,
    watcherIds: [creatorId],
  });

  const created = await getTaskById(task._id.toString());
  emitToProject(projectId, "task:created", { task: created, columnId: data.columnId });
  return created;
}

export async function updateTask(taskId: string, input: unknown, userId?: string) {
  const data = validate(updateTaskSchema, input);

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  if (data.title !== undefined) task.title = data.title;
  if (data.description !== undefined) task.description = data.description;
  if (data.priority !== undefined) task.priority = data.priority as TaskPriority;
  if (data.labelIds !== undefined) task.labelIds = data.labelIds as unknown as typeof task.labelIds;
  if (data.startDate !== undefined) task.startDate = data.startDate;
  if (data.dueDate !== undefined) task.dueDate = data.dueDate;
  if (data.assigneeIds !== undefined) {
    const oldAssigneeIds = task.assigneeIds.map((id) => id.toString());
    task.assigneeIds = data.assigneeIds as unknown as typeof task.assigneeIds;
    const newAssigneeIds = data.assigneeIds.filter(
      (id: string) => !oldAssigneeIds.includes(id)
    );
    if (newAssigneeIds.length > 0 && userId) {
      const project = await Project.findById(task.projectId).select("workspaceId").lean();
      const workspaceId = project?.workspaceId?.toString();
      if (workspaceId) {
        for (const assigneeId of newAssigneeIds) {
          await notifyTaskAssignment(
            taskId,
            task.projectId.toString(),
            workspaceId,
            userId,
            assigneeId
          );
        }
      }
    }
  }

  await task.save();
  const updated = await getTaskById(taskId);
  const projectId = task.projectId.toString();
  emitToProject(projectId, "task:updated", { task: updated });
  return updated;
}

export async function moveTask(taskId: string, input: unknown) {
  const data = validate(moveTaskSchema, input);

  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  const column = await Column.findById(data.columnId).lean();
  if (!column) {
    throw new AppError(404, "NOT_FOUND", "Column not found");
  }

  if (column.boardId.toString() !== task.boardId.toString()) {
    throw new AppError(400, "BAD_REQUEST", "Cannot move task to a different board");
  }

  const doneColumn = await Column.findOne({
    boardId: task.boardId,
    name: { $in: ["Done", "done", "DONE", "Completed"] },
  }).lean();

  const isMovingToDone = doneColumn?._id.toString() === data.columnId;
  const isMovingFromDone =
    doneColumn?._id.toString() === task.columnId.toString();

  const fromColumnId = task.columnId.toString();
  task.columnId = data.columnId as unknown as typeof task.columnId;
  task.position = data.position;
  task.completed = isMovingToDone;

  const projectId = task.projectId.toString();
  await task.save();
  emitToProject(projectId, "task:moved", {
    taskId,
    fromColumnId,
    toColumnId: data.columnId,
    position: data.position,
  });
  return getTaskById(taskId);
}

export async function deleteTask(taskId: string) {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  const projectId = task.projectId.toString();
  const columnId = task.columnId.toString();

  await Comment.deleteMany({ taskId });
  await Attachment.deleteMany({ taskId });
  await TaskDependency.deleteMany({
    $or: [{ blockingTaskId: taskId }, { blockedTaskId: taskId }],
  });
  await ChecklistItem.deleteMany({ taskId });
  await Notification.deleteMany({ entityType: "task", entityId: taskId });
  await Task.findByIdAndDelete(taskId);
  emitToProject(projectId, "task:deleted", { taskId, columnId });
}

export async function getTaskChecklist(taskId: string) {
  return ChecklistItem.find({ taskId }).sort({ position: 1 }).lean();
}

export async function addChecklistItem(
  taskId: string,
  input: unknown
) {
  const data = validate(createChecklistItemSchema, input);

  const task = await Task.findById(taskId).lean();
  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  const lastItem = await ChecklistItem.findOne({ taskId })
    .sort({ position: -1 })
    .lean();
  const position = lastItem
    ? String(parseInt(lastItem.position) + 1).padStart(6, "0")
    : "000001";

  const item = await ChecklistItem.create({
    taskId,
    text: data.text,
    position,
  });

  return item.toJSON();
}

export async function updateChecklistItem(
  itemId: string,
  userId: string,
  input: unknown
) {
  const data = validate(updateChecklistItemSchema, input);

  const item = await ChecklistItem.findById(itemId);
  if (!item) {
    throw new AppError(404, "NOT_FOUND", "Checklist item not found");
  }

  if (data.text !== undefined) item.text = data.text;
  if (data.completed !== undefined) {
    item.completed = data.completed;
    item.completedBy = data.completed ? (userId as unknown as typeof item.completedBy) : null;
    item.completedAt = data.completed ? new Date() : null;
  }

  await item.save();
  return item.toJSON();
}

export async function deleteChecklistItem(itemId: string) {
  const item = await ChecklistItem.findById(itemId);
  if (!item) {
    throw new AppError(404, "NOT_FOUND", "Checklist item not found");
  }
  await ChecklistItem.findByIdAndDelete(itemId);
}

export async function getTaskLabels(projectId: string) {
  return Label.find({ projectId }).lean();
}

export async function createLabel(
  projectId: string,
  name: string,
  color: string
) {
  const existing = await Label.findOne({ projectId, name }).lean();
  if (existing) {
    throw new AppError(409, "CONFLICT", "Label already exists");
  }

  const label = await Label.create({ projectId, name, color });
  return label.toJSON();
}

export async function deleteLabel(labelId: string) {
  const label = await Label.findById(labelId);
  if (!label) {
    throw new AppError(404, "NOT_FOUND", "Label not found");
  }

  await Task.updateMany({ labelIds: labelId }, { $pull: { labelIds: labelId } });
  await Label.findByIdAndDelete(labelId);
}

export async function getUserAssignedTasks(userId: string) {
  const tasks = await Task.find({ assigneeIds: userId, completed: false })
    .populate("assigneeIds", "name avatarUrl")
    .populate("labelIds", "name color")
    .sort({ dueDate: 1 })
    .lean();

  return tasks;
}

export async function createActivity(data: {
  actorId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  projectId: string;
  workspaceId: string;
  metadata?: Record<string, unknown>;
}) {
  return Activity.create({
    actorId: data.actorId,
    actionType: data.actionType,
    entityType: data.entityType,
    entityId: data.entityId,
    projectId: data.projectId,
    workspaceId: data.workspaceId,
    metadata: data.metadata || {},
  });
}
