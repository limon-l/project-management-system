import type {
  ApiResponse,
  PaginatedResponse,
  PaginationQuery,
  SearchQuery,
} from "./types/api.js";
import type { UserResponse } from "./types/user.js";
import type {
  WorkspaceResponse,
  WorkspaceMemberResponse,
  InvitationResponse,
} from "./types/workspace.js";
import type {
  ProjectResponse,
  ProjectMemberResponse,
  ColumnResponse,
  TaskResponse,
  ChecklistItemResponse,
  CommentResponse,
  LabelResponse,
  TaskDependencyResponse,
} from "./types/project.js";
import type {
  AttachmentResponse,
  BoardResponse,
} from "./types/attachment.js";
import type { NotificationResponse, ActivityResponse } from "./types/notification.js";
import type {
  CreateLabelInput,
  UpdateLabelInput,
  UpdateNotificationPreferencesInput,
} from "./validation/attachment.js";
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "./validation/auth.js";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  InviteMemberInput,
  UpdateMemberRoleInput,
  RespondInvitationInput,
} from "./validation/workspace.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  AddProjectMemberInput,
  UpdateProjectMemberInput,
} from "./validation/project.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  MoveTaskInput,
  ReorderTaskInput,
  CreateChecklistItemInput,
  UpdateChecklistItemInput,
} from "./validation/task.js";
import type {
  CreateCommentInput,
  UpdateCommentInput,
  CreateColumnInput,
  UpdateColumnInput,
  ReorderColumnsInput,
} from "./validation/board.js";
import type {
  CreateDependencyInput,
  DeleteDependencyInput,
} from "./validation/dependency.js";

// ─── AUTH ────────────────────────────────────────────────────────

export interface AuthContracts {
  "POST /api/auth/register": {
    body: RegisterInput;
    response: ApiResponse<{ user: UserResponse }>;
  };
  "POST /api/auth/login": {
    body: LoginInput;
    response: ApiResponse<{ user: UserResponse }>;
  };
  "POST /api/auth/logout": {
    response: ApiResponse<void>;
  };
  "GET /api/auth/me": {
    response: ApiResponse<{ user: UserResponse }>;
  };
  "POST /api/auth/verify-email": {
    body: { token: string };
    response: ApiResponse<void>;
  };
  "POST /api/auth/forgot-password": {
    body: ForgotPasswordInput;
    response: ApiResponse<void>;
  };
  "POST /api/auth/reset-password": {
    body: ResetPasswordInput;
    response: ApiResponse<void>;
  };
  "PUT /api/auth/profile": {
    body: UpdateProfileInput;
    response: ApiResponse<{ user: UserResponse }>;
  };
  "PUT /api/auth/password": {
    body: ChangePasswordInput;
    response: ApiResponse<void>;
  };
}

// ─── WORKSPACES ──────────────────────────────────────────────────

export interface WorkspaceContracts {
  "POST /api/workspaces": {
    body: CreateWorkspaceInput;
    response: ApiResponse<{ workspace: WorkspaceResponse }>;
  };
  "GET /api/workspaces": {
    query: PaginationQuery;
    response: ApiResponse<PaginatedResponse<WorkspaceResponse>>;
  };
  "GET /api/workspaces/:id": {
    response: ApiResponse<{ workspace: WorkspaceResponse }>;
  };
  "PATCH /api/workspaces/:id": {
    body: UpdateWorkspaceInput;
    response: ApiResponse<{ workspace: WorkspaceResponse }>;
  };
  "DELETE /api/workspaces/:id": {
    response: ApiResponse<void>;
  };
  "GET /api/workspaces/:id/members": {
    response: ApiResponse<{ members: WorkspaceMemberResponse[] }>;
  };
  "POST /api/workspaces/:id/invite": {
    body: InviteMemberInput;
    response: ApiResponse<{ invitation: InvitationResponse }>;
  };
  "PUT /api/workspaces/:id/members/:memberId/role": {
    body: UpdateMemberRoleInput;
    response: ApiResponse<{ member: WorkspaceMemberResponse }>;
  };
  "DELETE /api/workspaces/:id/members/:memberId": {
    response: ApiResponse<void>;
  };
  "POST /api/workspaces/:id/leave": {
    response: ApiResponse<void>;
  };
  "GET /api/invitations/:token": {
    response: ApiResponse<{ invitation: InvitationResponse }>;
  };
  "POST /api/invitations/:token/respond": {
    body: RespondInvitationInput;
    response: ApiResponse<{ workspace: WorkspaceResponse }>;
  };
  "DELETE /api/invitations/:token/cancel": {
    response: ApiResponse<void>;
  };
}

