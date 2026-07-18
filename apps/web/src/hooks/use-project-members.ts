"use client";

import { useQuery } from "@tanstack/react-query";
import { apiArray } from "@/lib/utils";

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  user: { id: string; name: string; avatarUrl: string | null };
  joinedAt: string;
}

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => apiArray<ProjectMember>(`/api/projects/${projectId}/members`),
    enabled: !!projectId,
  });
}
