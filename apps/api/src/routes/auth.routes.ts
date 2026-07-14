import type { FastifyInstance } from "fastify";
import {
  register,
  login,
  logout,
  getCurrentUser,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
} from "../services/index.js";
import { authMiddleware } from "../middleware/index.js";
import { sendSuccess, sendError, AppError } from "../utils/helpers.js";
import { ERROR_CODES } from "@boardflow/shared";

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/register", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    try {
      const result = await register(request.body);
      reply.setCookie("session", result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      sendSuccess(reply, { user: result.user }, 201);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  app.post("/login", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    try {
      const result = await login(
        request.body,
        request.headers["user-agent"] || "",
        request.ip || ""
      );
      reply.setCookie("session", result.sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      sendSuccess(reply, { user: result.user });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  app.post("/logout", { preHandler: [authMiddleware] }, async (request, reply) => {
    const sessionToken = request.cookies?.session;
    if (sessionToken) {
      await logout(sessionToken);
    }
    reply.clearCookie("session", { path: "/" });
    sendSuccess(reply, { message: "Logged out" });
  });

  app.get("/me", { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const user = await getCurrentUser(request.user!.userId);
      sendSuccess(reply, user);
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });

  app.post("/forgot-password", { config: { rateLimit: { max: 3, timeWindow: "1 minute" } } }, async (request, reply) => {
    try {
      await requestPasswordReset(request.body);
      sendSuccess(reply, { message: "If an account exists, a reset email has been sent" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });

  app.post("/reset-password", { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } }, async (request, reply) => {
    try {
      await resetPassword(request.body);
      sendSuccess(reply, { message: "Password reset successful" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message, error.details);
        return;
      }
      throw error;
    }
  });

  app.post("/verify-email", { config: { rateLimit: { max: 10, timeWindow: "1 minute" } } }, async (request, reply) => {
    try {
      const body = request.body as Record<string, unknown>;
      if (!body.token || typeof body.token !== "string") {
        sendError(reply, 400, "BAD_REQUEST", "Token is required");
        return;
      }
      await verifyEmail(body.token);
      sendSuccess(reply, { message: "Email verified" });
    } catch (error) {
      if (error instanceof AppError) {
        sendError(reply, error.statusCode, error.code, error.message);
        return;
      }
      throw error;
    }
  });
}
