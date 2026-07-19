"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
import { ShortcutsPanel } from "./shortcuts-panel";

const CommandPalette = dynamic(
  () => import("./command-palette").then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
);

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/privacy", "/terms"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );
  // Workspace and project pages have their own layout with a sidebar,
  // so we hide the global AppHeader to avoid duplicate navigation chrome.
  const isWorkspacePage = pathname.startsWith("/workspaces/");

  return (
    <>
      {!isPublicPage && !isWorkspacePage && <AppHeader />}
      <main className={isPublicPage ? "min-h-screen" : "min-h-[calc(100vh-56px)]"}>
        {children}
      </main>
      <CommandPalette />
      {!isPublicPage && <ShortcutsPanel />}
    </>
  );
}
