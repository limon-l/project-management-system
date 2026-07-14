import type { WorkspaceRole } from "../constants/index.js";

export interface WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMemberResponse {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  joinedAt: string;
}

export interface InvitationResponse {
  id: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "rejected" | "expired" | "cancelled";
  invitedBy: {
    id: string;
    name: string;
  };
  createdAt: string;
  expiresAt: string;
}
