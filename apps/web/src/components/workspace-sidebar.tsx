"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces, type Workspace } from "@/hooks/use-workspaces";
import { useWorkspace } from "@/hooks/use-workspace";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Overview",
    suffix: "",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Projects",
    suffix: "/projects",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Members",
    suffix: "/members",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Settings",
    suffix: "/settings",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const BOTTOM_NAV = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "My Tasks",
    href: "/my-work",
    icon: (active: boolean) => (
      <svg aria-hidden="true" className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
];

export function WorkspaceSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: workspaces = [] } = useWorkspaces();

  const basePath = `/workspaces/${workspaceId}`;

  return (
    <aside className="flex w-60 flex-shrink-0 flex-col border-r border-border bg-surface">
      {/* Logo + Workspace name */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            B
          </div>
          <span className="text-sm font-semibold tracking-tight">BoardFlow</span>
        </Link>
      </div>

      {/* Workspace switcher */}
      <div className="border-b border-border px-3 py-3">
        <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <div className="space-y-0.5">
          {workspaces.map((ws: Workspace) => {
            const isActive = ws.id === workspaceId;
            return (
              <Link
                key={ws.id}
                href={`/workspaces/${ws.id}`}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-accent text-muted-foreground"
                  )}
                >
                  {ws.name.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{ws.name}</span>
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px]">
              +
            </span>
            <span>New workspace</span>
          </Link>
        </div>
      </div>

      {/* Workspace info */}
      {workspace && (
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
              {workspace.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{workspace.name}</p>
              <p className="truncate text-[11px] text-muted-foreground capitalize">
                {workspace.role?.replace("_", " ").toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 p-2">
        {NAV_ITEMS.map((item) => {
          const href = `${basePath}${item.suffix}`;
          const isActive =
            item.suffix === ""
              ? pathname === basePath
              : pathname.startsWith(href);

          return (
            <Link
              key={item.suffix}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon(isActive)}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="border-t border-border p-2">
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon(isActive)}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User profile */}
      {user && (
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
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
