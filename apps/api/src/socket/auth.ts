import type { Socket } from "socket.io";
import { Session, WorkspaceMember, ProjectMember } from "../models/index.js";

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  sessionId?: string;
}

export async function verifySocketSession(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): Promise<void> {
  const cookie = socket.handshake.headers.cookie;
  if (!cookie) {
    return next(new Error("Authentication required"));
  }

  const match = /session=([^;]+)/.exec(cookie);
  if (!match) {
    return next(new Error("Authentication required"));
  }

  const sessionToken = match[1];

  try {
    const session = await Session.findOne({
      token: sessionToken,
      expiresAt: { $gt: new Date() },
    }).lean();

    if (!session) {
      return next(new Error("Invalid or expired session"));
    }

    socket.userId = session.userId.toString();
    socket.sessionId = session._id.toString();
    next();
  } catch {
    next(new Error("Authentication failed"));
  }
}

export async function canAccessProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  const membership = await ProjectMember.findOne({
    userId,
    projectId,
  }).lean();
  return !!membership;
}

export async function canAccessWorkspace(
  userId: string,
  workspaceId: string
): Promise<boolean> {
  const membership = await WorkspaceMember.findOne({
    userId,
    workspaceId,
  }).lean();
  return !!membership;
}
