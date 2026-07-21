"use client";

import { useQuery } from "@tanstack/react-query";
import { apiArray } from "@/lib/utils";

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  joinedAt: string;
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace-members", workspaceId],
    queryFn: () =>
      apiArray<WorkspaceMember>(
        `/api/workspaces/${workspaceId}/members`
      ),
    enabled: !!workspaceId && workspaceId !== "undefined",
  });
}
