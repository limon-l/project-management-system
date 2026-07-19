"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects, useCreateProject, type Project } from "@/hooks/use-projects";
import { useWorkspaceMembers, type WorkspaceMember } from "@/hooks/use-workspace-members";
import { useWorkspaceRealtime } from "@/hooks/use-realtime";
import { WorkspaceAnalytics } from "@/components/workspace-analytics";

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-accent" />
        <div className="h-4 w-64 animate-pulse rounded bg-accent" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}

export default function WorkspaceOverviewPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: workspace, isLoading: workspaceLoading } = useWorkspace(workspaceId);
  const { data: projects = [], isLoading: projectsLoading } = useProjects(workspaceId);
  const { data: members = [] } = useWorkspaceMembers(workspaceId);
  const createProject = useCreateProject(workspaceId);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");

  useWorkspaceRealtime(workspaceId);

  if (loading || workspaceLoading) return <LoadingSkeleton />;

  if (!user) {
    router.push("/login");
    return null;
  }

  if (!workspace) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <svg className="h-8 w-8 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" x2="9" y1="9" y2="15" />
            <line x1="9" x2="15" y1="9" y2="15" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Workspace not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This workspace may have been deleted or you don&apos;t have access.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectKey.trim()) return;
    createProject.mutate(
      { name: projectName.trim(), key: projectKey.trim().toUpperCase() },
      {
        onSuccess: (project: Project) => {
          setShowCreateProject(false);
          setProjectName("");
          setProjectKey("");
          router.push(
            `/workspaces/${workspaceId}/projects/${project.id}/board`
          );
        },
      }
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                {workspace.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {workspace.name}
                </h1>
                {workspace.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {workspace.description}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateProject(true)}
              className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19" />
                <line x1="5" x2="19" y1="12" y2="12" />
              </svg>
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="animate-slide-up">
        <WorkspaceAnalytics workspaceId={workspaceId} />
      </div>

      {/* Projects */}
      <section className="animate-slide-up">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Projects</h2>
          <button
            onClick={() => setShowCreateProject(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-accent"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            New Project
          </button>
        </div>

        {projectsLoading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 animate-pulse rounded-xl border border-border bg-surface" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <svg className="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium">No projects yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create your first project to start tracking tasks.
            </p>
            <button
              onClick={() => setShowCreateProject(true)}
              className="btn-ripple mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" x2="12" y1="5" y2="19" />
                <line x1="5" x2="19" y1="12" y2="12" />
              </svg>
              New Project
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: Project, index: number) => (
              <Link
                key={project.id}
                href={`/workspaces/${workspaceId}/projects/${project.id}/board`}
                className="card-hover group rounded-xl border border-border bg-surface p-5 transition-all"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary transition-colors group-hover:bg-primary/15">
                      {project.key ?? "PRJ"}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {project.description
                          ? project.description.slice(0, 60)
                          : "No description"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      project.status === "ACTIVE"
                        ? "bg-success/10 text-success"
                        : project.status === "COMPLETED"
                          ? "bg-primary/10 text-primary"
                          : project.status === "ON_HOLD"
                            ? "bg-warning/10 text-warning"
                            : "bg-accent text-muted-foreground"
                    }`}
                  >
                    {project.status ?? "PLANNING"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Team Members */}
      {members.length > 0 && (
        <section className="animate-slide-up">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Team Members</h2>
            <Link
              href={`/workspaces/${workspaceId}/members`}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex flex-wrap gap-3">
              {(members as WorkspaceMember[]).slice(0, 8).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {member.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground capitalize">
                      {member.role?.replace("_", " ").toLowerCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="animate-slide-up">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Create Project",
              description: "Start a new project",
              href: "#",
              onClick: () => setShowCreateProject(true),
              icon: (
                <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  <line x1="12" x2="12" y1="11" y2="17" />
                  <line x1="9" x2="15" y1="14" y2="14" />
                </svg>
              ),
            },
            {
              label: "Invite Members",
              description: "Grow your team",
              href: `/workspaces/${workspaceId}/members`,
              icon: (
                <svg className="h-5 w-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg>
              ),
            },
            {
              label: "My Tasks",
              description: "View your tasks",
              href: "/my-work",
              icon: (
                <svg className="h-5 w-5 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
            },
            {
              label: "Settings",
              description: "Manage workspace",
              href: `/workspaces/${workspaceId}/settings`,
              icon: (
                <svg className="h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              ),
            },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              onClick={action.onClick}
              className="card-hover flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCreateProject(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="animate-scale-in w-full max-w-lg rounded-2xl border border-border bg-surface p-0 shadow-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-5">
              <h3 className="text-lg font-semibold">Create Project</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Projects track issues, tasks, and milestones.
              </p>
            </div>
            <form onSubmit={handleCreateProject} className="px-6 py-5">
              <label htmlFor="ws-project-name" className="mb-1.5 block text-sm font-medium">
                Project name
              </label>
              <input
                id="ws-project-name"
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign, Mobile App"
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <label htmlFor="ws-project-key" className="mb-1.5 block text-sm font-medium">
                Project key
                <span className="ml-1 font-normal text-muted-foreground">
                  &mdash; used in task IDs
                </span>
              </label>
              <input
                id="ws-project-key"
                value={projectKey}
                onChange={(e) =>
                  setProjectKey(e.target.value.toUpperCase().slice(0, 10))
                }
                placeholder="e.g. WRD, MBL"
                maxLength={10}
                className="mb-5 h-10 w-full rounded-lg border border-border bg-background px-3 font-mono text-sm uppercase outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !projectName.trim() ||
                    !projectKey.trim() ||
                    createProject.isPending
                  }
                  className="btn-ripple inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-50"
                >
                  {createProject.isPending && (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  )}
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
