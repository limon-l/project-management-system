"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/utils";
import type { Workspace } from "./use-workspaces";

export function useWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => api<Workspace>(`/api/workspaces/${workspaceId}`),
    enabled: !!workspaceId && workspaceId !== "undefined",
  });
}
