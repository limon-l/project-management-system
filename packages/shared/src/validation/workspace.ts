import { z } from "zod";
import { nameSchema, slugSchema, descriptionSchema } from "./common.js";
import { ROLES } from "../constants/index.js";

export const createWorkspaceSchema = z
  .object({
    name: nameSchema,
    description: descriptionSchema,
  })
  .strict();

export const updateWorkspaceSchema = z
  .object({
    name: nameSchema.optional(),
    description: z.string().max(500).optional().nullable(),
  })
  .strict();

export const inviteMemberSchema = z
  .object({
    email: z.string().email().max(255),
    role: z.enum([ROLES.WORKSPACE_ADMIN, ROLES.PROJECT_MEMBER, ROLES.VIEWER]),
  })
  .strict();

export const updateMemberRoleSchema = z
  .object({
    role: z.enum([ROLES.WORKSPACE_ADMIN, ROLES.PROJECT_MEMBER, ROLES.VIEWER]),
  })
  .strict();

export const respondInvitationSchema = z
  .object({
    action: z.enum(["accept", "reject"]),
  })
  .strict();

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type RespondInvitationInput = z.infer<typeof respondInvitationSchema>;
