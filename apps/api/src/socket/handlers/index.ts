import type { Server } from "socket.io";
import type { AuthenticatedSocket } from "../auth.js";

export function registerHandlers(io: Server): void {
  io.on("connection", (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;

    // Auto-join personal notification room
    socket.join(`user:${userId}`);

    socket.on("join:workspace", async (payload: { workspaceId: string }) => {
      const { canAccessWorkspace } = await import("../auth.js");
      const hasAccess = await canAccessWorkspace(userId, payload.workspaceId);
      if (hasAccess) {
        socket.join(`workspace:${payload.workspaceId}`);
      }
    });

    socket.on("leave:workspace", (payload: { workspaceId: string }) => {
      socket.leave(`workspace:${payload.workspaceId}`);
    });

    socket.on("join:project", async (payload: { projectId: string }) => {
      const { canAccessProject } = await import("../auth.js");
      const hasAccess = await canAccessProject(userId, payload.projectId);
      if (hasAccess) {
        socket.join(`project:${payload.projectId}`);
      }
    });

    socket.on("leave:project", (payload: { projectId: string }) => {
      socket.leave(`project:${payload.projectId}`);
    });

    socket.on("disconnect", () => {
      // Cleanup handled by Socket.IO automatically
    });
  });
}
