"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiArray } from "@/lib/utils";

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  status: string;
  startDate: string | null;
  targetDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useProjects(workspaceId: string) {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () =>
      apiArray<Project>(`/api/workspaces/${workspaceId}/projects`),
    enabled: !!workspaceId,
  });
}

export function useProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () =>
      api<Project>(`/api/projects/${projectId}`),
    enabled: !!projectId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; key: string; description?: string }) =>
      api<Project>(`/api/workspaces/${workspaceId}/projects`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
