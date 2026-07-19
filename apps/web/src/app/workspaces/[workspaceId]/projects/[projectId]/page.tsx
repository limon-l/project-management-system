"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProject } from "@/hooks/use-projects";
import { useProjectTasks } from "@/hooks/use-tasks";
import { useProjectMembers } from "@/hooks/use-project-members";
import { ProjectLayout } from "@/components/project-layout";
import Link from "next/link";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { workspaceId, projectId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: project } = useProject(workspaceId, projectId);
  const { data: tasks = [] } = useProjectTasks(projectId);
  const { data: members = [] } = useProjectMembers(projectId);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <ProjectLayout
      projectId={projectId}
      workspaceId={workspaceId}
      projectName={project?.name ?? "Project"}
      projectKey={project?.key ?? "PRJ"}
    >
      <div className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">Project Overview</h1>
      </div>
      <div className="p-6 space-y-6">
        {/* Quick stats */}
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold">{totalTasks}</p>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold text-success">{completedTasks}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className={`text-2xl font-bold ${overdueTasks > 0 ? "text-destructive" : ""}`}>
              {overdueTasks}
            </p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-2xl font-bold">{members.length}</p>
            <p className="text-xs text-muted-foreground">Team Members</p>
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold">Progress</h2>
              <span className="text-sm font-bold text-primary">{completionPct}%</span>
            </div>
            <div className="h-2 rounded-full bg-accent overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Project info */}
        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="text-sm font-semibold mb-2">Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className={`font-medium ${
                project?.status === "ACTIVE"
                  ? "text-success"
                  : project?.status === "COMPLETED"
                    ? "text-primary"
                    : project?.status === "ON_HOLD"
                      ? "text-warning"
                      : "text-muted-foreground"
              }`}>
                {project?.status ?? "PLANNING"}
              </span>
            </div>
            {project?.description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Description</span>
                <span className="text-right max-w-xs truncate">{project.description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>
                {project?.createdAt
                  ? new Date(project.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/board`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" x2="9" y1="3" y2="21" />
              <line x1="15" x2="15" y1="3" y2="21" />
            </svg>
            Open Board
          </Link>
          <Link
            href={`/workspaces/${workspaceId}/projects/${projectId}/list`}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" x2="21" y1="6" y2="6" />
              <line x1="8" x2="21" y1="12" y2="12" />
              <line x1="8" x2="21" y1="18" y2="18" />
              <line x1="3" x2="3.01" y1="6" y2="6" />
              <line x1="3" x2="3.01" y1="12" y2="12" />
              <line x1="3" x2="3.01" y1="18" y2="18" />
            </svg>
            List View
          </Link>
        </div>
      </div>
    </ProjectLayout>
  );
}
