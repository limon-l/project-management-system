import type { FastifyInstance } from "fastify";
import {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  archiveProject,
  deleteProject,
  getProjectBoard,
  getProjectColumns,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  getTaskLabels,
  createLabel,
  deleteLabel,
} from "../services/index.js";
import { authMiddleware, authorize } from "../middleware/index.js";
import { sendSuccess, sendError, AppError, getRequestUser } from "../utils/helpers.js";

export async function projectRoutes(app: FastifyInstance): Promise<void> {
  // Create project
  app.post(
    "/workspaces/:workspaceId/projects",
    { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as { workspaceId: string };
        const project = await createProject(
          workspaceId,
          getRequestUser(request).userId,
          request.body
        );
        sendSuccess(reply, project, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // List workspace projects
  app.get(
    "/workspaces/:workspaceId/projects",
    { preHandler: [authMiddleware, authorize({ requireWorkspace: true })] },
    async (request, reply) => {
      try {
        const { workspaceId } = request.params as { workspaceId: string };
        const projects = await getWorkspaceProjects(workspaceId);
        sendSuccess(reply, projects);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get project
  app.get(
    "/projects/:projectId",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const project = await getProjectById(projectId);
        sendSuccess(reply, project);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Update project
  app.patch(
    "/projects/:projectId",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const project = await updateProject(projectId, request.body);
        sendSuccess(reply, project);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Archive project
  app.post(
    "/projects/:projectId/archive",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const project = await archiveProject(projectId);
        sendSuccess(reply, project);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Delete project
  app.delete(
    "/projects/:projectId",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        await deleteProject(projectId, getRequestUser(request).userId);
        sendSuccess(reply, { message: "Project deleted" });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get project board
  app.get(
    "/projects/:projectId/board",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const board = await getProjectBoard(projectId);
        sendSuccess(reply, board);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get project columns
  app.get(
    "/projects/:projectId/columns",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const board = await getProjectBoard(projectId);
        const columns = await getProjectColumns(board._id.toString());
        sendSuccess(reply, columns);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get project members
  app.get(
    "/projects/:projectId/members",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const members = await getProjectMembers(projectId);
        sendSuccess(reply, members);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Add project member
  app.post(
    "/projects/:projectId/members",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const member = await addProjectMember(projectId, request.body);
        sendSuccess(reply, member, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message, error.details);
          return;
        }
        throw error;
      }
    }
  );

  // Remove project member
  app.delete(
    "/projects/:projectId/members/:memberId",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId, memberId } = request.params as {
          projectId: string;
          memberId: string;
        };
        await removeProjectMember(projectId, memberId);
        sendSuccess(reply, { message: "Member removed" });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Get project labels
  app.get(
    "/projects/:projectId/labels",
    { preHandler: [authMiddleware, authorize({ requireProject: true })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const labels = await getTaskLabels(projectId);
        sendSuccess(reply, labels);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Create label
  app.post(
    "/projects/:projectId/labels",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { projectId } = request.params as { projectId: string };
        const { name, color } = request.body as { name: string; color: string };
        const label = await createLabel(projectId, name, color);
        sendSuccess(reply, label, 201);
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

  // Delete label
  app.delete(
    "/projects/:projectId/labels/:labelId",
    { preHandler: [authMiddleware, authorize({ requireProject: true, minimumProjectRole: "PROJECT_MANAGER" })] },
    async (request, reply) => {
      try {
        const { labelId } = request.params as { labelId: string };
        await deleteLabel(labelId);
        sendSuccess(reply, { message: "Label deleted" });
      } catch (error) {
        if (error instanceof AppError) {
          sendError(reply, error.statusCode, error.code, error.message);
          return;
        }
        throw error;
      }
    }
  );

}
