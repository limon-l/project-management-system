import mongoose, { Schema, type Document } from "mongoose";

export interface ITaskDependency extends Document {
  projectId: mongoose.Types.ObjectId;
  blockingTaskId: mongoose.Types.ObjectId;
  blockedTaskId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const taskDependencySchema = new Schema<ITaskDependency>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    blockingTaskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    blockedTaskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  { timestamps: true }
);

taskDependencySchema.index({ projectId: 1, blockedTaskId: 1 });
taskDependencySchema.index({ projectId: 1, blockingTaskId: 1 });
taskDependencySchema.index({ projectId: 1, blockingTaskId: 1, blockedTaskId: 1 }, { unique: true });

export const TaskDependency = mongoose.model<ITaskDependency>(
  "TaskDependency",
  taskDependencySchema
);
