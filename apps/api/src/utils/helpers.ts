import type { FastifyReply } from "fastify";
import { ZodError, type ZodSchema } from "zod";
import { ERROR_CODES, type ApiResponse } from "@boardflow/shared";

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

export function sendSuccess<T>(
  reply: FastifyReply,
  data: T,
  statusCode = 200
): void {
  const response: ApiResponse<T> = { success: true, data };
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

export function sendPaginated<T>(
  reply: FastifyReply,
  items: T[],
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
        if (!details[path]) details[path] = [];
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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generatePosition(index: number, total: number): string {
  const step = 1000;
  return String((index + 1) * step).padStart(6, "0");
}

export function midpointPosition(before: string, after: string): string {
  const a = parseInt(before, 10);
  const b = parseInt(after, 10);
  if (isNaN(a) || isNaN(b)) {
    return String(Math.floor((a || 0) + 1));
  }
  if (b - a <= 1) {
    return String(a + 1);
  }
  return String(Math.floor((a + b) / 2));
}
