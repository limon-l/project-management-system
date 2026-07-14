"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces, useCreateWorkspace, type Workspace } from "@/hooks/use-workspaces";
import { useProjects, useCreateProject, type Project } from "@/hooks/use-projects";
import Link from "next/link";
import { WorkspaceAnalytics } from "@/components/workspace-analytics";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { data: workspaces = [] } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");

  const { data: projects = [] } = useProjects(selectedWorkspace || "");
  const createProject = useCreateProject(selectedWorkspace || "");

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) return;
    createWorkspace.mutate(
      { name: workspaceName.trim() },
      {
        onSuccess: (ws) => {
          setShowCreateWorkspace(false);
          setWorkspaceName("");
          setSelectedWorkspace(ws.id);
        },
      }
    );
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !projectKey.trim()) return;
    createProject.mutate(
      { name: projectName.trim(), key: projectKey.trim().toUpperCase() },
      {
        onSuccess: (project) => {
          setShowCreateProject(false);
          setProjectName("");
          setProjectKey("");
          router.push(
            `/workspaces/${selectedWorkspace}/projects/${project.id}/board`
          );
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-surface">
        <div className="flex h-14 items-center border-b border-border px-4">
          <span className="text-lg font-bold">BoardFlow</span>
        </div>

        {/* Workspace Switcher */}
        <div className="border-b border-border p-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspaces
          </p>
          {workspaces.map((ws: Workspace) => {
            const wsId = ws.id;
            const wsName = ws.name;
            return (
              <button
                key={wsId}
                onClick={() => setSelectedWorkspace(wsId)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                  selectedWorkspace === wsId
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                  {wsName.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{wsName}</span>
              </button>
            );
          })}
          <button
            onClick={() => setShowCreateWorkspace(true)}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            New workspace
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          <Link
            href="/dashboard"
            className="block rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
          >
            Dashboard
          </Link>
        </nav>

        {/* User */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="rounded p-1 text-muted-foreground hover:text-foreground"
              title="Sign out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="flex h-14 items-center border-b border-border px-6">
          <h1 className="text-lg font-semibold">
            {selectedWorkspace
              ?               workspaces.find(
                  (w: Workspace) => w.id === selectedWorkspace
                )?.name || "Dashboard"
              : "Dashboard"}
          </h1>
        </div>

        <div className="p-6">
          {!selectedWorkspace ? (
            <div className="rounded-xl border border-border bg-surface p-8 text-center">
              <h2 className="text-xl font-semibold">
                Welcome, {user.name}!
              </h2>
              <p className="mt-2 text-muted-foreground">
                Create or select a workspace to get started.
              </p>
              <button
                onClick={() => setShowCreateWorkspace(true)}
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create Workspace
              </button>
            </div>
          ) : (
            <div>
              <WorkspaceAnalytics workspaceId={selectedWorkspace} />

              {/* Projects Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Projects</h2>
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                  New Project
                </button>
              </div>

              {/* Projects List */}
              {projects.length === 0 ? (
                <div className="rounded-xl border border-border bg-surface p-8 text-center">
                  <p className="text-muted-foreground">
                    No projects yet. Create your first project to get started.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project: Project) => (
                    <Link
                      key={project.id}
                      href={`/workspaces/${selectedWorkspace}/projects/${project.id}/board`}
                      className="group rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                          {project.key || "PRJ"}
                        </div>
                        <h3 className="text-sm font-semibold group-hover:text-primary">
                          {project.name}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Status: {project.status || "PLANNING"}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Workspace Modal */}
      {showCreateWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowCreateWorkspace(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Create Workspace</h3>
            <form onSubmit={handleCreateWorkspace}>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                autoFocus
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Workspace"
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkspace(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!workspaceName.trim()}
                  className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
          onClick={() => setShowCreateProject(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-lg font-semibold">Create Project</h3>
            <form onSubmit={handleCreateProject}>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My Project"
                className="mb-3 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <label className="mb-1 block text-sm font-medium">
                Key{" "}
                <span className="text-muted-foreground">
                  (2-10 uppercase letters)
                </span>
              </label>
              <input
                value={projectKey}
                onChange={(e) =>
                  setProjectKey(e.target.value.toUpperCase().slice(0, 10))
                }
                placeholder="PRJ"
                maxLength={10}
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-mono outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateProject(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim() || !projectKey.trim()}
                  className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
