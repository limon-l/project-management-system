import mongoose, { Schema, type Document } from "mongoose";

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  description: string | null;
  ownerId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: null, maxlength: 500 },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

workspaceSchema.index({ ownerId: 1 });

export const Workspace = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);
