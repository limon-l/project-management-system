export const ROLES = {
  WORKSPACE_OWNER: "WORKSPACE_OWNER",
  WORKSPACE_ADMIN: "WORKSPACE_ADMIN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  PROJECT_MEMBER: "PROJECT_MEMBER",
  VIEWER: "VIEWER",
} as const;

export type WorkspaceRole = (typeof ROLES)[keyof typeof ROLES];
export type ProjectRole = (typeof ROLES)[keyof typeof ROLES];

export const WORKSPACE_ROLES: WorkspaceRole[] = [
  ROLES.WORKSPACE_OWNER,
  ROLES.WORKSPACE_ADMIN,
];

export const PROJECT_ROLES: ProjectRole[] = [
  ROLES.PROJECT_MANAGER,
  ROLES.PROJECT_MEMBER,
  ROLES.VIEWER,
];

export const ROLE_HIERARCHY: Record<WorkspaceRole, number> = {
  WORKSPACE_OWNER: 100,
  WORKSPACE_ADMIN: 80,
  PROJECT_MANAGER: 60,
  PROJECT_MEMBER: 40,
  VIEWER: 20,
};

export const PROJECT_STATUSES = {
  PLANNING: "PLANNING",
  ACTIVE: "ACTIVE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];

export const VALID_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  PLANNING: ["ACTIVE", "ON_HOLD", "ARCHIVED"],
  ACTIVE: ["ON_HOLD", "COMPLETED", "ARCHIVED"],
  ON_HOLD: ["ACTIVE", "ARCHIVED"],
  COMPLETED: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: ["ACTIVE"],
};

export const TASK_PRIORITIES = {
  URGENT: "URGENT",
  HIGH: "HIGH",
  MEDIUM: "MEDIUM",
  LOW: "LOW",
  NO_PRIORITY: "NO_PRIORITY",
} as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[keyof typeof TASK_PRIORITIES];

export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  NO_PRIORITY: 4,
};

export const DEFAULT_COLUMNS = [
  { name: "Backlog", position: 0 },
  { name: "To Do", position: 1 },
  { name: "In Progress", position: 2 },
  { name: "Review", position: 3 },
  { name: "Done", position: 4 },
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export * from "./permissions.js";
export * from "./activity.js";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "application/pdf",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/gzip",
  "text/csv",
  "application/json",
] as const;
