"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProjectLayoutProps {
  children: React.ReactNode;
  projectId: string;
  workspaceId: string;
  projectName: string;
  projectKey: string;
}

const navItems = [
  { label: "Overview", suffix: "" },
  { label: "Board", suffix: "/board" },
  { label: "Analytics", suffix: "/analytics" },
  { label: "Members", suffix: "/members" },
  { label: "Activity", suffix: "/activity" },
  { label: "Settings", suffix: "/settings" },
];

export function ProjectLayout({
  children,
  projectId,
  workspaceId,
  projectName,
  projectKey,
}: ProjectLayoutProps) {
  const pathname = usePathname();
  const basePath = `/workspaces/${workspaceId}/projects/${projectId}`;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-foreground"
          >
            BoardFlow
          </Link>
        </div>

        {/* Workspace name */}
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
        </div>

        {/* Project header */}
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
              {projectKey}
            </div>
            <span className="truncate text-sm font-semibold">{projectName}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => {
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
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to dashboard */}
        <div className="border-t border-border p-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
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
              <line x1="19" x2="5" y1="12" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
