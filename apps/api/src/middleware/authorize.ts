import type { FastifyRequest, FastifyReply } from "fastify";
import {
  WorkspaceMember,
  ProjectMember,
  type WorkspaceRole,
} from "../models/index.js";
import { sendError, isValidObjectId } from "../utils/helpers.js";
import { ROLE_HIERARCHY, ERROR_CODES } from "@boardflow/shared";

type RoleName = WorkspaceRole | string;

interface AuthorizationOptions {
  requireWorkspace?: boolean;
  requireProject?: boolean;
  minimumWorkspaceRole?: RoleName;
  minimumProjectRole?: RoleName;
}

function hasRoleHierarchy(userRole: RoleName, requiredRole: RoleName): boolean {
  const h = ROLE_HIERARCHY as Record<string, number>;
  return (h[userRole] ?? 0) >= (h[requiredRole] ?? 0);
}

export function authorize(options: AuthorizationOptions) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const userId = request.user?.userId;

    if (!userId) {
      sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
      return;
    }

    if (options.requireWorkspace) {
      const workspaceId = (request.params as Record<string, string>).workspaceId;

      if (!workspaceId) {
        sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Workspace ID required");
        return;
      }

      if (!isValidObjectId(workspaceId)) {
        sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Invalid workspace ID");
        return;
      }

      const membership = await WorkspaceMember.findOne({
        userId,
        workspaceId,
      }).lean();

      if (!membership) {
        sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a workspace member");
        return;
      }

      (request as FastifyRequest & { workspaceRole: RoleName }).workspaceRole =
        membership.role;

      if (
        options.minimumWorkspaceRole &&
        !hasRoleHierarchy(membership.role, options.minimumWorkspaceRole)
      ) {
        sendError(
          reply,
          403,
          ERROR_CODES.FORBIDDEN,
          `Requires at least ${options.minimumWorkspaceRole} role`
        );
        return;
      }
    }

    if (options.requireProject) {
      const projectId = (request.params as Record<string, string>).projectId;

      if (!projectId) {
        sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Project ID required");
        return;
      }

      if (!isValidObjectId(projectId)) {
        sendError(reply, 400, ERROR_CODES.BAD_REQUEST, "Invalid project ID");
        return;
      }

      const membership = await ProjectMember.findOne({
        userId,
        projectId,
      }).lean();

      if (!membership) {
        sendError(reply, 403, ERROR_CODES.FORBIDDEN, "Not a project member");
        return;
      }

      (request as FastifyRequest & { projectRole: RoleName }).projectRole =
        membership.role;

      if (
        options.minimumProjectRole &&
        !hasRoleHierarchy(membership.role, options.minimumProjectRole)
      ) {
        sendError(
          reply,
          403,
          ERROR_CODES.FORBIDDEN,
          `Requires at least ${options.minimumProjectRole} role in project`
        );
        return;
      }
    }
  };
}
