import {
  Project,
  ProjectMember,
  Board,
  Column,
  Task,
  WorkspaceMember,
  Comment,
  Attachment,
  ChecklistItem,
  TaskDependency,
  Notification,
} from "../models/index.js";
import { AppError, validate, slugify, generatePosition } from "../utils/helpers.js";
import {
  createProjectSchema,
  updateProjectSchema,
  addProjectMemberSchema,
  VALID_STATUS_TRANSITIONS,
  DEFAULT_COLUMNS,
  type ProjectStatus,
} from "@boardflow/shared";
import type { ProjectRole } from "@boardflow/shared";
import { emitToProject, emitToWorkspace } from "../socket/index.js";
import { logAudit } from "./audit.service.js";

export async function createProject(
  workspaceId: string,
  userId: string,
  input: unknown
) {
  const data = validate(createProjectSchema, input);
  const slug = slugify(data.name);

  const existing = await Project.findOne({ workspaceId, slug });
  if (existing) {
    throw new AppError(409, "CONFLICT", "Project name already exists in workspace");
  }

  const keyExists = await Project.findOne({ workspaceId, key: data.key });
  if (keyExists) {
    throw new AppError(409, "CONFLICT", "Project key already exists in workspace");
  }

  const project = await Project.create({
    workspaceId,
    name: data.name,
    key: data.key,
    slug,
    description: data.description || null,
    status: "PLANNING",
  });

  const board = await Board.create({
    projectId: project._id,
    name: "Board",
  });

  const columnPromises = DEFAULT_COLUMNS.map((col, index) =>
    Column.create({
      boardId: board._id,
      name: col.name,
      position: generatePosition(index, DEFAULT_COLUMNS.length),
    })
  );
  await Promise.all(columnPromises);

  await ProjectMember.create({
    userId,
    projectId: project._id,
    role: "PROJECT_MANAGER",
  });

  return project.toJSON();
}

export async function getWorkspaceProjects(workspaceId: string) {
  return Project.find({ workspaceId, archived: false })
    .sort({ updatedAt: -1 })
    .lean();
}

export async function getProjectById(projectId: string) {
  const project = await Project.findById(projectId).lean();
  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }
  return project;
}

export async function updateProject(
  projectId: string,
  input: unknown
) {
  const data = validate(updateProjectSchema, input);

  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }

  if (data.status !== undefined) {
    const currentStatus = project.status as ProjectStatus;
    const newStatus = data.status as ProjectStatus;

    if (!VALID_STATUS_TRANSITIONS[currentStatus]?.includes(newStatus)) {
      throw new AppError(
        400,
        "BAD_REQUEST",
        `Cannot transition from ${currentStatus} to ${newStatus}`
      );
    }
    project.status = newStatus;
  }

  if (data.name !== undefined) project.name = data.name;
  if (data.description !== undefined) project.description = data.description;
  if (data.startDate !== undefined) project.startDate = data.startDate;
  if (data.targetDate !== undefined) project.targetDate = data.targetDate;

  await project.save();
  const result = project.toJSON();
  emitToProject(projectId, "project:updated", { project: result });
  return result;
}

export async function archiveProject(projectId: string) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }

  project.status = "ARCHIVED";
  project.archived = true;
  await project.save();
  const result = project.toJSON();
  emitToProject(projectId, "project:updated", { project: result });
  return result;
}

export async function deleteProject(projectId: string, userId?: string) {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new AppError(404, "NOT_FOUND", "Project not found");
  }

  const board = await Board.findOne({ projectId }).lean();
  if (board) {
    const tasks = await Task.find({ boardId: board._id }).lean();
    const taskIds = tasks.map((t) => t._id.toString());

    if (taskIds.length > 0) {
      await Comment.deleteMany({ taskId: { $in: taskIds } });
      await Attachment.deleteMany({ taskId: { $in: taskIds } });
      await ChecklistItem.deleteMany({ taskId: { $in: taskIds } });
      await TaskDependency.deleteMany({
        $or: [
          { blockingTaskId: { $in: taskIds } },
          { blockedTaskId: { $in: taskIds } },
        ],
      });
    }

    await Column.deleteMany({ boardId: board._id });
    await Task.deleteMany({ boardId: board._id });
    await Board.findByIdAndDelete(board._id);
  }

  await ProjectMember.deleteMany({ projectId });
  await Notification.deleteMany({ projectId });
  await Project.findByIdAndDelete(projectId);

  if (userId) {
    logAudit({
      action: "project:deleted",
      actorId: userId,
      resourceType: "project",
      resourceId: projectId,
      details: { workspaceId: project.workspaceId?.toString() },
    });
  }
}

export async function getProjectBoard(projectId: string) {
  const board = await Board.findOne({ projectId }).lean();
  if (!board) {
    throw new AppError(404, "NOT_FOUND", "Board not found");
  }
  return board;
}

export async function getProjectColumns(boardId: string) {
  return Column.find({ boardId }).sort({ position: 1 }).lean();
}

export async function getProjectMembers(projectId: string) {
  const members = await ProjectMember.find({ projectId })
    .populate("userId", "name email avatarUrl")
    .lean();

  return members.map((m) => {
    const user = m.userId as unknown as {
      _id: { toString(): string };
      name: string;
      email: string;
      avatarUrl: string | null;
    };
    return {
      id: m._id.toString(),
      userId: user._id.toString(),
      projectId: m.projectId.toString(),
      role: m.role,
      user: {
        id: user._id.toString(),
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      joinedAt: m.joinedAt,
    };
  });
}

export async function addProjectMember(
  projectId: string,
  input: unknown
) {
  const data = validate(addProjectMemberSchema, input);

  const existing = await ProjectMember.findOne({
    userId: data.userId,
    projectId,
  }).lean();

  if (existing) {
    throw new AppError(409, "CONFLICT", "User is already a project member");
  }

  const member = await ProjectMember.create({
    userId: data.userId,
    projectId,
    role: data.role,
  });

  const user = await (await import("../models/index.js")).User.findById(data.userId).select("name avatarUrl").lean();
  emitToProject(projectId, "project:member_added", {
    projectId,
    member: {
      userId: data.userId,
      name: user?.name ?? "Unknown",
      role: data.role,
    },
  });

  return member.toJSON();
}

export async function updateProjectMemberRole(
  projectId: string,
  memberId: string,
  newRole: ProjectRole
) {
  const member = await ProjectMember.findById(memberId);
  if (!member || member.projectId.toString() !== projectId) {
    throw new AppError(404, "NOT_FOUND", "Member not found");
  }

  member.role = newRole;
  await member.save();

  emitToProject(projectId, "project:member_updated", {
    projectId,
    memberId,
    userId: member.userId.toString(),
    role: newRole,
  });
}

export async function removeProjectMember(projectId: string, memberId: string) {
  const member = await ProjectMember.findById(memberId);
  if (!member || member.projectId.toString() !== projectId) {
    throw new AppError(404, "NOT_FOUND", "Member not found");
  }

  const projectManagerCount = await ProjectMember.countDocuments({
    projectId,
    role: "PROJECT_MANAGER",
  });

  if (member.role === "PROJECT_MANAGER" && projectManagerCount <= 1) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Cannot remove the last project manager"
    );
  }

  const userId = member.userId.toString();
  await ProjectMember.findByIdAndDelete(memberId);
  emitToProject(projectId, "project:member_removed", { projectId, userId });
}
