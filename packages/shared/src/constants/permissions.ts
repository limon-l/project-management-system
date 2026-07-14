import type { WorkspaceRole } from "./index.js";

export type Permission =
  | "workspace:view"
  | "workspace:edit"
  | "workspace:delete"
  | "workspace:invite"
  | "workspace:remove_member"
  | "workspace:change_role"
  | "workspace:transfer_ownership"
  | "workspace:leave"
  | "project:create"
  | "project:view"
  | "project:edit"
  | "project:archive"
  | "project:delete"
  | "project:add_member"
  | "project:remove_member"
  | "board:manage_columns"
  | "task:create"
  | "task:view"
  | "task:edit_any"
  | "task:edit_assigned"
  | "task:delete"
  | "task:assign"
  | "task:move"
  | "task:reorder"
  | "task:set_priority"
  | "task:manage_labels"
  | "comment:create"
  | "comment:edit_own"
  | "comment:delete_own"
  | "comment:delete_any"
  | "attachment:upload"
  | "attachment:delete_own"
  | "attachment:delete_any"
  | "attachment:view"
  | "notification:view"
  | "notification:manage_prefs"
  | "activity:view";

export const WORKSPACE_PERMISSIONS: Record<WorkspaceRole, Permission[]> = {
  WORKSPACE_OWNER: [
    "workspace:view",
    "workspace:edit",
    "workspace:delete",
    "workspace:invite",
    "workspace:remove_member",
    "workspace:change_role",
    "workspace:transfer_ownership",
    "workspace:leave",
    "project:create",
    "project:view",
    "project:edit",
    "project:archive",
    "project:delete",
    "project:add_member",
    "project:remove_member",
    "board:manage_columns",
    "task:create",
    "task:view",
    "task:edit_any",
    "task:delete",
    "task:assign",
    "task:move",
    "task:reorder",
    "task:set_priority",
    "task:manage_labels",
    "comment:create",
    "comment:edit_own",
    "comment:delete_own",
    "comment:delete_any",
    "attachment:upload",
    "attachment:delete_own",
    "attachment:delete_any",
    "attachment:view",
    "notification:view",
    "notification:manage_prefs",
    "activity:view",
  ],
  WORKSPACE_ADMIN: [
    "workspace:view",
    "workspace:edit",
    "workspace:invite",
    "workspace:remove_member",
    "workspace:change_role",
    "workspace:leave",
    "project:create",
    "project:view",
    "project:edit",
    "project:archive",
    "project:delete",
    "project:add_member",
    "project:remove_member",
    "board:manage_columns",
    "task:create",
    "task:view",
    "task:edit_any",
    "task:delete",
    "task:assign",
    "task:move",
    "task:reorder",
    "task:set_priority",
    "task:manage_labels",
    "comment:create",
    "comment:edit_own",
    "comment:delete_own",
    "comment:delete_any",
    "attachment:upload",
    "attachment:delete_own",
    "attachment:delete_any",
    "attachment:view",
    "notification:view",
    "notification:manage_prefs",
    "activity:view",
  ],
  PROJECT_MANAGER: [
    "workspace:view",
    "workspace:leave",
    "project:view",
    "project:edit",
    "project:archive",
    "project:delete",
    "project:add_member",
    "project:remove_member",
    "board:manage_columns",
    "task:create",
    "task:view",
    "task:edit_any",
    "task:delete",
    "task:assign",
    "task:move",
    "task:reorder",
    "task:set_priority",
    "task:manage_labels",
    "comment:create",
    "comment:edit_own",
    "comment:delete_own",
    "comment:delete_any",
    "attachment:upload",
    "attachment:delete_own",
    "attachment:delete_any",
    "attachment:view",
    "notification:view",
    "notification:manage_prefs",
    "activity:view",
  ],
  PROJECT_MEMBER: [
    "workspace:view",
    "workspace:leave",
    "project:view",
    "task:create",
    "task:view",
    "task:edit_assigned",
    "task:move",
    "task:reorder",
    "task:set_priority",
    "comment:create",
    "comment:edit_own",
    "comment:delete_own",
    "attachment:upload",
    "attachment:delete_own",
    "attachment:view",
    "notification:view",
    "notification:manage_prefs",
    "activity:view",
  ],
  VIEWER: [
    "workspace:view",
    "workspace:leave",
    "project:view",
    "task:view",
    "attachment:view",
    "activity:view",
    "comment:create",
    "comment:edit_own",
  ],
};

export function hasPermission(
  role: WorkspaceRole,
  permission: Permission
): boolean {
  const permissions = WORKSPACE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}
