"use client";

import { useAuth } from "../hooks/use-auth";
import { NotificationBell } from "./notification-bell";
import Link from "next/link";

export function AppHeader() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header
      className="flex items-center justify-between border-b border-border bg-surface/80 px-6 backdrop-blur-md"
      style={{ height: "56px" }}
    >
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            B
          </div>
          <strong className="text-lg font-bold tracking-tight">BoardFlow</strong>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search
          <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd>
        </button>

        <NotificationBell />

        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-foreground">{user.name}</span>
          <button
            onClick={() => { void logout(); }}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
