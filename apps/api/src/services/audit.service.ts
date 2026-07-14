import { logger } from "../utils/logger.js";

export function logAudit(event: {
  action: string;
  actorId: string;
  resourceType: string;
  resourceId: string;
  details?: Record<string, unknown>;
}): void {
  logger.info(
    {
      audit: true,
      action: event.action,
      actorId: event.actorId,
      resourceType: event.resourceType,
      resourceId: event.resourceId,
      details: event.details,
    },
    `Audit: ${event.action}`
  );
}
