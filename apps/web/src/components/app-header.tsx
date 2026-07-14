"use client";

import { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { NotificationBell } from "./notification-bell";
import { SearchDialog } from "./search-dialog";

export function AppHeader() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  if (!user) return null;

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: "56px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <strong style={{ fontSize: "18px" }}>BoardFlow</strong>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          style={{
            background: "none",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "13px",
            color: "#9ca3af",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Search
          <kbd style={{ background: "#f3f4f6", padding: "1px 5px", borderRadius: "4px", fontSize: "11px" }}>⌘K</kbd>
        </button>

        <NotificationBell />
        <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>
            {user.name}
          </span>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "13px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
