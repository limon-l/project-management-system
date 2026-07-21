"use client";

export interface SessionContextValue {
  user: { id: string; name: string; email: string; avatarUrl: string | null; emailVerified: boolean; createdAt: string } | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export { useSession as useAuth } from "@/providers/session-provider";
