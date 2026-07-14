import type { ProjectStatus, ProjectRole, TaskPriority } from "../constants/index.js";

export interface ProjectResponse {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  startDate: string | null;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMemberResponse {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  joinedAt: string;
}

export interface ColumnResponse {
  id: string;
  boardId: string;
  name: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskResponse {
  id: string;
  projectId: string;
  boardId: string;
  columnId: string;
  position: string;
  key: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  creatorId: string;
  assignees: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  }[];
  labels: {
    id: string;
    name: string;
    color: string;
  }[];
  startDate: string | null;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItemResponse {
  id: string;
  taskId: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
  position: string;
}

export interface CommentResponse {
  id: string;
  taskId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  content: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LabelResponse {
  id: string;
  projectId: string;
  name: string;
  color: string;
}
