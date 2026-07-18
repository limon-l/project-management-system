"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { API_URL as API } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  actor?: { id: string; name: string; avatarUrl: string | null };
  entityType: string;
  entityId: string;
  projectId: string | null;
}

interface NotificationContextValue {
  unreadCount: number;
  notifications: Notification[];
  open: boolean;
  setOpen: (v: boolean) => void;
  markRead: (ids?: string[]) => void;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  notifications: [],
  open: false,
  setOpen: () => { /* noop default */ },
  markRead: () => { /* noop default */ },
  loading: false,
});


export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    let cancelled = false;

    async function fetchNotifications() {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/notifications`, {
          credentials: "include",
        });
        const json = await res.json();
        if (!cancelled && json.success) {
          setNotifications(json.data);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNotifications();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const markRead = useCallback(
    async (ids?: string[]) => {
      const toMark = ids ?? notifications.filter((n) => !n.read).map((n) => n.id);
      if (toMark.length === 0) return;

      setNotifications((prev) =>
        prev.map((n) => (toMark.includes(n.id) ? { ...n, read: true } : n)),
      );

      try {
        await fetch(`${API}/api/notifications/read`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: toMark }),
        });
      } catch {
        // silent — optimistic update already applied
      }
    },
    [notifications],
  );

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, open, setOpen, markRead, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
