import { z } from "zod";

export const createDependencySchema = z
  .object({
    blockingTaskId: z.string().min(1),
  })
  .strict();

export const deleteDependencySchema = z
  .object({
    blockingTaskId: z.string().min(1),
  })
  .strict();

export type CreateDependencyInput = z.infer<typeof createDependencySchema>;
export type DeleteDependencyInput = z.infer<typeof deleteDependencySchema>;
