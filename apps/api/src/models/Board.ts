import mongoose, { Schema, type Document } from "mongoose";

export interface IBoard extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const boardSchema = new Schema<IBoard>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true, maxlength: 100, default: "Board" },
  },
  { timestamps: true }
);

boardSchema.index({ projectId: 1 });

export const Board = mongoose.model<IBoard>("Board", boardSchema);
