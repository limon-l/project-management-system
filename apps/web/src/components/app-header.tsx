"use client";

import { useAuth } from "../hooks/use-auth";
import { NotificationBell } from "./notification-bell";

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header
      className="flex items-center justify-between border-b border-border px-6"
      style={{ height: "56px" }}
    >
      <div className="flex items-center gap-2">
        <strong className="text-lg font-bold">BoardFlow</strong>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs">⌘K</kbd>
        </button>

        <NotificationBell />

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{user.name}</span>
          <button
            onClick={logout}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
