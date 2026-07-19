import { z } from "zod";
import { TASK_PRIORITIES } from "../constants/index.js";

export const createTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(255),
    columnId: z.string().min(1),
    assigneeIds: z.array(z.string().min(1)).optional(),
    priority: z.nativeEnum(TASK_PRIORITIES).optional(),
    labelIds: z.array(z.string().min(1)).optional(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
  })
  .strict();

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(10000).optional().nullable(),
    priority: z.nativeEnum(TASK_PRIORITIES).optional(),
    labelIds: z.array(z.string().min(1)).optional(),
    startDate: z.coerce.date().optional().nullable(),
    dueDate: z.coerce.date().optional().nullable(),
    assigneeIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

export const moveTaskSchema = z
  .object({
    columnId: z.string().min(1),
    position: z.string().min(1),
  })
  .strict();

export const reorderTaskSchema = z
  .object({
    position: z.string().min(1),
  })
  .strict();

export const createChecklistItemSchema = z
  .object({
    text: z.string().trim().min(1).max(500),
  })
  .strict();

export const updateChecklistItemSchema = z
  .object({
    text: z.string().trim().min(1).max(500).optional(),
    completed: z.boolean().optional(),
  })
  .strict();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type ReorderTaskInput = z.infer<typeof reorderTaskSchema>;
export type CreateChecklistItemInput = z.infer<typeof createChecklistItemSchema>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;
