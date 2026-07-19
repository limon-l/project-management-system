"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { API_URL as API } from "@/lib/utils";


interface SearchResult {
  tasks?: { id: string; key: string; title: string; projectId: string }[];
  projects?: { id: string; name: string; slug: string }[];
  members?: { id: string; name: string; email: string; avatarUrl: string | null }[];
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({});
  const [loading, setLoading] = useState(false);
  const [workspaceIds, setWorkspaceIds] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults({});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Get user's workspace IDs
  useEffect(() => {
    if (!user) return;
    fetch(`${API}/api/workspaces`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) return;
        return r.json();
      })
      .then((json) => {
        if (!json) return;
        const data = json as { success: boolean; data: { id: string }[] };
        if (data.success && Array.isArray(data.data)) {
          setWorkspaceIds(data.data.map((w) => w.id));
        }
      })
      .catch(() => { /* silent */ });
  }, [user]);

  const search = useCallback(async (q: string) => {
    if (!q.trim() || workspaceIds.length === 0) {
      setResults({});
      return;
    }
    setLoading(true);
    try {
      const wid = workspaceIds[0];
      if (!wid) return;
      const res = await fetch(
        `${API}/api/workspaces/${wid}/search?q=${encodeURIComponent(q)}`,
        { credentials: "include" }
      );
      if (!res.ok) return;
      const json = await res.json() as { success: boolean; data: SearchResult };
      if (json.success) setResults(json.data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [workspaceIds]);

  useEffect(() => {
    const timer = setTimeout(() => { void search(query); }, 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else { setQuery(""); onClose(); }
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const taskResults = results.tasks ?? [];
  const projectResults = results.projects ?? [];
  const memberResults = results.members ?? [];
  const hasResults = taskResults.length > 0 || projectResults.length > 0 || memberResults.length > 0;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        paddingTop: "80px",
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "560px",
          maxHeight: "420px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
            placeholder="Search tasks, projects, members..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "16px",
              background: "transparent",
            }}
          />
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "8px 0" }}>
          {loading && (
            <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
              Searching...
            </div>
          )}

          {!loading && query && !hasResults && (
            <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
              No results found
            </div>
          )}

          {!query && (
            <div style={{ padding: "24px", textAlign: "center", color: "#9ca3af", fontSize: "13px" }}>
              Type to search across your workspace
            </div>
          )}

          {projectResults.length > 0 && (
            <div>
              <div style={{ padding: "8px 16px 4px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Projects
              </div>
              {projectResults.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { if (workspaceIds[0]) { router.push(`/workspaces/${workspaceIds[0]}/projects/${p.id}`); onClose(); } }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {taskResults.length > 0 && (
            <div>
              <div style={{ padding: "8px 16px 4px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Tasks
              </div>
              {taskResults.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { if (workspaceIds[0]) { router.push(`/workspaces/${workspaceIds[0]}/projects/${t.projectId}?task=${t.id}`); onClose(); } }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "8px 16px",
                    textAlign: "left",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "#6b7280", marginRight: "8px" }}>{t.key}</span>
                  {t.title}
                </button>
              ))}
            </div>
          )}

          {memberResults.length > 0 && (
            <div>
              <div style={{ padding: "8px 16px 4px", fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Members
              </div>
              {memberResults.map((m) => (
                <div key={m.id} style={{ padding: "8px 16px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span>{m.name}</span>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>{m.email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {query && (
          <div style={{ padding: "8px 16px", borderTop: "1px solid #e5e7eb", fontSize: "12px", color: "#9ca3af" }}>
            Press <kbd style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: "4px" }}>Esc</kbd> to close
          </div>
        )}
      </div>
    </div>
  );
}
