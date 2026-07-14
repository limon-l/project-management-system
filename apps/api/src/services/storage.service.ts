import { getEnv } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { randomUUID } from "crypto";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

interface StorageResult {
  filename: string;
  url: string;
}

interface StorageBackend {
  upload(buffer: Buffer, originalName: string, mimeType: string): Promise<StorageResult>;
  delete(filename: string): Promise<void>;
}

class LocalStorage implements StorageBackend {
  private dir: string;

  constructor() {
    this.dir = getEnv().UPLOAD_DIR;
    if (!existsSync(this.dir)) {
      mkdir(this.dir, { recursive: true }).catch(() => {});
    }
  }

  async upload(buffer: Buffer, originalName: string, _mimeType: string): Promise<StorageResult> {
    const ext = extname(originalName);
    const filename = `${randomUUID()}${ext}`;
    const filepath = join(this.dir, filename);

    if (!existsSync(this.dir)) {
      await mkdir(this.dir, { recursive: true });
    }

    await writeFile(filepath, buffer);

    const url = `/uploads/${filename}`;
    return { filename, url };
  }

  async delete(filename: string): Promise<void> {
    const filepath = join(this.dir, filename);
    try {
      await unlink(filepath);
    } catch (err) {
      logger.warn(`Failed to delete file ${filename}: ${err}`);
    }
  }
}

class S3Storage implements StorageBackend {
  private s3!: import("@aws-sdk/client-s3").S3Client;
  private bucket: string;
  private publicUrl: string;
  private region: string;

  constructor() {
    const env = getEnv();
    this.bucket = env.S3_BUCKET || "";
    this.publicUrl = (env.S3_PUBLIC_URL || "").replace(/\/$/, "");
    this.region = env.S3_REGION;
  }

  private async getClient(): Promise<import("@aws-sdk/client-s3").S3Client> {
    if (!this.s3) {
      const { S3Client } = await import("@aws-sdk/client-s3");
      const env = getEnv();
      this.s3 = new S3Client({
        endpoint: env.S3_ENDPOINT,
        region: this.region,
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: env.S3_SECRET_ACCESS_KEY || "",
        },
        forcePathStyle: true,
      });
    }
    return this.s3;
  }

  async upload(buffer: Buffer, originalName: string, mimeType: string): Promise<StorageResult> {
    const ext = extname(originalName);
    const filename = `tasks/${randomUUID()}${ext}`;

    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.getClient();
    await client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
      })
    );

    const url = this.publicUrl
      ? `${this.publicUrl}/${filename}`
      : `${getEnv().S3_ENDPOINT}/${this.bucket}/${filename}`;

    return { filename, url };
  }

  async delete(filename: string): Promise<void> {
    const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
    const client = await this.getClient();
    await client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: filename,
      })
    );
  }
}

let storage: StorageBackend | null = null;

export function getStorage(): StorageBackend {
  if (!storage) {
    const env = getEnv();
    if (env.STORAGE_TYPE === "s3") {
      storage = new S3Storage();
      logger.info("Using S3-compatible storage");
    } else {
      storage = new LocalStorage();
      logger.info("Using local file storage");
    }
  }
  return storage;
}
