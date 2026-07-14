import type { FastifyInstance } from "fastify";
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceBySlug,
  updateWorkspace,
  getWorkspaceMembers,
  inviteMember,
  getWorkspaceInvitations,
  respondToInvitation,
  removeMember,
  changeMemberRole,
} from "../services/index.js";
import { authMiddleware, authorize } from "../middleware/index.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";

export async function workspaceRoutes(app: FastifyInstance): Promise<void> {
  // Create workspace
  app.post("/", { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const workspace = await createWorkspace(request.user!.userId, request.body);
      sendSuccess(reply, workspace, 201);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  // List user's workspaces
  app.get("/", { preHandler: [authMiddleware] }, async (request, reply) => {
    const workspaces = await getUserWorkspaces(request.user!.userId);
    sendSuccess(reply, workspaces);
  });

  // Get workspace by slug
  app.get("/:workspaceId", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    try {
      const { workspaceId } = request.params as { workspaceId: string };
      const workspace = await getWorkspaceBySlug(workspaceId);
      sendSuccess(reply, workspace);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });

  // Update workspace
  app.patch("/:workspaceId", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    try {
      const { workspaceId } = request.params as { workspaceId: string };
      const workspace = await updateWorkspace(workspaceId, request.user!.userId, request.body);
      sendSuccess(reply, workspace);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  // List workspace members
  app.get("/:workspaceId/members", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const members = await getWorkspaceMembers(workspaceId);
    sendSuccess(reply, members);
  });

  // Invite member
  app.post("/:workspaceId/invitations", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    try {
      const { workspaceId } = request.params as { workspaceId: string };
      const invitation = await inviteMember(workspaceId, request.user!.userId, request.body);
      sendSuccess(reply, invitation, 201);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  // List invitations
  app.get("/:workspaceId/invitations", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    const { workspaceId } = request.params as { workspaceId: string };
    const invitations = await getWorkspaceInvitations(workspaceId);
    sendSuccess(reply, invitations);
  });

  // Respond to invitation
  app.post("/invitations/:invitationId/respond", { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const { invitationId } = request.params as { invitationId: string };
      const result = await respondToInvitation(invitationId, request.user!.userId, request.body);
      sendSuccess(reply, result);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  // Remove member
  app.delete("/:workspaceId/members/:memberId", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    try {
      const { workspaceId, memberId } = request.params as { workspaceId: string; memberId: string };
      await removeMember(workspaceId, memberId, request.user!.userId);
      sendSuccess(reply, { message: "Member removed" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });

  // Change member role
  app.patch("/:workspaceId/members/:memberId/role", { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] }, async (request, reply) => {
    try {
      const { workspaceId, memberId } = request.params as { workspaceId: string; memberId: string };
      const { role } = request.body as { role: string };
      await changeMemberRole(workspaceId, memberId, role as "WORKSPACE_ADMIN" | "PROJECT_MEMBER" | "VIEWER", request.user!.userId);
      sendSuccess(reply, { message: "Role updated" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });
}
