"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { useWorkspaceMembers, type WorkspaceMember } from "@/hooks/use-workspace-members";
import { useWorkspaceRealtime } from "@/hooks/use-realtime";

const ROLE_COLORS: Record<string, string> = {
  WORKSPACE_OWNER: "bg-primary/10 text-primary",
  WORKSPACE_ADMIN: "bg-success/10 text-success",
  PROJECT_MEMBER: "bg-accent text-muted-foreground",
  VIEWER: "bg-accent text-muted-foreground",
};

export default function WorkspaceMembersPage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = use(params);
  const { user, loading } = useAuth();
  const router = useRouter();
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: members = [], isLoading: membersLoading } = useWorkspaceMembers(workspaceId);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("PROJECT_MEMBER");

  useWorkspaceRealtime(workspaceId);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      const { api } = await import("@/lib/utils");
      await api(`/api/workspaces/${workspaceId}/invitations`, {
        method: "POST",
        body: { email: inviteEmail.trim(), role: inviteRole },
      });
      setShowInvite(false);
      setInviteEmail("");
      setInviteRole("PROJECT_MEMBER");
    } catch {
      // error handled by api()
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {members.length} member{members.length !== 1 ? "s" : ""} in {workspace?.name ?? "workspace"}
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" x2="19" y1="8" y2="14" />
            <line x1="22" x2="16" y1="11" y2="11" />
          </svg>
          Invite Member
        </button>
      </div>

      {/* Members list */}
      {membersLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <svg className="h-6 w-6 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          </div>
          <p className="text-sm font-medium">No members yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Invite team members to collaborate on projects.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {(members as WorkspaceMember[]).map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 transition-colors hover:bg-accent/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {member.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {member.name}
                    {member.userId === user.id && (
                      <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    ROLE_COLORS[member.role] ?? "bg-accent text-muted-foreground"
                  }`}
                >
                  {member.role?.replace("_", " ")}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Joined {new Date(member.joinedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowInvite(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="animate-scale-in w-full max-w-lg rounded-2xl border border-border bg-surface p-0 shadow-deep"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-border px-6 py-5">
              <h3 className="text-lg font-semibold">Invite Member</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Send an invitation to join this workspace.
              </p>
            </div>
            <form onSubmit={handleInvite} className="px-6 py-5">
              <label htmlFor="invite-email" className="mb-1.5 block text-sm font-medium">
                Email address
              </label>
              <input
                id="invite-email"
                autoFocus
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="mb-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <label htmlFor="invite-role" className="mb-1.5 block text-sm font-medium">
                Role
              </label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="mb-5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="PROJECT_MEMBER">Member</option>
                <option value="WORKSPACE_ADMIN">Admin</option>
                <option value="VIEWER">Viewer</option>
              </select>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!inviteEmail.trim()}
                  className="btn-ripple inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:shadow-md disabled:opacity-50"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
