import mongoose, { Schema, type Document } from "mongoose";

export interface IChecklistItem extends Document {
  taskId: mongoose.Types.ObjectId;
  text: string;
  completed: boolean;
  completedBy: mongoose.Types.ObjectId | null;
  completedAt: Date | null;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

const checklistItemSchema = new Schema<IChecklistItem>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    text: { type: String, required: true, maxlength: 500 },
    completed: { type: Boolean, default: false },
    completedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    completedAt: { type: Date, default: null },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

checklistItemSchema.index({ taskId: 1, position: 1 });

export const ChecklistItem = mongoose.model<IChecklistItem>(
  "ChecklistItem",
  checklistItemSchema
);
