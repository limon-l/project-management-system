import mongoose, { Schema, type Document } from "mongoose";

export interface IComment extends Document {
  taskId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  content: string;
  edited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true, maxlength: 10000 },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

commentSchema.index({ taskId: 1, createdAt: 1 });
commentSchema.index({ taskId: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
