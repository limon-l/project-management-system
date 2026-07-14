"use client";

import type { ReactNode } from "react";
import { AppHeader } from "./app-header";
import { CommandPalette } from "./command-palette";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <main>{children}</main>
      <CommandPalette />
    </>
  );
}
