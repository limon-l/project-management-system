import mongoose, { Schema, type Document } from "mongoose";

export interface IColumn extends Document {
  boardId: mongoose.Types.ObjectId;
  name: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

const columnSchema = new Schema<IColumn>(
  {
    boardId: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    name: { type: String, required: true, maxlength: 50 },
    position: { type: String, required: true },
  },
  { timestamps: true }
);

columnSchema.index({ boardId: 1, position: 1 });
columnSchema.index({ boardId: 1 });

export const Column = mongoose.model<IColumn>("Column", columnSchema);
