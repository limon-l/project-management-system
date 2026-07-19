import { z } from "zod";
import {
  nameSchema,
  descriptionSchema,
  projectKeySchema,
} from "./common.js";
import { PROJECT_STATUSES, ROLES } from "../constants/index.js";

export const createProjectSchema = z
  .object({
    name: nameSchema,
    key: projectKeySchema,
    description: descriptionSchema,
  })
  .strict();

export const updateProjectSchema = z
  .object({
    name: nameSchema.optional(),
    description: z.string().trim().max(2000).optional().nullable(),
    status: z.nativeEnum(PROJECT_STATUSES).optional(),
    startDate: z.coerce.date().optional().nullable(),
    targetDate: z.coerce.date().optional().nullable(),
  })
  .strict();

export const addProjectMemberSchema = z
  .object({
    userId: z.string().min(1),
    role: z.enum([ROLES.PROJECT_MANAGER, ROLES.PROJECT_MEMBER, ROLES.VIEWER]),
  })
  .strict();

export const updateProjectMemberSchema = z
  .object({
    role: z.enum([ROLES.PROJECT_MANAGER, ROLES.PROJECT_MEMBER, ROLES.VIEWER]),
  })
  .strict();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
export type UpdateProjectMemberInput = z.infer<typeof updateProjectMemberSchema>;
