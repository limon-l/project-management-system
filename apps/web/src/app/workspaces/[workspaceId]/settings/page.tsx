"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";

export default function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);

  if (loading || workspaceLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your workspace settings and preferences.
        </p>
      </div>

      {/* Workspace Info */}
      <section className="rounded-xl border border-border bg-surface p-6 animate-slide-up">
        <h2 className="text-sm font-semibold mb-4">Workspace Information</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Name</label>
            <input
              type="text"
              defaultValue={workspace?.name ?? ""}
              readOnly
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug</label>
            <input
              type="text"
              defaultValue={workspace?.slug ?? ""}
              readOnly
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 font-mono text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Description</label>
            <textarea
              defaultValue={workspace?.description ?? ""}
              readOnly
              rows={3}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Your Role</label>
            <input
              type="text"
              defaultValue={workspace?.role?.replace("_", " ") ?? ""}
              readOnly
              className="h-10 w-full rounded-lg border border-border bg-muted/50 px-3 text-sm capitalize"
            />
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      {(workspace?.role === "WORKSPACE_OWNER" || workspace?.role === "WORKSPACE_ADMIN") && (
        <section className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 animate-slide-up">
          <h2 className="text-sm font-semibold text-destructive mb-2">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete this workspace and all its data. This action cannot be undone.
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive opacity-50 cursor-not-allowed"
          >
            Delete Workspace
          </button>
        </section>
      )}
    </div>
  );
}
