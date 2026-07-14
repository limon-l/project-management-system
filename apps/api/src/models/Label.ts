import mongoose, { Schema, type Document } from "mongoose";

export interface ILabel extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  color: string;
  createdAt: Date;
}

const labelSchema = new Schema<ILabel>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: { type: String, required: true, maxlength: 50 },
    color: { type: String, required: true, maxlength: 7 },
  },
  { timestamps: true }
);

labelSchema.index({ projectId: 1, name: 1 }, { unique: true });

export const Label = mongoose.model<ILabel>("Label", labelSchema);
