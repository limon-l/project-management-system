"use client";

import { useState } from "react";

interface CreateTaskFormProps {
  columnId: string;
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

export function CreateTaskForm({
  columnId: _columnId,
  onSubmit,
  onCancel,
}: CreateTaskFormProps) {
  const [title, setTitle] = useState("");

  const submit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setTitle("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface p-3 shadow-sm">
      <textarea
        autoFocus
        value={title}
        onChange={(e) => { setTitle(e.target.value); }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Enter a title for this task..."
        className="min-h-[60px] w-full resize-none rounded border-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        rows={2}
      />
      <div className="mt-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={!title.trim()}
          className="inline-flex h-7 items-center rounded bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-7 items-center rounded px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
