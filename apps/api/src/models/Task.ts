import mongoose, { Schema, type Document } from "mongoose";
import type { TaskPriority } from "@boardflow/shared";

export interface ITask extends Document {
  projectId: mongoose.Types.ObjectId;
  boardId: mongoose.Types.ObjectId;
  columnId: mongoose.Types.ObjectId;
  position: string;
  key: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  creatorId: mongoose.Types.ObjectId;
  assigneeIds: mongoose.Types.ObjectId[];
  labelIds: mongoose.Types.ObjectId[];
  watcherIds: mongoose.Types.ObjectId[];
  startDate: Date | null;
  dueDate: Date | null;
  completed: boolean;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    columnId: {
      type: Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    position: { type: String, required: true },
    key: { type: String, required: true },
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String, default: null, maxlength: 10000 },
    priority: {
      type: String,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW", "NO_PRIORITY"],
      default: "NO_PRIORITY",
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assigneeIds: [
      { type: Schema.Types.ObjectId, ref: "User" },
    ],
    labelIds: [
      { type: Schema.Types.ObjectId, ref: "Label" },
    ],
    watcherIds: [
      { type: Schema.Types.ObjectId, ref: "User" },
    ],
    startDate: { type: Date, default: null },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    sequence: { type: Number, required: true },
  },
  { timestamps: true }
);

taskSchema.index({ projectId: 1, columnId: 1, position: 1 });
taskSchema.index({ boardId: 1 });
taskSchema.index({ columnId: 1 });
taskSchema.index({ projectId: 1, key: 1 }, { unique: true });
taskSchema.index({ assigneeIds: 1 });
taskSchema.index({ creatorId: 1 });
taskSchema.index({ projectId: 1, completed: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ title: "text", key: "text", description: "text" });

export const Task = mongoose.model<ITask>("Task", taskSchema);
