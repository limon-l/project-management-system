import mongoose, { Schema, type Document } from "mongoose";

export interface IAttachment extends Document {
  taskId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploaderId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const attachmentSchema = new Schema<IAttachment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

attachmentSchema.index({ taskId: 1 });

export const Attachment = mongoose.model<IAttachment>(
  "Attachment",
  attachmentSchema
);
