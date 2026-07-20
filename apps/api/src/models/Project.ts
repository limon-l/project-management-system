import mongoose, { Schema, type Document } from "mongoose";
import type { ProjectStatus } from "@boardflow/shared";

export interface IProject extends Document {
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  key: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  targetDate: Date | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    key: { type: String, required: true, maxlength: 10 },
    slug: { type: String, required: true },
    description: { type: String, default: null, maxlength: 2000 },
    status: {
      type: String,
      enum: ["PLANNING", "ACTIVE", "ON_HOLD", "COMPLETED", "ARCHIVED"],
      default: "PLANNING",
    },
    startDate: { type: Date, default: null },
    targetDate: { type: Date, default: null },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ workspaceId: 1, slug: 1 }, { unique: true });
projectSchema.index({ workspaceId: 1, key: 1 }, { unique: true });
projectSchema.index({ name: "text", description: "text" });

export const Project = mongoose.model<IProject>("Project", projectSchema);
