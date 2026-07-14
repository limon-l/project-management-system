export const SOCKET_EVENTS = {
  // Client → Server
  JOIN_PROJECT: "join:project",
  LEAVE_PROJECT: "leave:project",
  JOIN_WORKSPACE: "join:workspace",
  LEAVE_WORKSPACE: "leave:workspace",

  // Server → Client — Tasks
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_MOVED: "task:moved",
  TASK_DELETED: "task:deleted",
  TASK_ASSIGNED: "task:assigned",

  // Server → Client — Columns
  COLUMN_CREATED: "column:created",
  COLUMN_UPDATED: "column:updated",
  COLUMN_REORDERED: "column:reordered",
  COLUMN_DELETED: "column:deleted",

  // Server → Client — Comments
  COMMENT_CREATED: "comment:created",
  COMMENT_UPDATED: "comment:updated",
  COMMENT_DELETED: "comment:deleted",

  // Server → Client — Projects
  PROJECT_UPDATED: "project:updated",
  PROJECT_MEMBER_ADDED: "project:member_added",
  PROJECT_MEMBER_REMOVED: "project:member_removed",

  // Server → Client — Workspace
  WORKSPACE_MEMBER_JOINED: "workspace:member_joined",
  WORKSPACE_MEMBER_REMOVED: "workspace:member_removed",

  // Server → Client — Notifications
  NOTIFICATION_CREATED: "notification:created",
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
