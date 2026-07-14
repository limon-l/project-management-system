import type { FastifyRequest, FastifyReply } from "fastify";
import { Session } from "../models/index.js";
import { sendError } from "../utils/helpers.js";
import { ERROR_CODES } from "@boardflow/shared";

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
}

declare module "fastify" {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const sessionToken = request.cookies?.session;

  if (!sessionToken) {
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
    return;
  }

  const session = await Session.findOne({
    token: sessionToken,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!session) {
    reply.clearCookie("session", { path: "/" });
    sendError(reply, 401, ERROR_CODES.UNAUTHORIZED, "Invalid or expired session");
    return;
  }

  request.user = {
    userId: session.userId.toString(),
    sessionId: session._id.toString(),
  };
}
