import { Attachment, User } from "../models/index.js";
import { AppError } from "../utils/helpers.js";
import { getStorage } from "./storage.service.js";

const MAGIC_BYTES: Record<string, Uint8Array[]> = {
  "image/jpeg": [new Uint8Array([0xFF, 0xD8, 0xFF])],
  "image/png": [new Uint8Array([0x89, 0x50, 0x4E, 0x47])],
  "image/gif": [new Uint8Array([0x47, 0x49, 0x46])],
  "image/webp": [new Uint8Array([0x52, 0x49, 0x46, 0x46])],
  "image/svg+xml": [new Uint8Array([0x3C, 0x73, 0x76, 0x67])], // <svg
  "application/pdf": [new Uint8Array([0x25, 0x50, 0x44, 0x46])],
  "application/zip": [
    new Uint8Array([0x50, 0x4B, 0x03, 0x04]),
    new Uint8Array([0x50, 0x4B, 0x05, 0x06]),
    new Uint8Array([0x50, 0x4B, 0x07, 0x08]),
  ],
  "application/gzip": [new Uint8Array([0x1F, 0x8B])],
};

function validateMagicBytes(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_BYTES[mimeType];
  if (!signatures) return true; // no magic-byte check for this type
  return signatures.some((sig) =>
    sig.every((byte, i) => buffer[i] === byte)
  );
}

import { ALLOWED_MIME_TYPES } from "@boardflow/shared";

const allowedMimeTypes = ALLOWED_MIME_TYPES as readonly string[];

export async function uploadAttachment(
  taskId: string,
  uploaderId: string,
  buffer: Buffer,
  originalName: string,
  mimeType: string
) {
  if (!allowedMimeTypes.includes(mimeType)) {
    throw new AppError(400, "BAD_REQUEST", `File type ${mimeType} is not allowed`);
  }

  if (!validateMagicBytes(buffer, mimeType)) {
    throw new AppError(400, "BAD_REQUEST", "File content does not match the declared type");
  }

  const storage = getStorage();
  const result = await storage.upload(buffer, originalName, mimeType);

  const attachment = await Attachment.create({
    taskId,
    filename: result.filename,
    originalName,
    mimeType,
    size: buffer.length,
    uploaderId,
  });

  const uploader = await User.findById(uploaderId).select("name avatarUrl").lean();

  return {
    id: attachment._id.toString(),
    taskId: attachment.taskId.toString(),
    filename: attachment.filename,
    originalName: attachment.originalName,
    mimeType: attachment.mimeType,
    size: attachment.size,
    uploader: uploader
      ? { id: uploader._id.toString(), name: uploader.name, avatarUrl: uploader.avatarUrl }
      : { id: uploaderId, name: "Unknown", avatarUrl: null },
    url: result.url,
    createdAt: attachment.createdAt,
  };
}

export async function getTaskAttachments(taskId: string) {
  const attachments = await Attachment.find({ taskId })
    .populate("uploaderId", "name avatarUrl")
    .sort({ createdAt: -1 })
    .lean();

  const env = (await import("../config/env.js")).getEnv();
  const isLocal = env.STORAGE_TYPE === "local";

  return attachments.map((a) => {
    const uploader = a.uploaderId as unknown as
      | { _id: { toString(): string }; name: string; avatarUrl: string | null }
      | null;
    return {
      id: a._id.toString(),
      taskId: a.taskId.toString(),
      filename: a.filename,
      originalName: a.originalName,
      mimeType: a.mimeType,
      size: a.size,
      uploader: uploader
        ? { id: uploader._id.toString(), name: uploader.name, avatarUrl: uploader.avatarUrl }
        : null,
      url: isLocal ? `/uploads/${a.filename}` : undefined,
      createdAt: a.createdAt,
    };
  });
}

export async function deleteAttachment(attachmentId: string, userId: string) {
  const attachment = await Attachment.findById(attachmentId);
  if (!attachment) {
    throw new AppError(404, "NOT_FOUND", "Attachment not found");
  }

  // Only uploader can delete
  if (attachment.uploaderId.toString() !== userId) {
    throw new AppError(403, "FORBIDDEN", "Can only delete your own attachments");
  }

  const storage = getStorage();
  await storage.delete(attachment.filename);
  await Attachment.findByIdAndDelete(attachmentId);
}
