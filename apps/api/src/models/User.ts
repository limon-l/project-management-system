import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    passwordHash: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        const safe = ret as Record<string, unknown>;
        // Capture the identifier before removing MongoDB internals.  Reading
        // `ret._id` after it has been deleted caused every login/registration
        // response to throw while serializing the user document.
        const id = (ret as { _id: { toString(): string } })._id.toString();
        for (const key of [
          "passwordHash",
          "emailVerificationToken",
          "emailVerificationExpires",
          "passwordResetToken",
          "passwordResetExpires",
          "__v",
          "_id",
        ]) {
          Reflect.deleteProperty(safe, key);
        }
        safe.id = id;
        return safe;
      },
    },
  }
);

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model<IUser>("User", userSchema);
