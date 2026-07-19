"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { WorkspaceSidebar } from "@/components/workspace-sidebar";

export default function WorkspaceLayout({
  children,
}: {
  children: ReactNode
} ) {
  const pathname = usePathname();
  // Project pages have their own ProjectLayout with sidebar,
  // so we only show the WorkspaceSidebar for workspace-level pages.
  const isProjectPage = pathname.includes("/projects/");

  if (isProjectPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <WorkspaceSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
