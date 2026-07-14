import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { workspaceRoutes } from "./workspace.routes.js";
import { projectRoutes } from "./project.routes.js";
import { taskRoutes } from "./task.routes.js";
import { commentRoutes } from "./comment.routes.js";
import { notificationRoutes } from "./notification.routes.js";
import { searchRoutes } from "./search.routes.js";
import { myWorkRoutes } from "./my-work.routes.js";
import { attachmentRoutes } from "./attachment.routes.js";
import { analyticsRoutes } from "./analytics.routes.js";
import { dependencyRoutes } from "./dependency.routes.js";

export async function registerRoutes(app: FastifyInstance): Promise<void> {
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(workspaceRoutes, { prefix: "/api/workspaces" });
  await app.register(projectRoutes, { prefix: "/api" });
  await app.register(taskRoutes, { prefix: "/api" });
  await app.register(commentRoutes, { prefix: "/api" });
  await app.register(notificationRoutes, { prefix: "/api/notifications" });
  await app.register(searchRoutes, { prefix: "/api" });
  await app.register(myWorkRoutes, { prefix: "/api" });
  await app.register(attachmentRoutes, { prefix: "/api" });
  await app.register(analyticsRoutes, { prefix: "/api" });
  await app.register(dependencyRoutes, { prefix: "/api" });

  // Serve uploaded files in development
  if (process.env.NODE_ENV !== "production") {
    const { readFileSync, existsSync } = await import("fs");
    const { join } = await import("path");
    app.get("/uploads/:filepath*", async (request, reply) => {
      const params = request.params as { filepath: string };
      const filepath = join(
        process.env.UPLOAD_DIR || "./uploads",
        params.filepath
      );
      if (!existsSync(filepath)) {
        reply.code(404).send({ error: "File not found" });
        return;
      }
      const content = readFileSync(filepath);
      reply.type("application/octet-stream").send(content);
    });
  }

  // Health check
  app.get("/api/health", async (_request, reply) => {
    reply.send({ status: "ok", timestamp: new Date().toISOString() });
  });
}
