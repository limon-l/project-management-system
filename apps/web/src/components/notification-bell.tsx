"use client";

import { useRef, useEffect } from "react";
import { useNotifications } from "../providers/notification-provider";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${String(mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${String(hrs)}h ago`;
  const days = Math.floor(hrs / 24);
  return `${String(days)}d ago`;
}

export function NotificationBell() {
  const { unreadCount, notifications, open, setOpen, markRead, loading } =
    useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${String(unreadCount)} unread)` : ""}`}
        className="relative cursor-pointer border-none bg-transparent p-2 text-foreground"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[11px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : String(unreadCount)}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-scale-in absolute right-0 top-full z-50 max-h-[480px] w-[360px] overflow-auto rounded-lg border border-border bg-surface shadow-premium">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <strong className="text-sm">Notifications</strong>
            {unreadCount > 0 && (
              <button
                onClick={() => markRead()}
                className="cursor-pointer border-none bg-transparent text-xs text-primary"
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (!n.read) markRead([n.id]);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!n.read) markRead([n.id]);
                  }
                }}
                className={`flex cursor-pointer gap-3 border-b border-accent px-4 py-3 transition-colors ${
                  n.read ? "bg-transparent" : "bg-primary/5"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[13px] leading-relaxed text-foreground">
                    {n.message}
                  </p>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                {!n.read && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
