import argon2 from "argon2";
import { nanoid } from "nanoid";
import { User, Session } from "../models/index.js";
import { AppError, validate } from "../utils/helpers.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@boardflow/shared";
import { getEnv } from "../config/env.js";
import { logger } from "../utils/logger.js";

function generateSessionToken(): string {
  return nanoid(64);
}

export async function register(
  input: unknown
): Promise<{
  user: ReturnType<typeof User.prototype.toJSON>;
  sessionToken: string;
}> {
  const data = validate(registerSchema, input);

  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new AppError(
      409,
      "CONFLICT",
      "An account with this email already exists. Please sign in instead."
    );
  }

  let passwordHash: string;
  try {
    passwordHash = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  } catch (err) {
    logger.error({ err }, "Password hashing failed during registration");
    throw new AppError(
      500,
      "INTERNAL_ERROR",
      "Registration failed. Please try again."
    );
  }

  let user;
  try {
    user = await User.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      emailVerificationToken: nanoid(32),
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  } catch (error) {
    // The preflight lookup can race with another request.  Preserve the same
    // clear conflict response for MongoDB's unique-index result.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      throw new AppError(
        409,
        "CONFLICT",
        "An account with this email already exists. Please sign in instead."
      );
    }
    throw error;
  }

  const env = getEnv();
  const token = generateSessionToken();
  await Session.create({
    userId: user._id,
    token,
    expiresAt: new Date(Date.now() + env.SESSION_MAX_AGE),
  });

  return { user: user.toJSON(), sessionToken: token };
}

export async function login(
  input: unknown,
  userAgent: string,
  ip: string
): Promise<{
  user: ReturnType<typeof User.prototype.toJSON>;
  sessionToken: string;
}> {
  const data = validate(loginSchema, input);

  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  let valid: boolean;
  try {
    valid = await argon2.verify(user.passwordHash, data.password);
  } catch (err) {
    logger.error({ err: err, userId: user._id.toString() }, "Password verification failed");
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  if (!valid) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid email or password");
  }

  const env = getEnv();
  const token = generateSessionToken();
  await Session.create({
    userId: user._id,
    token,
    userAgent,
    ip,
    expiresAt: new Date(Date.now() + env.SESSION_MAX_AGE),
  });

  return { user: user.toJSON(), sessionToken: token };
}

export async function logout(sessionToken: string): Promise<void> {
  await Session.findOneAndDelete({ token: sessionToken });
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "NOT_FOUND", "User not found");
  }
  return user;
}

export async function requestPasswordReset(input: unknown) {
  const data = validate(forgotPasswordSchema, input);

  const user = await User.findOne({ email: data.email.toLowerCase() });

  // Always return success to prevent email enumeration
  if (!user) return;

  const resetToken = nanoid(32);
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();
}

export async function resetPassword(input: unknown) {
  const data = validate(resetPasswordSchema, input);

  const user = await User.findOne({
    passwordResetToken: data.token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Invalid or expired reset token"
    );
  }

  let passwordHash: string;
  try {
    passwordHash = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
    });
  } catch (err) {
    logger.error({ err }, "Password hashing failed during reset");
    throw new AppError(
      500,
      "INTERNAL_ERROR",
      "Password reset failed. Please try again."
    );
  }

  user.passwordHash = passwordHash;
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();

  // Invalidate all existing sessions
  await Session.deleteMany({ userId: user._id });
}

export async function verifyEmail(token: string) {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError(
      400,
      "BAD_REQUEST",
      "Invalid or expired verification token"
    );
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();
}
