import type { TaskResponse, ColumnResponse, CommentResponse } from "./project.js";
import type { ProjectResponse } from "./project.js";
import type { WorkspaceMemberResponse } from "./workspace.js";
import type { NotificationResponse } from "./notification.js";
import type { TaskDependencyResponse } from "./project.js";

export interface ServerToClientEvents {
  "task:created": (payload: { task: TaskResponse; columnId: string }) => void;
  "task:updated": (payload: { task: TaskResponse }) => void;
  "task:moved": (payload: {
    taskId: string;
    fromColumnId: string;
    toColumnId: string;
    position: string;
  }) => void;
  "task:deleted": (payload: { taskId: string; columnId: string }) => void;
  "task:assigned": (payload: {
    taskId: string;
    taskKey: string;
    assigneeId: string;
    assignedBy: { id: string; name: string };
  }) => void;

  "column:created": (payload: { column: ColumnResponse }) => void;
  "column:updated": (payload: { column: ColumnResponse }) => void;
  "column:reordered": (payload: { columns: { id: string; position: string }[] }) => void;
  "column:deleted": (payload: { columnId: string }) => void;

  "comment:created": (payload: { comment: CommentResponse }) => void;
  "comment:updated": (payload: { comment: CommentResponse }) => void;
  "comment:deleted": (payload: { commentId: string; taskId: string }) => void;

  "project:updated": (payload: { project: ProjectResponse }) => void;
  "project:member_added": (payload: {
    projectId: string;
    member: { userId: string; name: string; role: string };
  }) => void;
  "project:member_removed": (payload: {
    projectId: string;
    userId: string;
  }) => void;

  "workspace:member_joined": (payload: {
    member: WorkspaceMemberResponse;
  }) => void;
  "workspace:member_removed": (payload: {
    workspaceId: string;
    userId: string;
  }) => void;

  "notification:created": (payload: { notification: NotificationResponse }) => void;

  "dependency:created": (payload: { dependency: TaskDependencyResponse }) => void;
  "dependency:deleted": (payload: { dependency: { id: string; projectId: string; blockingTaskId: string; blockedTaskId: string } }) => void;
}

export interface ClientToServerEvents {
  "join:project": (payload: { projectId: string }) => void;
  "leave:project": (payload: { projectId: string }) => void;
  "join:workspace": (payload: { workspaceId: string }) => void;
  "leave:workspace": (payload: { workspaceId: string }) => void;
}
