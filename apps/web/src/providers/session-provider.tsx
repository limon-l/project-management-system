"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

interface SessionContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = useCallback(async () => {
    try {
      const data = await api<{ user: User }>("/api/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    if (loading) return;
    const isPublic = PUBLIC_ROUTES.some((route) => route === pathname || pathname.startsWith(route + "/"));
    if (!user && !isPublic) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    const data = await api<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    setUser(data.user);
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await api<{ user: User }>("/api/auth/register", {
      method: "POST",
      body: { name, email, password },
    });
    setUser(data.user);
  };

  const logout = async () => {
    await api("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <SessionContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