// ─── PROJECTS ────────────────────────────────────────────────────

export interface ProjectContracts {
  "POST /api/workspaces/:workspaceId/projects": {
    body: CreateProjectInput;
    response: ApiResponse<{ project: ProjectResponse }>;
  };
  "GET /api/workspaces/:workspaceId/projects": {
    response: ApiResponse<{ projects: ProjectResponse[] }>;
  };
  "GET /api/projects/:id": {
    response: ApiResponse<{ project: ProjectResponse }>;
  };
  "PUT /api/projects/:id": {
    body: UpdateProjectInput;
    response: ApiResponse<{ project: ProjectResponse }>;
  };
  "DELETE /api/projects/:id": {
    response: ApiResponse<void>;
  };
  "GET /api/projects/:id/members": {
    response: ApiResponse<{ members: ProjectMemberResponse[] }>;
  };
  "POST /api/projects/:id/members": {
    body: AddProjectMemberInput;
    response: ApiResponse<{ member: ProjectMemberResponse }>;
  };
  "PUT /api/projects/:id/members/:memberId": {
    body: UpdateProjectMemberInput;
    response: ApiResponse<{ member: ProjectMemberResponse }>;
  };
  "DELETE /api/projects/:id/members/:memberId": {
    response: ApiResponse<void>;
  };
}

// ─── BOARDS & COLUMNS ────────────────────────────────────────────

export interface BoardContracts {
  "GET /api/projects/:id/board": {
    response: ApiResponse<{ board: BoardResponse }>;
  };
  "POST /api/boards/:boardId/columns": {
    body: CreateColumnInput;
    response: ApiResponse<{ column: ColumnResponse }>;
  };
  "PUT /api/columns/:id": {
    body: UpdateColumnInput;
    response: ApiResponse<{ column: ColumnResponse }>;
  };
  "DELETE /api/columns/:id": {
    query: { moveTasksToColumnId?: string };
    response: ApiResponse<void>;
  };
  "PUT /api/boards/:boardId/columns/reorder": {
    body: ReorderColumnsInput;
    response: ApiResponse<{ columns: ColumnResponse[] }>;
  };
}

// ─── TASKS ───────────────────────────────────────────────────────

export interface TaskContracts {
  "POST /api/columns/:columnId/tasks": {
    body: CreateTaskInput;
    response: ApiResponse<{ task: TaskResponse }>;
  };
  "GET /api/tasks/:id": {
    response: ApiResponse<{ task: TaskResponse }>;
  };
  "PUT /api/tasks/:id": {
    body: UpdateTaskInput;
    response: ApiResponse<{ task: TaskResponse }>;
  };
  "DELETE /api/tasks/:id": {
    response: ApiResponse<void>;
  };
  "PUT /api/tasks/:id/move": {
    body: MoveTaskInput;
    response: ApiResponse<{ task: TaskResponse }>;
  };
  "PUT /api/tasks/:id/reorder": {
    body: ReorderTaskInput;
    response: ApiResponse<{ task: TaskResponse }>;
  };
  "GET /api/tasks/:id/checklist": {
    response: ApiResponse<{ items: ChecklistItemResponse[] }>;
  };
  "POST /api/tasks/:id/checklist": {
    body: CreateChecklistItemInput;
    response: ApiResponse<{ item: ChecklistItemResponse }>;
  };
  "PUT /api/tasks/:taskId/checklist/:itemId": {
    body: UpdateChecklistItemInput;
    response: ApiResponse<{ item: ChecklistItemResponse }>;
  };
  "DELETE /api/tasks/:taskId/checklist/:itemId": {
    response: ApiResponse<void>;
  };
}

// ─── DEPENDENCIES ─────────────────────────────────────────────────

