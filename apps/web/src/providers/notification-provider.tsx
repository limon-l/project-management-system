"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/use-auth";
import { getSocket } from "../lib/socket-client";

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
  markRead: (ids?: string[]) => Promise<void>;
  loading: boolean;
}

const NotificationContext = createContext<NotificationContextValue>({
  unreadCount: 0,
  notifications: [],
  open: false,
  setOpen: () => { void 0; },
  markRead: async () => { void 0; },
  loading: false,
});

export function useNotifications() {
  return useContext(NotificationContext);
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/api/notifications/unread-count`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setUnreadCount(json.data.count);
      }
    } catch {
      // silent
    }
  }, [user]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/notifications?limit=10`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data.items);
        setUnreadCount(json.data.unreadCount);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markRead = useCallback(
    async (ids?: string[]) => {
      if (!user) return;
      try {
        await fetch(`${API}/api/notifications/read`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationIds: ids }),
        });
        if (ids) {
          setNotifications((prev) =>
            prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))
          );
          setUnreadCount((prev) => Math.max(0, prev - ids.length));
        } else {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          setUnreadCount(0);
        }
      } catch {
        // silent
      }
    },
    [user]
  );

  // Initial fetch and polling fallback
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user, fetchUnreadCount, fetchNotifications]);

  // Socket.IO listener for real-time push
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    const handler = (payload: { notification: Notification }) => {
      setNotifications((prev) => [payload.notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on("notification:created", handler);
    return () => {
      socket.off("notification:created", handler);
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, open, setOpen, markRead, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
