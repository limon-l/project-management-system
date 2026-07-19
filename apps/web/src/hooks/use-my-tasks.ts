"use client";

import { useQuery } from "@tanstack/react-query";
import { apiArray } from "@/lib/utils";

export interface MyTask {
  id: string;
  key: string;
  title: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
  projectId: string;
  assigneeIds: { _id: string; name: string; avatarUrl: string | null }[];
}

export function useMyTasks() {
  return useQuery({
    queryKey: ["myTasks"],
    queryFn: () => apiArray<MyTask>("/api/tasks/my"),
    staleTime: 30_000,
  });
}
