"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useProjects, useCreateProject, type Project } from "@/hooks/use-projects";

export default function WorkspaceProjectsPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: projects = [], isLoading: projectsLoading } = useProjects(workspaceId);
  const createProject = useCreateProject(workspaceId);
  const [showCreate, setShowCreate] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");

  if (loading) {
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectKey.trim()) return;
    createProject.mutate(
      { name: projectName.trim(), key: projectKey.trim().toUpperCase() },
      {
        onSuccess: (project: Project) => {
          setShowCreate(false);
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
    <div className="p-6 space-y-6">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in {workspace?.name ?? "workspace"}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center animate-slide-up">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold">No projects yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first project to start tracking tasks and issues.
          </p>
          <button
            onClick={() => setShowCreate(true)}
            className="btn-ripple mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
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

      {/* Create Project Modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCreate(false)}
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
            <form onSubmit={handleCreate} className="px-6 py-5">
              <label htmlFor="proj-name" className="mb-1.5 block text-sm font-medium">
                Project name
              </label>
              <input
                id="proj-name"
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign, Mobile App"
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <label htmlFor="proj-key" className="mb-1.5 block text-sm font-medium">
                Project key
                <span className="ml-1 font-normal text-muted-foreground">
                  &mdash; used in task IDs
                </span>
              </label>
              <input
                id="proj-key"
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
                  onClick={() => setShowCreate(false)}
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
