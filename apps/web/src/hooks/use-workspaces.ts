"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiArray } from "@/lib/utils";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: () => apiArray<Workspace>("/api/workspaces"),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api<Workspace>("/api/workspaces", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
