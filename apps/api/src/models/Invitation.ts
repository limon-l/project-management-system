import mongoose, { Schema, type Document } from "mongoose";
import type { WorkspaceRole } from "./WorkspaceMember.js";

export type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "cancelled";

export interface IInvitation extends Document {
  email: string;
  workspaceId: mongoose.Types.ObjectId;
  role: WorkspaceRole;
  status: InvitationStatus;
  invitedBy: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    role: {
      type: String,
      enum: ["WORKSPACE_OWNER", "WORKSPACE_ADMIN", "PROJECT_MEMBER", "VIEWER"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "expired", "cancelled"],
      default: "pending",
    },
    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

invitationSchema.index({ email: 1, workspaceId: 1, status: 1 });
invitationSchema.index({ workspaceId: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Invitation = mongoose.model<IInvitation>(
  "Invitation",
  invitationSchema
);
