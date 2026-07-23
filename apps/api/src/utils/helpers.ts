import type { FastifyReply } from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { ZodError, type ZodSchema } from "zod";
import { Types } from "mongoose";
import { ERROR_CODES, type ApiResponse } from "@boardflow/shared";

export interface AuthenticatedUser {
  userId: string;
  sessionId: string;
}

/** Type-safe accessor for the authenticated user set by authMiddleware. */
export function getRequestUser(request: { user?: AuthenticatedUser }): AuthenticatedUser {
  const user = request.user;
  if (!user) {
    throw new AppError(401, ERROR_CODES.UNAUTHORIZED, "Authentication required");
  }
  return user;
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
  }
}

/** Validates that a value is a valid MongoDB ObjectId string. */
export function isValidObjectId(value: unknown): value is string {
  return typeof value === "string" && Types.ObjectId.isValid(value) && value.length === 24;
}

/** Validates multiple route params, returning a 400 if any are invalid. */
export function validateObjectIdParam(
  reply: FastifyReply,
  paramName: string,
  value: unknown
): value is string {
  if (!isValidObjectId(value)) {
    sendError(reply, 400, ERROR_CODES.BAD_REQUEST, `Invalid ${paramName}`);
    return false;
  }
  return true;
}

export function sendSuccess(
  reply: FastifyReply,
  data: unknown,
  statusCode = 200
): void {
  const response: ApiResponse = { success: true, data };
  reply.status(statusCode).send(response);
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
  requestId?: string
): void {
  const response: ApiResponse = {
    success: false,
    error: { code: code as never, message, details, requestId },
  };
  reply.status(statusCode).send(response);
}

export function sendPaginated(
  reply: FastifyReply,
  items: unknown[],
  total: number,
  page: number,
  limit: number,
  hasMore: boolean,
  nextCursor?: string
): void {
  sendSuccess(reply, {
    items,
    total,
    page,
    limit,
    hasMore,
    nextCursor,
  });
}

export function validate<T>(schema: ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const details: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        details[path] ??= [];
        details[path].push(err.message);
      });
      throw new AppError(
        400,
        ERROR_CODES.VALIDATION_ERROR,
        "Validation failed",
        details
      );
    }
    throw error;
  }
}

/**
 * Converts a Mongoose lean document's `_id` (ObjectId) to an `id` (string)
 * field so the frontend can use it directly. Non-ObjectId `_id` values are
 * cast via `.toString()`. The original `_id` field is preserved for backward
 * compatibility.
 */
export function toId<T extends Record<string, unknown>>(
  doc: T
): T & { id: string } {
  const raw = doc as unknown as { _id: { toString(): string } };
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- _id existence not guaranteed by generic type T
  if (!raw._id) return doc as T & { id: string };
  return { ...doc, id: raw._id.toString() };
}

/** Batch-convert an array of lean documents. */
export function toIdArray<T extends Record<string, unknown>>(
  docs: T[]
): (T & { id: string })[] {
  return docs.map(toId);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generatePosition(index: number, _total: number): string {
  const step = 1000;
  return String((index + 1) * step).padStart(6, "0");
}

export function midpointPosition(before: string, after: string): string {
  const a = parseInt(before, 10);
  const b = parseInt(after, 10);
  if (isNaN(a) || isNaN(b)) {
    return String(Math.floor((a || 0) + 1)).padStart(6, "0");
  }
  if (b - a <= 1) {
    return String(a + 1).padStart(6, "0");
  }
  return String(Math.floor((a + b) / 2)).padStart(6, "0");
}

export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "none" | "lax" | "strict";
  path: string;
  maxAge: number;
}

export interface ClearCookieOptions {
  path: string;
  sameSite: "none" | "lax" | "strict";
  secure: boolean;
}

function isSecureOrigin(): boolean {
  const isProduction = process.env.NODE_ENV === "production";
  const corsOrigins = process.env.CORS_ORIGIN ?? "";
  const hasHttpsOrigin = corsOrigins
    .split(",")
    .some((o) => o.trim().startsWith("https://"));
  return isProduction || hasHttpsOrigin;
}

export function getCookieOptions(): CookieOptions {
  const secure = isSecureOrigin();
  return {
    httpOnly: true,
    secure,
    // Browser API traffic is proxied through the Next.js origin.  Lax avoids
    // relying on third-party cookies while retaining CSRF protection.
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function getClearCookieOptions(): ClearCookieOptions {
  const secure = isSecureOrigin();
  return {
    path: "/",
    sameSite: "lax",
    secure,
  };
}

interface SocketTokenPayload {
  userId: string;
  sessionId: string;
  expiresAt: number;
}

/** Creates a short-lived credential for the cross-origin Socket.IO handshake. */
export function createSocketToken(userId: string, sessionId: string): string {
  const payload: SocketTokenPayload = {
    userId,
    sessionId,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", process.env.SESSION_SECRET ?? "")
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySocketToken(token: unknown): SocketTokenPayload | null {
  if (typeof token !== "string") return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || token.split(".").length !== 2) return null;

  const expected = createHmac("sha256", process.env.SESSION_SECRET ?? "")
    .update(encoded)
    .digest("base64url");
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as SocketTokenPayload;
    if (
      typeof payload.userId !== "string" ||
      typeof payload.sessionId !== "string" ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Date.now()
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
