import type { FastifyRequest, FastifyReply } from "fastify";
import { Task, ProjectMember } from "../models/index.js";
import { sendError } from "../utils/helpers.js";
import { ERROR_CODES } from "@boardflow/shared";

export async function requireTaskAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
    return;
  }

  const params = request.params as Record<string, string>;
  const taskId = params.taskId || params.itemId;

  if (!taskId) {
    sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Task ID required");
    return;
  }

  const task = await Task.findById(taskId).select("projectId").lean();
  if (!task) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Task not found");
    return;
  }

  const membership = await ProjectMember.findOne({
    userId,
    projectId: task.projectId,
  }).lean();

  if (!membership) {
    sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a project member");
    return;
  }
}

export async function requireCommentAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
    return;
  }

  const { commentId } = request.params as { commentId: string };

  if (!commentId) {
    sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Comment ID required");
    return;
  }

  const { Comment, Task, ProjectMember } = await import("../models/index.js");
  const comment = await Comment.findById(commentId).select("taskId authorId").lean();
  if (!comment) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Comment not found");
    return;
  }

  const task = await Task.findById(comment.taskId).select("projectId").lean();
  if (!task) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Task not found");
    return;
  }

  const membership = await ProjectMember.findOne({
    userId,
    projectId: task.projectId,
  }).lean();

  if (!membership) {
    sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a project member");
    return;
  }
}

export async function requireAttachmentAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
    return;
  }

  const { id } = request.params as { id: string };

  if (!id) {
    sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Attachment ID required");
    return;
  }

  const { Attachment, Task, ProjectMember } = await import("../models/index.js");
  const attachment = await Attachment.findById(id).select("taskId").lean();
  if (!attachment) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Attachment not found");
    return;
  }

  const task = await Task.findById(attachment.taskId).select("projectId").lean();
  if (!task) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Task not found");
    return;
  }

  const membership = await ProjectMember.findOne({
    userId,
    projectId: task.projectId,
  }).lean();

  if (!membership) {
    sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a project member");
    return;
  }
}

export async function requireChecklistItemAccess(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const userId = request.user?.userId;
  if (!userId) {
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
    return;
  }

  const { itemId } = request.params as { itemId: string };

  if (!itemId) {
    sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Checklist item ID required");
    return;
  }

  const { ChecklistItem, Task, ProjectMember } = await import("../models/index.js");
  const item = await ChecklistItem.findById(itemId).select("taskId").lean();
  if (!item) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Checklist item not found");
    return;
  }

  const task = await Task.findById(item.taskId).select("projectId").lean();
  if (!task) {
    sendError(reply, 404, ERROR_CODES.NOT_FOUND, "Task not found");
    return;
  }

  const membership = await ProjectMember.findOne({
    userId,
    projectId: task.projectId,
  }).lean();

  if (!membership) {
    sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a project member");
    return;
  }
}
