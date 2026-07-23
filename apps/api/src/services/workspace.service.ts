import { Workspace, WorkspaceMember, Invitation, User, Project, Board, Column, Task } from "../models/index.js";
import { AppError, validate, slugify, toId, toIdArray } from "../utils/helpers.js";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  respondInvitationSchema,
} from "@boardflow/shared";
import { ROLE_HIERARCHY } from "@boardflow/shared";
import type { WorkspaceRole } from "../models/index.js";
import { emitToWorkspace } from "../socket/index.js";
import { logAudit } from "./audit.service.js";

export async function createWorkspace(userId: string, input: unknown) {
  const data = validate(createWorkspaceSchema, input);
  const slug = slugify(data.name);

  const existing = await Workspace.findOne({ slug });
  if (existing) {
    throw new AppError(409, "CONFLICT", "Workspace name already taken");
  }

  const workspace = await Workspace.create({
    name: data.name,
    slug,
    description: data.description ?? null,
    ownerId: userId,
  });

  await WorkspaceMember.create({
    userId,
    workspaceId: workspace._id,
    role: "WORKSPACE_OWNER",
  });

  return workspace.toJSON();
}

export async function getWorkspaceBySlug(slug: string) {
  const workspace = await Workspace.findOne({ slug }).lean();
  if (!workspace) {
    throw new AppError(404, "NOT_FOUND", "Workspace not found");
  }
  return toId(workspace);
}

export async function getWorkspaceById(workspaceId: string, userId?: string): Promise<Record<string, unknown> & { id: string }> {
  const workspace = await Workspace.findById(workspaceId).lean();
  if (!workspace) {
    throw new AppError(404, "NOT_FOUND", "Workspace not found");
  }
  const result = toId(workspace);
  if (userId) {
    const membership = await WorkspaceMember.findOne({ userId, workspaceId }).lean();
    if (membership) {
      return { ...result, role: membership.role };
    }
  }
  return result;
}

export async function updateWorkspace(
  workspaceId: string,
  userId: string,
  input: unknown
) {
  const data = validate(updateWorkspaceSchema, input);

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new AppError(404, "NOT_FOUND", "Workspace not found");
  }

  if (data.name !== undefined) {
    workspace.name = data.name;
    workspace.slug = slugify(data.name);
  }
  if (data.description !== undefined) {
    workspace.description = data.description;
  }

  await workspace.save();
  return workspace.toJSON();
}

export async function getUserWorkspaces(userId: string) {
  const memberships = await WorkspaceMember.find({ userId })
    .populate("workspaceId")
    .lean();

  return toIdArray(memberships.map((m) => ({
    ...m.workspaceId as unknown as Record<string, unknown>,
    role: m.role,
    membershipId: m._id.toString(),
  })));
}

export async function getWorkspaceMembers(workspaceId: string) {
  const members = await WorkspaceMember.find({ workspaceId })
    .populate("userId", "name email avatarUrl")
    .lean();

  return members.map((m) => {
    const u = m.userId as unknown as { _id: { toString(): string }; name: string; email: string; avatarUrl: string | null };
    return {
      id: m._id.toString(),
      userId: u._id.toString(),
      workspaceId: m.workspaceId.toString(),
      role: m.role,
      user: {
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl,
      },
      joinedAt: m.joinedAt,
    };
  });
}