export interface DependencyContracts {
  "GET /api/tasks/:taskId/dependencies": {
    response: ApiResponse<{
      blocking: TaskDependencyResponse[];
      blockedBy: TaskDependencyResponse[];
    }>;
  };
  "POST /api/tasks/:taskId/dependencies": {
    body: CreateDependencyInput;
    response: ApiResponse<{ dependency: TaskDependencyResponse }>;
  };
  "DELETE /api/dependencies/:dependencyId": {
    response: ApiResponse<{ dependency: { id: string; blockingTaskId: string; blockedTaskId: string } }>;
  };
}

// ─── COMMENTS ────────────────────────────────────────────────────

export interface CommentContracts {
  "POST /api/tasks/:taskId/comments": {
    body: CreateCommentInput;
    response: ApiResponse<{ comment: CommentResponse }>;
  };
  "GET /api/tasks/:taskId/comments": {
    query: PaginationQuery;
    response: ApiResponse<PaginatedResponse<CommentResponse>>;
  };
  "PUT /api/comments/:id": {
    body: UpdateCommentInput;
    response: ApiResponse<{ comment: CommentResponse }>;
  };
  "DELETE /api/comments/:id": {
    response: ApiResponse<void>;
  };
}

// ─── LABELS ──────────────────────────────────────────────────────

export interface LabelContracts {
  "GET /api/projects/:id/labels": {
    response: ApiResponse<{ labels: LabelResponse[] }>;
  };
  "POST /api/projects/:id/labels": {
    body: CreateLabelInput;
    response: ApiResponse<{ label: LabelResponse }>;
  };
  "PUT /api/labels/:id": {
    body: UpdateLabelInput;
    response: ApiResponse<{ label: LabelResponse }>;
  };
  "DELETE /api/labels/:id": {
    response: ApiResponse<void>;
  };
}

// ─── ATTACHMENTS ─────────────────────────────────────────────────

export interface AttachmentContracts {
  "GET /api/tasks/:taskId/attachments": {
    response: ApiResponse<{ attachments: AttachmentResponse[] }>;
  };
  "POST /api/tasks/:taskId/attachments": {
    body: Record<string, unknown>; // multipart/form-data
    response: ApiResponse<{ attachment: AttachmentResponse }>;
  };
  "DELETE /api/attachments/:id": {
    response: ApiResponse<void>;
  };
}

// ─── NOTIFICATIONS ───────────────────────────────────────────────

export interface NotificationContracts {
  "GET /api/notifications": {
    query: PaginationQuery & { unreadOnly?: boolean };
    response: ApiResponse<PaginatedResponse<NotificationResponse>>;
  };
  "PUT /api/notifications/:id/read": {
    response: ApiResponse<void>;
  };
  "PUT /api/notifications/read-all": {
    response: ApiResponse<void>;
  };
  "GET /api/notifications/unread-count": {
    response: ApiResponse<{ count: number }>;
  };
  "PUT /api/notifications/preferences": {
    body: UpdateNotificationPreferencesInput;
    response: ApiResponse<void>;
  };
}

// ─── ACTIVITY ────────────────────────────────────────────────────

export interface ActivityContracts {
  "GET /api/projects/:id/activity": {
    query: PaginationQuery;
    response: ApiResponse<PaginatedResponse<ActivityResponse>>;
  };
  "GET /api/workspaces/:id/activity": {
    query: PaginationQuery;
    response: ApiResponse<PaginatedResponse<ActivityResponse>>;
  };
}

// ─── SEARCH ──────────────────────────────────────────────────────

export interface SearchContracts {
  "GET /api/workspaces/:id/search": {
    query: SearchQuery & {
      type?: "tasks" | "projects" | "members";
      assigneeId?: string;
      priority?: string;
      labelId?: string;
      dueDateFrom?: string;
      dueDateTo?: string;
      completed?: boolean;
      columnId?: string;
    };
    response: ApiResponse<{
      tasks?: TaskResponse[];
      projects?: ProjectResponse[];
      members?: { id: string; name: string; avatarUrl: string | null }[];
    }>;
  };
}

// ─── MY WORK ─────────────────────────────────────────────────────

export interface MyWorkContracts {
  "GET /api/tasks/my": {
    response: ApiResponse<TaskResponse[]>;
  };
}
