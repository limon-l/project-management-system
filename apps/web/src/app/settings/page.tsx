"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces } from "@/hooks/use-workspaces";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: workspaces = [], isLoading, isError } = useWorkspaces();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Account</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review your account and the workspaces you can access.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          Back to dashboard
        </Link>
      </div>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Name</dt>
            <dd className="mt-1 text-sm font-medium">{user?.name ?? "Loading account…"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email</dt>
            <dd className="mt-1 text-sm font-medium">{user?.email ?? "Loading account…"}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-base font-semibold">Workspaces</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a workspace from the dashboard to manage its projects and members.
        </p>
        {isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading workspaces…</p>
        ) : isError ? (
          <p className="mt-4 text-sm text-destructive">Workspaces could not be loaded. Please try again.</p>
        ) : workspaces.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">You do not belong to a workspace yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border">
            {workspaces.map((workspace) => (
              <li key={workspace.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{workspace.name}</p>
                  <p className="text-xs text-muted-foreground">{workspace.role}</p>
                </div>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
