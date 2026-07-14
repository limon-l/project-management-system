import mongoose, { Schema, type Document } from "mongoose";

export interface IActivity extends Document {
  actorId: mongoose.Types.ObjectId;
  actionType: string;
  entityType: string;
  entityId: string;
  projectId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  metadata: Record<string, unknown>;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actionType: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

activitySchema.index({ projectId: 1, createdAt: -1 });
activitySchema.index({ workspaceId: 1, createdAt: -1 });
activitySchema.index({ entityId: 1 });

export const Activity = mongoose.model<IActivity>("Activity", activitySchema);
