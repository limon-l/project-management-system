import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Keep browser requests same-origin. Next.js proxies /api to the backend,
// allowing the httpOnly session cookie to work even when the API is hosted on
// a different provider/domain.
export const API_URL = "";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let errorMsg = "API request failed";
    let errorCode: string | undefined;
    try {
      const errData = await res.json() as { success: boolean; error?: { message?: string; code?: string } };
      errorMsg = errData.error?.message ?? errorMsg;
      errorCode = errData.error?.code;
    } catch {
      errorMsg = res.statusText || errorMsg;
    }
    throw new ApiError(res.status, errorMsg, errorCode);
  }

  const data = await res.json() as { success: boolean; data: T; error?: { message?: string } };

  if (!data.success) {
    throw new Error(data.error?.message ?? "API request failed");
  }

  return data.data;
}

/**
 * Enforces the list contract at the API boundary so components never receive
 * an object or null value where they expect to call array methods.
 */
export async function apiArray<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T[]> {
  const data = await api<unknown>(path, options);
  if (!Array.isArray(data)) {
    throw new ApiError(502, `Invalid list response from ${path}`);
  }
  return data as T[];
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${String(diffMin)}m ago`;
  if (diffHr < 24) return `${String(diffHr)}h ago`;
  if (diffDays < 7) return `${String(diffDays)}d ago`;
  return formatDate(date);
}
