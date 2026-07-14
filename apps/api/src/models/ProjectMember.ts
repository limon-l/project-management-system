import mongoose, { Schema, type Document } from "mongoose";
import type { ProjectRole } from "@boardflow/shared";

export interface IProjectMember extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  role: ProjectRole;
  joinedAt: Date;
}

const projectMemberSchema = new Schema<IProjectMember>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  role: {
    type: String,
    enum: ["PROJECT_MANAGER", "PROJECT_MEMBER", "VIEWER"],
    required: true,
  },
  joinedAt: { type: Date, default: Date.now },
});

projectMemberSchema.index({ userId: 1, projectId: 1 }, { unique: true });
projectMemberSchema.index({ projectId: 1 });

export const ProjectMember = mongoose.model<IProjectMember>(
  "ProjectMember",
  projectMemberSchema
);
