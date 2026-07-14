import {
  Task,
  TaskDependency,
  Project,
  ProjectMember,
} from "../models/index.js";
import { AppError, validate } from "../utils/helpers.js";
import { createDependencySchema, deleteDependencySchema } from "@boardflow/shared";
import { emitToProject } from "../socket/index.js";

export async function getTaskDependencies(taskId: string, projectId: string) {
  const dependencies = await TaskDependency.find({
    projectId,
    $or: [{ blockingTaskId: taskId }, { blockedTaskId: taskId }],
  })
    .populate("blockingTaskId", "key title completed")
    .populate("blockedTaskId", "key title completed")
    .lean();

  const blocking = dependencies
    .filter((d) => d.blockedTaskId.toString() === taskId)
    .map((d) => ({
      id: d._id.toString(),
      projectId: d.projectId.toString(),
      blockingTaskId: d.blockingTaskId.toString(),
      blockedTaskId: d.blockedTaskId.toString(),
      blockingTask: {
        id: (d.blockingTaskId as unknown as { _id: { toString(): string } })._id.toString(),
        key: (d.blockingTaskId as unknown as { key: string }).key,
        title: (d.blockingTaskId as unknown as { title: string }).title,
        completed: (d.blockingTaskId as unknown as { completed: boolean }).completed,
      },
      blockedTask: {
        id: (d.blockedTaskId as unknown as { _id: { toString(): string } })._id.toString(),
        key: (d.blockedTaskId as unknown as { key: string }).key,
        title: (d.blockedTaskId as unknown as { title: string }).title,
        completed: (d.blockedTaskId as unknown as { completed: boolean }).completed,
      },
      createdAt: d.createdAt,
    }));

  const blockedBy = dependencies
    .filter((d) => d.blockingTaskId.toString() === taskId)
    .map((d) => ({
      id: d._id.toString(),
      projectId: d.projectId.toString(),
      blockingTaskId: d.blockingTaskId.toString(),
      blockedTaskId: d.blockedTaskId.toString(),
      blockingTask: {
        id: (d.blockingTaskId as unknown as { _id: { toString(): string } })._id.toString(),
        key: (d.blockingTaskId as unknown as { key: string }).key,
        title: (d.blockingTaskId as unknown as { title: string }).title,
        completed: (d.blockingTaskId as unknown as { completed: boolean }).completed,
      },
      blockedTask: {
        id: (d.blockedTaskId as unknown as { _id: { toString(): string } })._id.toString(),
        key: (d.blockedTaskId as unknown as { key: string }).key,
        title: (d.blockedTaskId as unknown as { title: string }).title,
        completed: (d.blockedTaskId as unknown as { completed: boolean }).completed,
      },
      createdAt: d.createdAt,
    }));

  return { blocking, blockedBy };
}

export async function createDependency(
  taskId: string,
  userId: string,
  input: unknown
) {
  const data = validate(createDependencySchema, input);

  if (data.blockingTaskId === taskId) {
    throw new AppError(400, "BAD_REQUEST", "A task cannot block itself");
  }

  const task = await Task.findById(taskId).select("projectId boardId").lean();
  if (!task) {
    throw new AppError(404, "NOT_FOUND", "Task not found");
  }

  let blockingTask = await Task.findById(data.blockingTaskId)
    .select("projectId boardId")
    .lean();

  if (!blockingTask) {
    blockingTask = await Task.findOne({ key: data.blockingTaskId, projectId: task.projectId })
      .select("projectId boardId")
      .lean();
  }

  if (!blockingTask) {
    throw new AppError(404, "NOT_FOUND", "Blocking task not found");
  }

  if (task.projectId.toString() !== blockingTask.projectId.toString()) {
    throw new AppError(400, "BAD_REQUEST", "Tasks must be in the same project");
  }

  const membership = await ProjectMember.findOne({
    userId,
    projectId: task.projectId,
  }).lean();

  if (!membership) {
    throw new AppError(403, "FORBIDDEN", "Not a project member");
  }

  const existing = await TaskDependency.findOne({
    projectId: task.projectId,
    blockingTaskId: data.blockingTaskId,
    blockedTaskId: taskId,
  }).lean();

  if (existing) {
    throw new AppError(409, "CONFLICT", "Dependency already exists");
  }

  const dependency = await TaskDependency.create({
    projectId: task.projectId,
    blockingTaskId: data.blockingTaskId,
    blockedTaskId: taskId,
  });

  const populated = await TaskDependency.findById(dependency._id)
    .populate("blockingTaskId", "key title completed")
    .populate("blockedTaskId", "key title completed")
    .lean();

  const result = {
    id: populated!._id.toString(),
    projectId: populated!.projectId.toString(),
    blockingTaskId: populated!.blockingTaskId.toString(),
    blockedTaskId: populated!.blockedTaskId.toString(),
    blockingTask: {
      id: (populated!.blockingTaskId as unknown as { _id: { toString(): string } })._id.toString(),
      key: (populated!.blockingTaskId as unknown as { key: string }).key,
      title: (populated!.blockingTaskId as unknown as { title: string }).title,
      completed: (populated!.blockingTaskId as unknown as { completed: boolean }).completed,
    },
    blockedTask: {
      id: (populated!.blockedTaskId as unknown as { _id: { toString(): string } })._id.toString(),
      key: (populated!.blockedTaskId as unknown as { key: string }).key,
      title: (populated!.blockedTaskId as unknown as { title: string }).title,
      completed: (populated!.blockedTaskId as unknown as { completed: boolean }).completed,
    },
    createdAt: populated!.createdAt,
  };

  const projectId = task.projectId.toString();
  emitToProject(projectId, "dependency:created", { dependency: result });
  return result;
}

export async function deleteDependency(
  dependencyId: string,
  userId: string
) {
  const dependency = await TaskDependency.findById(dependencyId)
    .populate("blockingTaskId", "projectId")
    .populate("blockedTaskId", "projectId")
    .lean();

  if (!dependency) {
    throw new AppError(404, "NOT_FOUND", "Dependency not found");
  }

  const projectId = dependency.projectId.toString();

  const membership = await ProjectMember.findOne({
    userId,
    projectId,
  }).lean();

  if (!membership) {
    throw new AppError(403, "FORBIDDEN", "Not a project member");
  }

  await TaskDependency.findByIdAndDelete(dependencyId);

  const result = {
    id: dependency._id.toString(),
    projectId: dependency.projectId.toString(),
    blockingTaskId: dependency.blockingTaskId.toString(),
    blockedTaskId: dependency.blockedTaskId.toString(),
  };

  emitToProject(projectId, "dependency:deleted", { dependency: result });
  return result;
}
