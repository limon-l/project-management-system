"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/utils";

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
      api<Project[]>(`/api/workspaces/${String(workspaceId)}/projects`),
    enabled: !!workspaceId,
  });
}

export function useProject(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: ["project", workspaceId, projectId],
    queryFn: () =>
      api<Project>(`/api/projects/${String(projectId)}`),
    enabled: !!projectId,
  });
}

export function useCreateProject(workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; key: string; description?: string }) =>
      api<Project>(`/api/workspaces/${String(workspaceId)}/projects`, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", workspaceId] });
    },
  });
}
