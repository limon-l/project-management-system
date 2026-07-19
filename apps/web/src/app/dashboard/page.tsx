"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  useWorkspaces,
  useCreateWorkspace,
  type Workspace,
} from "@/hooks/use-workspaces";
import {
  useProjects,
  useCreateProject,
  type Project,
} from "@/hooks/use-projects";
import Link from "next/link";
import { WorkspaceAnalytics } from "@/components/workspace-analytics";
import { useMyTasks, type MyTask } from "@/hooks/use-my-tasks";
import { useWorkspaceRealtime } from "@/hooks/use-realtime";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "My Work",
    href: "/my-work",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (active: boolean) => (
      <svg
        aria-hidden="true"
        className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-14 items-center border-b border-border px-4">
          <div className="h-5 w-24 animate-pulse rounded bg-accent" />
        </div>
        <div className="space-y-1 p-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 animate-pulse rounded-lg bg-accent" />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-6">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-accent" />
          <div className="h-4 w-40 animate-pulse rounded bg-accent" />
        </div>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-xl border border-border bg-surface"
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { data: workspaces = [], isLoading: workspacesLoading } = useWorkspaces();
  const createWorkspace = useCreateWorkspace();

  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(
    null
  );
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");

  const { data: projects = [], isLoading: projectsLoading } = useProjects(
    selectedWorkspace ?? ""
  );
  const createProject = useCreateProject(selectedWorkspace ?? "");
  const { data: myTasks = [] } = useMyTasks();
  useWorkspaceRealtime(selectedWorkspace ?? undefined);

  const activeTasks = myTasks.filter((t: MyTask) => !t.completed);
  const completedTasks = myTasks.filter((t: MyTask) => t.completed);
  const overdueTasks = myTasks.filter(
    (t: MyTask) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  );

  if (loading) return <LoadingSkeleton />;

  if (!user) {
    router.push("/login");
    return null;
  }

  const selectedWorkspaceData = workspaces.find(
    (w: Workspace) => w.id === selectedWorkspace
  );

  const handleCreateWorkspace = (e: React.FormEvent) => {
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

  const handleCreateProject = (e: React.FormEvent) => {
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
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className="flex w-60 flex-col border-r border-border bg-surface">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            B
          </div>
          <span className="text-sm font-semibold tracking-tight">BoardFlow</span>
        </div>

        {/* Workspace switcher */}
        <div className="border-b border-border px-3 py-3">
          <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <div className="space-y-0.5">
            {workspacesLoading ? (
              <div className="space-y-1">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-8 animate-pulse rounded-lg bg-accent"
                  />
                ))}
              </div>
            ) : (
              workspaces.map((ws: Workspace) => {
                const isActive = selectedWorkspace === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => setSelectedWorkspace(ws.id)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-accent font-medium text-accent-foreground"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold ${
                        isActive
                          ? "bg-primary/15 text-primary"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      {ws.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{ws.name}</span>
                  </button>
                );
              })
            )}
            <button
              onClick={() => setShowCreateWorkspace(true)}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px]">
                +
              </span>
              <span>New workspace</span>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-3">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                {item.icon(isActive)}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <button
              onClick={() => void logout()}
              aria-label="Sign out"
              title="Sign out"
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <svg
                className="h-4 w-4"
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

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Welcome section */}
          <div className="mb-8 animate-fade-in">
            <p className="text-sm text-muted-foreground">{formatDate()}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {getGreeting()}, {user.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {selectedWorkspace
                ? `Working in ${selectedWorkspaceData?.name ?? "workspace"}`
                : "Select or create a workspace to get started."}
            </p>

            {/* Quick actions row */}
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedWorkspace && (
                <button
                  onClick={() => setShowCreateProject(true)}
                  className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
                >
                  <svg
                    className="h-4 w-4"
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
              )}
              <button
                onClick={() => setShowCreateWorkspace(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <path d="M8 2v20" />
                  <path d="M16 2v20" />
                  <path d="M2 12h20" />
                </svg>
                New Workspace
              </button>
            </div>
          </div>

          {/* My Tasks summary */}
          {myTasks.length > 0 && (
            <section className="mb-8 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold tracking-tight">My Tasks</h2>
                <Link
                  href="/my-work"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-muted-foreground">In Progress</span>
                  </div>
                  <p className="text-2xl font-bold">{activeTasks.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-2 w-2 rounded-full bg-success" />
                    <span className="text-xs font-medium text-muted-foreground">Completed</span>
                  </div>
                  <p className="text-2xl font-bold">{completedTasks.length}</p>
                </div>
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-xs font-medium text-muted-foreground">Overdue</span>
                  </div>
                  <p className={`text-2xl font-bold ${overdueTasks.length > 0 ? "text-destructive" : ""}`}>
                    {overdueTasks.length}
                  </p>
                </div>
              </div>
              {activeTasks.length > 0 && (
                <div className="mt-3 rounded-xl border border-border bg-surface divide-y divide-border">
                  {activeTasks.slice(0, 5).map((task: MyTask) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between px-4 py-2.5"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-semibold text-muted-foreground shrink-0">
                          {task.key}
                        </span>
                        <span className="text-sm truncate">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                            task.priority === "URGENT"
                              ? "bg-destructive/10 text-destructive"
                              : task.priority === "HIGH"
                                ? "bg-orange-500/10 text-orange-600"
                                : task.priority === "MEDIUM"
                                  ? "bg-yellow-500/10 text-yellow-600"
                                  : "bg-accent text-muted-foreground"
                          }`}
                        >
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <span className={`text-[11px] ${
                            new Date(task.dueDate) < new Date()
                              ? "text-destructive font-medium"
                              : "text-muted-foreground"
                          }`}>
                            {new Date(task.dueDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Empty state: no workspace selected */}
          {!selectedWorkspace && !workspacesLoading && (
            <div className="animate-slide-up">
              {workspaces.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <svg
                      className="h-8 w-8 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="2" />
                      <path d="M8 2v20" />
                      <path d="M16 2v20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold">
                    No workspaces yet
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Create your first workspace to organize projects, tasks, and
                    collaborate with your team.
                  </p>
                  <button
                    onClick={() => setShowCreateWorkspace(true)}
                    className="btn-ripple mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    <svg
                      className="h-4 w-4"
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
                    Create Workspace
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
                    <svg
                      className="h-8 w-8 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold">
                    Pick a workspace
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                    Select a workspace from the sidebar or create a new one to
                    start managing projects.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {workspaces.map((ws: Workspace) => (
                      <button
                        key={ws.id}
                        onClick={() => setSelectedWorkspace(ws.id)}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:shadow-sm"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-[10px] font-bold text-primary">
                          {ws.name.charAt(0).toUpperCase()}
                        </span>
                        {ws.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Workspace selected: analytics + projects */}
          {selectedWorkspace && (
            <div className="space-y-8">
              <WorkspaceAnalytics workspaceId={selectedWorkspace} />

              {/* Projects section */}
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight">
                    Projects
                  </h2>
                  <button
                    onClick={() => setShowCreateProject(true)}
                    className="btn-ripple inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
                  >
                    <svg
                      className="h-3.5 w-3.5"
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

                {projectsLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-36 animate-pulse rounded-xl border border-border bg-surface"
                      />
                    ))}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                      <svg
                        className="h-6 w-6 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium">No projects yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create your first project to start tracking tasks and
                      issues.
                    </p>
                    <button
                      onClick={() => setShowCreateProject(true)}
                      className="btn-ripple mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
                    >
                      <svg
                        className="h-3.5 w-3.5"
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
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: Project, index: number) => (
                      <Link
                        key={project.id}
                        href={`/workspaces/${selectedWorkspace}/projects/${project.id}/board`}
                        className="card-hover group rounded-xl border border-border bg-surface p-5 transition-all"
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
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
                            {new Date(project.createdAt).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Activity placeholder */}
              <section className="rounded-2xl border border-border bg-surface p-6">
                <h2 className="text-lg font-semibold tracking-tight">
                  Recent Activity
                </h2>
                <div className="mt-4 flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Activity will appear here as your team works on projects.
                  </p>
                </div>
              </section>

              {/* Quick actions grid */}
              <section>
                <h2 className="mb-4 text-lg font-semibold tracking-tight">
                  Quick Actions
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      label: "Create Project",
                      description: "Start a new project",
                      icon: (
                        <svg
                          className="h-5 w-5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                          <line x1="12" x2="12" y1="11" y2="17" />
                          <line x1="9" x2="15" y1="14" y2="14" />
                        </svg>
                      ),
                      onClick: () => setShowCreateProject(true),
                    },
                    {
                      label: "Invite Members",
                      description: "Grow your team",
                      icon: (
                        <svg
                          className="h-5 w-5 text-success"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                      ),
                      onClick: () => router.push("/settings"),
                    },
                    {
                      label: "Board View",
                      description: "Kanban your tasks",
                      icon: (
                        <svg
                          className="h-5 w-5 text-warning"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="9" x2="9" y1="3" y2="21" />
                          <line x1="15" x2="15" y1="3" y2="21" />
                        </svg>
                      ),
                      onClick: () => {
                        if (projects.length > 0)
                          router.push(
                            `/workspaces/${selectedWorkspace}/projects/${projects[0].id}/board`
                          );
                      },
                    },
                    {
                      label: "Settings",
                      description: "Manage workspace",
                      icon: (
                        <svg
                          className="h-5 h-5 text-muted-foreground"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      ),
                      onClick: () => router.push("/settings"),
                    },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className="card-hover flex items-center gap-3 rounded-xl border border-border bg-surface p-4 text-left transition-all"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                        {action.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      {/* ── Create Workspace Modal ── */}
      {showCreateWorkspace && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCreateWorkspace(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="animate-scale-in w-full max-w-lg rounded-2xl border border-border bg-surface p-0 shadow-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-5">
              <h3 className="text-lg font-semibold">Create Workspace</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Workspaces group projects and people together.
              </p>
            </div>
            <form onSubmit={handleCreateWorkspace} className="px-6 py-5">
              <label htmlFor="workspace-name" className="mb-1.5 block text-sm font-medium">
                Workspace name
              </label>
              <input
                id="workspace-name"
                autoFocus
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="e.g. Engineering, Design, Marketing"
                className="mb-5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkspace(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!workspaceName.trim() || createWorkspace.isPending}
                  className="btn-ripple inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-50"
                >
                  {createWorkspace.isPending && (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  )}
                  Create Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Project Modal ── */}
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
              <label htmlFor="project-name" className="mb-1.5 block text-sm font-medium">
                Project name
              </label>
              <input
                id="project-name"
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Website Redesign, Mobile App"
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <label htmlFor="project-key" className="mb-1.5 block text-sm font-medium">
                Project key
                <span className="ml-1 font-normal text-muted-foreground">
                  &mdash; used in task IDs
                </span>
              </label>
              <input
                id="project-key"
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
