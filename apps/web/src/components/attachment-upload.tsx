"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface Attachment {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  url?: string;
  uploader: { id: string; name: string; avatarUrl: string | null };
  createdAt: string;
}

export function AttachmentUpload({ taskId }: { taskId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/tasks/${taskId}/attachments`, {
        credentials: "include",
      });
      const json = await res.json() as { success: boolean; data: { attachments: Attachment[] } };
      if (json.success) setAttachments(json.data.attachments);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { void load(); }, [load]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API}/api/tasks/${taskId}/attachments`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const json = await res.json() as { success: boolean; data: { attachment: Attachment } };
      if (json.success) {
        setAttachments((prev) => [json.data.attachment, ...prev]);
      }
    } catch {
      // silent
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await fetch(`${API}/api/attachments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setAttachments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      // silent
    }
  };

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${String(bytes)} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  const isImage = (mime: string) => mime.startsWith("image/");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <strong style={{ fontSize: "13px", color: "#374151" }}>Attachments</strong>
        <button
          onClick={() => { inputRef.current?.click(); }}
          disabled={uploading}
          style={{
            padding: "4px 12px",
            borderRadius: "6px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {loading && <div style={{ fontSize: "12px", color: "#9ca3af" }}>Loading...</div>}

      {!loading && attachments.length === 0 && (
        <div style={{ fontSize: "12px", color: "#9ca3af", padding: "8px 0" }}>
          No attachments
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {attachments.map((a) => (
          <div
            key={a.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "8px 10px",
              borderRadius: "6px",
              background: "#f9fafb",
              border: "1px solid #f3f4f6",
            }}
          >
            {isImage(a.mimeType) && a.url ? (
              <img
                src={a.url}
                alt={a.originalName}
                style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "4px",
                  background: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  color: "#6b7280",
                  fontWeight: 600,
                }}
              >
                {a.originalName.split(".").pop()?.toUpperCase() ?? "FILE"}
              </div>
            )}

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.originalName}
              </div>
              <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                {formatBytes(a.size)} by {a.uploader.name}
              </div>
            </div>

            <button
              onClick={() => { void remove(a.id); }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                padding: "4px",
                fontSize: "14px",
              }}
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
