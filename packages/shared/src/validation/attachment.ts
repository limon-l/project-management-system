import { z } from "zod";

export const createLabelSchema = z.object({
  name: z.string().trim().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color"),
}).strict();

export const updateLabelSchema = z.object({
  name: z.string().trim().min(1).max(50).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
}).strict();

export const updateNotificationPreferencesSchema = z.object({
  task_assigned: z.boolean().optional(),
  task_unassigned: z.boolean().optional(),
  mention: z.boolean().optional(),
  comment_on_watched: z.boolean().optional(),
  deadline_approaching: z.boolean().optional(),
  task_overdue: z.boolean().optional(),
  invitation_received: z.boolean().optional(),
  project_role_changed: z.boolean().optional(),
}).strict();

export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;
export type UpdateNotificationPreferencesInput = z.infer<typeof updateNotificationPreferencesSchema>;
