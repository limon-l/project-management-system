"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

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
  setOpen: () => { /* noop */ },
  markRead: () => { /* noop */ },
  loading: false,
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [unreadCount] = useState(0);
  const [notifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, open, setOpen, markRead: () => { /* noop */ }, loading }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
