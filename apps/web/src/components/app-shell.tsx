"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "./app-header";
import { CommandPalette } from "./command-palette";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => route === pathname || pathname.startsWith(route + "/")
  );

  return (
    <>
      {!isPublicPage && <AppHeader />}
      <main className={isPublicPage ? "min-h-screen" : "min-h-[calc(100vh-56px)]"}>
        {children}
      </main>
      <CommandPalette />
    </>
  );
}
