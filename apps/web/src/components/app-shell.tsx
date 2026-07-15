"use client";

import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { CommandPalette } from "./command-palette";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100vh-56px)]">{children}</main>
      <CommandPalette />
    </>
  );
}
