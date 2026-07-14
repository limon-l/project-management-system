export interface NotificationResponse {
  id: string;
  recipientId: string;
  actorId: string | null;
  actor?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  type: string;
  entityType: string;
  entityId: string;
  projectId: string | null;
  workspaceId: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityResponse {
  id: string;
  actorId: string;
  actor: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  actionType: string;
  entityType: string;
  entityId: string;
  projectId: string;
  workspaceId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export const NOTIFICATION_TYPES = {
  WORKSPACE_INVITATION: "workspace_invitation",
  WORKSPACE_INVITATION_ACCEPTED: "workspace_invitation_accepted",
  WORKSPACE_MEMBER_JOINED: "workspace_member_joined",
  WORKSPACE_MEMBER_REMOVED: "workspace_member_removed",
  TASK_ASSIGNED: "task_assigned",
  TASK_UNASSIGNED: "task_unassigned",
  TASK_PRIORITY_CHANGED: "task_priority_changed",
  TASK_MOVED: "task_moved",
  TASK_COMPLETED: "task_completed",
  TASK_OVERDUE: "task_overdue",
  COMMENT_ADDED: "comment_added",
  MENTION_IN_COMMENT: "mention_in_comment",
  MENTION_IN_TASK: "mention_in_task",
  PROJECT_ROLE_CHANGED: "project_role_changed",
} as const;

export const ACTIVITY_ACTION_TYPES = {
  PROJECT_CREATED: "project_created",
  PROJECT_UPDATED: "project_updated",
  PROJECT_ARCHIVED: "project_archived",
  MEMBER_ADDED: "member_added",
  MEMBER_REMOVED: "member_removed",
  TASK_CREATED: "task_created",
  TASK_UPDATED: "task_updated",
  TASK_MOVED: "task_moved",
  TASK_DELETED: "task_deleted",
  TASK_ASSIGNED: "task_assigned",
  TASK_UNASSIGNED: "task_unassigned",
  PRIORITY_CHANGED: "priority_changed",
  DUE_DATE_CHANGED: "due_date_changed",
  COMMENT_ADDED: "comment_added",
  COMMENT_DELETED: "comment_deleted",
  ATTACHMENT_UPLOADED: "attachment_uploaded",
  ATTACHMENT_DELETED: "attachment_deleted",
  COLUMN_CREATED: "column_created",
  COLUMN_UPDATED: "column_updated",
  COLUMN_DELETED: "column_deleted",
} as const;
