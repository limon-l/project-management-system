"use client";

import { useQuery } from "@tanstack/react-query";
import { apiArray } from "@/lib/utils";

export interface MyTask {
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
  assignees: {
    id: string;
    userId: string;
    user: { id: string; name: string; avatarUrl: string | null };
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

export function useMyTasks() {
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: () => apiArray<MyTask>("/api/tasks/my"),
    staleTime: 30_000,
  });
}
