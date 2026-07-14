import mongoose, { Schema, type Document } from "mongoose";

export type WorkspaceRole =
  | "WORKSPACE_OWNER"
  | "WORKSPACE_ADMIN"
  | "PROJECT_MEMBER"
  | "VIEWER";

export interface IWorkspaceMember extends Document {
  userId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  role: WorkspaceRole;
  joinedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
  joinedAt: { type: Date, default: Date.now },
});

workspaceMemberSchema.index({ userId: 1, workspaceId: 1 }, { unique: true });
workspaceMemberSchema.index({ workspaceId: 1 });
workspaceMemberSchema.index({ userId: 1 });

export const WorkspaceMember = mongoose.model<IWorkspaceMember>(
  "WorkspaceMember",
  workspaceMemberSchema
);