export async function inviteMember(workspaceId: string, inviterId: string, input: unknown) {
  const data = validate(inviteMemberSchema, input);

  const user = await User.findOne({ email: data.email.toLowerCase() }).lean();
  if (!user) {
    throw new AppError(404, "NOT_FOUND", "No user found with this email");
  }

  if (user._id.toString() === inviterId) {
    throw new AppError(400, "BAD_REQUEST", "Cannot invite yourself");
  }

  const existingMember = await WorkspaceMember.findOne({
    userId: user._id,
    workspaceId,
  }).lean();

  if (existingMember) {
    throw new AppError(409, "CONFLICT", "User is already a member");
  }

  const existingInvitation = await Invitation.findOne({
    email: data.email.toLowerCase(),
    workspaceId,
    status: "pending",
  }).lean();

  if (existingInvitation) {
    throw new AppError(409, "CONFLICT", "Invitation already pending");
  }

  const invitation = await Invitation.create({
    email: data.email.toLowerCase(),
    workspaceId,
    role: data.role,
    invitedBy: inviterId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return invitation.toJSON();
}

export async function respondToInvitation(
  invitationId: string,
  userId: string,
  input: unknown
) {
  const data = validate(respondInvitationSchema, input);

  const invitation = await Invitation.findById(invitationId);
  if (!invitation) {
    throw new AppError(404, "NOT_FOUND", "Invitation not found");
  }

  const user = await User.findById(userId).lean();
  if (user?.email !== invitation.email) {
    throw new AppError(403, "FORBIDDEN", "This invitation is not for you");
  }

  if (invitation.status !== "pending") {
    throw new AppError(400, "BAD_REQUEST", "Invitation is no longer pending");
  }

  if (invitation.expiresAt < new Date()) {
    invitation.status = "expired";
    await invitation.save();
    throw new AppError(400, "BAD_REQUEST", "Invitation has expired");
  }

  if (data.action === "reject") {
    invitation.status = "rejected";
    await invitation.save();
    return invitation.toJSON();
  }

  // Accept
  invitation.status = "accepted";
  await invitation.save();

  const member = await WorkspaceMember.create({
    userId,
    workspaceId: invitation.workspaceId,
    role: invitation.role,
  });

  const populated = await WorkspaceMember.findById(member._id)
    .populate<{ userId: { _id: string; name: string; email: string; avatarUrl: string | null } }>("userId", "name avatarUrl email")
    .lean();

  const workspaceId = invitation.workspaceId.toString();
  if (populated) {
    const u = populated.userId;
    emitToWorkspace(workspaceId, "workspace:member_joined", {
      member: {
        id: populated._id.toString(),
        userId: u._id,
        workspaceId,
        role: populated.role,
        user: {
          id: u._id,
          name: u.name,
          avatarUrl: u.avatarUrl,
        },
        joinedAt: populated.joinedAt,
      },
    });
  }

  return invitation.toJSON();
}

export async function removeMember(
  workspaceId: string,
  memberId: string,
  removedBy: string
) {
  const member = await WorkspaceMember.findById(memberId);
  if (member?.workspaceId.toString() !== workspaceId) {
    throw new AppError(404, "NOT_FOUND", "Member not found");
  }

  if (member.role === "WORKSPACE_OWNER") {
    throw new AppError(400, "BAD_REQUEST", "Cannot remove the workspace owner");
  }

  const remover = await WorkspaceMember.findOne({
    userId: removedBy,
    workspaceId,
  }).lean();

  if (!remover) {
    throw new AppError(403, "FORBIDDEN", "Not a workspace member");
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive fallback
  const removerHierarchy = ROLE_HIERARCHY[remover.role] ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive fallback
  const memberHierarchy = ROLE_HIERARCHY[member.role as WorkspaceRole] ?? 0;

  if (removerHierarchy <= memberHierarchy) {
    throw new AppError(403, "FORBIDDEN", "Cannot remove a member with equal or higher role");
  }

  const userId = member.userId.toString();
  await WorkspaceMember.findByIdAndDelete(memberId);
  emitToWorkspace(workspaceId, "workspace:member_removed", { workspaceId, userId });
  logAudit({
    action: "workspace:member_removed",
    actorId: removedBy,
    resourceType: "workspace_member",
    resourceId: memberId,
    details: { workspaceId, removedUserId: userId },
  });
}

export async function changeMemberRole(
  workspaceId: string,
  memberId: string,
  newRole: WorkspaceRole,
  changedBy: string
) {
  const member = await WorkspaceMember.findById(memberId);
  if (member?.workspaceId.toString() !== workspaceId) {
    throw new AppError(404, "NOT_FOUND", "Member not found");
  }

  if (member.role === "WORKSPACE_OWNER") {
    throw new AppError(400, "BAD_REQUEST", "Cannot change the owner's role");
  }

  const changer = await WorkspaceMember.findOne({
    userId: changedBy,
    workspaceId,
  }).lean();

  if (!changer) {
    throw new AppError(403, "FORBIDDEN", "Not a workspace member");
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive fallback
  const changerHierarchy = ROLE_HIERARCHY[changer.role] ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive fallback
  const memberHierarchy = ROLE_HIERARCHY[member.role as WorkspaceRole] ?? 0;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- defensive fallback
  const newRoleHierarchy = ROLE_HIERARCHY[newRole] ?? 0;

  if (changerHierarchy <= memberHierarchy) {
    throw new AppError(403, "FORBIDDEN", "Cannot change role of a member with equal or higher role");
  }

  if (changerHierarchy <= newRoleHierarchy) {
    throw new AppError(403, "FORBIDDEN", "Cannot assign a role equal to or higher than your own");
  }

  const previousRole = member.role;
  member.role = newRole;
  await member.save();

  emitToWorkspace(workspaceId, "workspace:member_updated", {
    workspaceId,
    memberId,
    userId: member.userId.toString(),
    role: newRole,
  });

  logAudit({
    action: "workspace:member_role_changed",
    actorId: changedBy,
    resourceType: "workspace_member",
    resourceId: memberId,
    details: { workspaceId, newRole, previousRole },
  });
}

export async function deleteWorkspace(
  workspaceId: string,
  userId: string
) {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new AppError(404, "NOT_FOUND", "Workspace not found");
  }

  if (workspace.ownerId.toString() !== userId) {
    throw new AppError(403, "FORBIDDEN", "Only the workspace owner can delete it");
  }

  const projects = await Project.find({ workspaceId }).select("_id").lean();
  const projectIds = projects.map((p) => p._id);

  if (projectIds.length > 0) {
    const boards = await Board.find({ projectId: { $in: projectIds } }).select("_id").lean();
    const boardIds = boards.map((b) => b._id);

    if (boardIds.length > 0) {
      const columns = await Column.find({ boardId: { $in: boardIds } }).select("_id").lean();
      const columnIds = columns.map((c) => c._id);

      if (columnIds.length > 0) {
        await Task.deleteMany({ columnId: { $in: columnIds } });
      }
      await Column.deleteMany({ boardId: { $in: boardIds } });
    }
    await Board.deleteMany({ projectId: { $in: projectIds } });
    await Project.deleteMany({ workspaceId });
  }

  await Invitation.deleteMany({ workspaceId });
  await WorkspaceMember.deleteMany({ workspaceId });
  await Workspace.findByIdAndDelete(workspaceId);

  logAudit({
    action: "workspace:deleted",
    actorId: userId,
    resourceType: "workspace",
    resourceId: workspaceId,
    details: { workspaceName: workspace.name },
  });

  return { message: "Workspace deleted" };
}

export async function getWorkspaceInvitations(workspaceId: string) {
  const invitations = await Invitation.find({ workspaceId, status: "pending" })
    .populate("invitedBy", "name")
    .lean();
  return toIdArray(invitations);
}
