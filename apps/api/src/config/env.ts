import { config } from "dotenv";
import { z } from "zod";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from workspace root .env if present
config({ path: path.resolve(__dirname, "../../../.env") });
// Load environment variables from package root .env if present (as fallback or overrides)
config({ path: path.resolve(__dirname, "../../.env") });
// Load environment variables from current working directory as standard fallback
config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  API_PORT: z.coerce.number().default(3001),
  API_HOST: z.string().default("0.0.0.0"),
  MONGODB_URI: z.string().url(),
  SESSION_SECRET: z.string().min(16),
  SESSION_MAX_AGE: z.coerce.number().default(604800000),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  MAX_FILE_SIZE: z.coerce.number().default(10 * 1024 * 1024),

  // File storage (S3-compatible, e.g. Cloudflare R2)
  STORAGE_TYPE: z.enum(["local", "s3"]).default("local"),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().default("auto"),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_PUBLIC_URL: z.string().optional(),
  UPLOAD_DIR: z.string().default("./uploads"),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) {
    _env = envSchema.parse(process.env);
  }
  return _env;
}

export function validateEnv(): void {
  getEnv();
}
