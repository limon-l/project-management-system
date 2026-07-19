"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { API_URL as API } from "@/lib/utils";
import { toast } from "sonner";

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
      toast.error("Failed to load attachments");
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
        toast.success(`Uploaded ${file.name}`);
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const res = await fetch(`${API}/api/attachments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setAttachments((prev) => prev.filter((a) => a.id !== id));
        toast.success("Attachment deleted");
      } else {
        toast.error("Failed to delete attachment");
      }
    } catch {
      toast.error("Failed to delete attachment");
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
      <div className="mb-3 flex items-center justify-between">
        <strong className="text-xs font-semibold text-foreground">Attachments</strong>
        <button
          onClick={() => { inputRef.current?.click(); }}
          disabled={uploading}
          className="rounded-md border border-border bg-surface px-3 py-1 text-xs text-foreground transition-colors hover:bg-accent disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          aria-label="Upload file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {loading && <div className="text-xs text-muted-foreground">Loading...</div>}

      {!loading && attachments.length === 0 && (
        <div className="py-2 text-xs text-muted-foreground">No attachments</div>
      )}

      <div className="flex flex-col gap-1.5">
        {attachments.map((a) => (
          <div
            key={a.id}
            className="flex items-center gap-2.5 rounded-md border border-border bg-muted/30 px-2.5 py-2"
          >
            {isImage(a.mimeType) && a.url ? (
              <img
                src={a.url}
                alt={a.originalName}
                className="h-9 w-9 rounded object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent text-[10px] font-semibold text-muted-foreground">
                {a.originalName.split(".").pop()?.toUpperCase() ?? "FILE"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-medium">
                {a.originalName}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {formatBytes(a.size)} by {a.uploader.name}
              </div>
            </div>

            <button
              onClick={() => { void remove(a.id); }}
              aria-label="Delete attachment"
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
