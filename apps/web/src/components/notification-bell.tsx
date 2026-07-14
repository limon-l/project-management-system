"use client";

import { useRef, useEffect } from "react";
import { useNotifications } from "../providers/notification-provider";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
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
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px",
          color: "var(--color-text, #333)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              background: "var(--color-danger, #ef4444)",
              color: "#fff",
              fontSize: "11px",
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: "360px",
            maxHeight: "480px",
            overflow: "auto",
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <strong style={{ fontSize: "14px" }}>Notifications</strong>
            {unreadCount > 0 && (
              <button
                onClick={() => markRead()}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "12px",
                  color: "var(--color-primary, #3b82f6)",
                  cursor: "pointer",
                }}
              >
                Mark all as read
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) markRead([n.id]);
                }}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  background: n.read ? "transparent" : "var(--color-bg-subtle, #f0f9ff)",
                  borderBottom: "1px solid #f3f4f6",
                  transition: "background 0.15s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.4, color: "#374151" }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px", display: "block" }}>
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                {!n.read && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--color-primary, #3b82f6)",
                      flexShrink: 0,
                      marginTop: "6px",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
