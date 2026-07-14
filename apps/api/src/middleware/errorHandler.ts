import type { FastifyRequest, FastifyReply } from "fastify";
import { sendError } from "../utils/helpers.js";
import { logger } from "../utils/logger.js";
import { ERROR_CODES } from "@boardflow/shared";

export async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  if ("statusCode" in error && typeof (error as Record<string, unknown>).statusCode === "number") {
    const appError = error as unknown as { statusCode: number; code: string; message: string; details?: Record<string, string[]> };
    sendError(reply, appError.statusCode, appError.code, appError.message, appError.details);
    return;
  }

  if ("validation" in error) {
    sendError(reply, 400, ERROR_CODES.VALIDATION_ERROR, "Request validation failed");
    return;
  }

  const requestId = request.id;
  logger.error({ error: error.message, requestId }, "Unhandled error");

  sendError(
    reply,
    500,
    ERROR_CODES.INTERNAL_ERROR,
    "Internal server error",
    undefined,
    requestId
  );
}
