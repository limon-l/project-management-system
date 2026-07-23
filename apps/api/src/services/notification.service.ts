import {
  Notification,
  Task,
  User,
} from "../models/index.js";
import { emitToUser } from "../socket/index.js";

export interface CreateNotificationParams {
  recipientId: string;
  actorId: string | null;
  type: string;
  entityType: string;
  entityId: string;
  projectId?: string;
  workspaceId?: string;
  message: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const notification = await Notification.create({
    recipientId: params.recipientId,
    actorId: params.actorId,
    type: params.type,
    entityType: params.entityType,
    entityId: params.entityId,
    projectId: params.projectId ?? null,
    workspaceId: params.workspaceId ?? null,
    message: params.message,
  });

  const populated = await Notification.findById(notification._id)
    .populate("actorId", "name avatarUrl")
    .lean();

  if (populated) {
    const actor = populated.actorId as unknown as
      | { _id: { toString(): string }; name: string; avatarUrl: string | null }
      | null;

    emitToUser(params.recipientId, "notification:created", {
      notification: {
        id: populated._id.toString(),
        recipientId: populated.recipientId.toString(),
        actorId: actor?._id.toString() ?? null,
        actor: actor
          ? { id: actor._id.toString(), name: actor.name, avatarUrl: actor.avatarUrl }
          : undefined,
        type: populated.type,
        entityType: populated.entityType,
        entityId: populated.entityId,
        projectId: populated.projectId?.toString() ?? null,
        workspaceId: populated.workspaceId?.toString() ?? null,
        message: populated.message,
        read: populated.read,
        createdAt: populated.createdAt,
      },
    });
  }

  return notification;
}

export async function getNotifications(
  userId: string,
  page = 1,
  limit = 20
) {
  const skip = (page - 1) * limit;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find({ recipientId: userId })
      .populate("actorId", "name avatarUrl")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipientId: userId }),
    Notification.countDocuments({ recipientId: userId, read: false }),
  ]);

  const mapped = notifications.map((n) => {
    const actor = n.actorId as unknown as
      | { _id: { toString(): string }; name: string; avatarUrl: string | null }
      | null;
    return {
      id: n._id.toString(),
      recipientId: n.recipientId.toString(),
      actorId: actor?._id.toString() ?? null,
      actor: actor
        ? { id: actor._id.toString(), name: actor.name, avatarUrl: actor.avatarUrl }
        : undefined,
      type: n.type,
      entityType: n.entityType,
      entityId: n.entityId,
      projectId: n.projectId?.toString() ?? null,
      workspaceId: n.workspaceId?.toString() ?? null,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
    };
  });

  return {
    items: mapped,
    total,
    unreadCount,
    page,
    limit,
    hasMore: skip + notifications.length < total,
  };
}

export async function markNotificationsRead(userId: string, notificationIds?: string[]) {
  if (notificationIds && notificationIds.length > 0) {
    await Notification.updateMany(
      { _id: { $in: notificationIds }, recipientId: userId },
      { $set: { read: true } }
    );
  } else {
    await Notification.updateMany(
      { recipientId: userId, read: false },
      { $set: { read: true } }
    );
  }
}

export async function notifyTaskAssignment(
  taskId: string,
  projectId: string,
  workspaceId: string,
  assignerId: string,
  assigneeId: string
) {
  if (assignerId === assigneeId) return;

  const assigner = await User.findById(assignerId).lean();
  const task = await Task.findById(taskId).lean();

  if (!assigner || !task) return;

  await createNotification({
    recipientId: assigneeId,
    actorId: assignerId,
    type: "task_assigned",
    entityType: "task",
    entityId: taskId,
    projectId,
    workspaceId,
    message: `${assigner.name} assigned you to task ${task.key}`,
  });
}

export async function notifyMention(
  mentionedUserId: string,
  actorId: string,
  entityType: string,
  entityId: string,
  projectId: string,
  workspaceId: string,
  context: string
) {
  if (mentionedUserId === actorId) return;

  const actor = await User.findById(actorId).lean();
  if (!actor) return;

  await createNotification({
    recipientId: mentionedUserId,
    actorId,
    type: "mention_in_comment",
    entityType,
    entityId,
    projectId,
    workspaceId,
    message: `${actor.name} mentioned you ${context}`,
  });
}
