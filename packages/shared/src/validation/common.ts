import { z } from "zod";

export const emailSchema = z.string().trim().email().max(255);
export const passwordSchema = z.string().min(8).max(128);
export const nameSchema = z.string().trim().min(1).max(100);
export const slugSchema = z.string().trim().min(1).max(100).regex(/^[a-z0-9-]+$/);
export const descriptionSchema = z.string().trim().max(2000).optional();
export const projectKeySchema = z
  .string()
  .trim()
  .min(2)
  .max(10)
  .regex(/^[A-Z][A-Z0-9]+$/);
