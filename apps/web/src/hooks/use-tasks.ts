"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";

export interface TaskAssignee {
  id: string;
  userId: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  projectId: string;
  boardId: string;
  columnId: string;
  position: string;
  key: string;
  title: string;
  description: string | null;
  priority: string;
  creatorId: string;
  assignees: TaskAssignee[];
  labels: TaskLabel[];
  startDate: string | null;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  blockedBy?: string[];
  blocking?: string[];
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
  position: string;
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  author: { id: string; name: string; avatarUrl: string | null };
  content: string;
  edited: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useProjectTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => api<Task[]>(`/api/projects/${projectId}/tasks`),
    enabled: !!projectId,
  });
}

export function useProjectColumns(projectId: string) {
  return useQuery({
    queryKey: ["columns", projectId],
    queryFn: () => api<Column[]>(`/api/projects/${projectId}/columns`),
    enabled: !!projectId,
  });
}

export function useTaskDetail(taskId: string | null) {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => api<Task>(`/api/tasks/${taskId}`),
    enabled: !!taskId,
  });
}

export function useTaskChecklist(taskId: string | null) {
  return useQuery({
    queryKey: ["checklist", taskId],
    queryFn: () => api<ChecklistItem[]>(`/api/tasks/${taskId}/checklist`),
    enabled: !!taskId,
  });
}

export function useTaskComments(taskId: string | null) {
  return useQuery({
    queryKey: ["comments", taskId],
    queryFn: () =>
      api<{ items: Comment[]; total: number }>(
        `/api/tasks/${taskId}/comments`
      ),
    enabled: !!taskId,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      columnId: string;
      priority?: string;
      assigneeIds?: string[];
    }) =>
      api<Task>(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useUpdateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      ...data
    }: {
      taskId: string;
      title?: string;
      description?: string;
      priority?: string;
      dueDate?: string | null;
    }) =>
      api<Task>(`/api/tasks/${taskId}`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useMoveTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      columnId,
      position,
    }: {
      taskId: string;
      columnId: string;
      position: string;
    }) =>
      api<Task>(`/api/tasks/${taskId}/move`, {
        method: "PUT",
        body: { columnId, position },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useDeleteTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      api(`/api/tasks/${taskId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useAddChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) =>
      api<ChecklistItem>(`/api/tasks/${taskId}/checklist`, {
        method: "POST",
        body: { text },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklist", variables.taskId] });
    },
  });
}

export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId,
      ...data
    }: {
      itemId: string;
      text?: string;
      completed?: boolean;
    }) =>
      api<ChecklistItem>(`/api/checklist/${itemId}`, {
        method: "PATCH",
        body: data,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, content }: { taskId: string; content: string }) =>
      api<Comment>(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        body: { content },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.taskId] });
    },
  });
}

export interface TaskDependency {
  id: string;
  projectId: string;
  blockingTaskId: string;
  blockedTaskId: string;
  blockingTask: {
    id: string;
    key: string;
    title: string;
    completed: boolean;
  };
  blockedTask: {
    id: string;
    key: string;
    title: string;
    completed: boolean;
  };
  createdAt: string;
}

export function useTaskDependencies(taskId: string | null) {
  return useQuery({
    queryKey: ["dependencies", taskId],
    queryFn: () => api<{ blocking: TaskDependency[]; blockedBy: TaskDependency[] }>(`/api/tasks/${taskId}/dependencies`),
    enabled: !!taskId,
  });
}

export function useAddDependency(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, blockingTaskId }: { taskId: string; blockingTaskId: string }) =>
      api<TaskDependency>(`/api/tasks/${taskId}/dependencies`, {
        method: "POST",
        body: { blockingTaskId },
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      queryClient.invalidateQueries({ queryKey: ["dependencies", variables.taskId] });
    },
  });
}

export function useDeleteDependency(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dependencyId: string) =>
      api(`/api/dependencies/${dependencyId}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}
