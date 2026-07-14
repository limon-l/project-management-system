import { z } from "zod";

export const createCommentSchema = z
  .object({
    content: z.string().min(1).max(10000),
  })
  .strict();

export const updateCommentSchema = z
  .object({
    content: z.string().min(1).max(10000),
  })
  .strict();

export const createColumnSchema = z
  .object({
    name: z.string().min(1).max(50),
  })
  .strict();

export const updateColumnSchema = z
  .object({
    name: z.string().min(1).max(50).optional(),
  })
  .strict();

export const reorderColumnsSchema = z
  .object({
    columnIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;
