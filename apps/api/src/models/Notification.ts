import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId | null;
  type: string;
  entityType: string;
  entityId: string;
  projectId: mongoose.Types.ObjectId | null;
  workspaceId: mongoose.Types.ObjectId | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, read: 1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
