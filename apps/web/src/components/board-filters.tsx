"use client";

import { useState } from "react";

interface BoardFiltersProps {
  assignees?: { id: string; name: string }[];
  labels?: { id: string; name: string; color: string }[];
  onFilterChange: (filters: {
    assigneeId?: string;
    priority?: string;
    labelId?: string;
    completed?: boolean;
    search?: string;
  }) => void;
}

const PRIORITIES = ["URGENT", "HIGH", "MEDIUM", "LOW", "NO_PRIORITY"] as const;

export function BoardFilters({ assignees, labels, onFilterChange }: BoardFiltersProps) {
  const [assigneeId, setAssigneeId] = useState("");
  const [priority, setPriority] = useState("");
  const [labelId, setLabelId] = useState("");
  const [completed, setCompleted] = useState<string>("");
  const [search, setSearch] = useState("");

  function apply() {
    onFilterChange({
      assigneeId: assigneeId || undefined,
      priority: priority || undefined,
      labelId: labelId || undefined,
      completed: completed === "" ? undefined : completed === "true",
      search: search || undefined,
    });
  }

  function clear() {
    setAssigneeId("");
    setPriority("");
    setLabelId("");
    setCompleted("");
    setSearch("");
    onFilterChange({});
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", padding: "12px 0" }}>
      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
        placeholder="Search tasks..."
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          fontSize: "13px",
          width: "180px",
          outline: "none",
        }}
      />

      <select
        value={assigneeId}
        onChange={(e) => { setAssigneeId(e.target.value); onFilterChange({ assigneeId: e.target.value ?? undefined }); }}
        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "13px", background: "#fff" }}
      >
        <option value="">All assignees</option>
        {assignees?.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => { setPriority(e.target.value); onFilterChange({ priority: e.target.value ?? undefined }); }}
        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "13px", background: "#fff" }}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={labelId}
        onChange={(e) => { setLabelId(e.target.value); onFilterChange({ labelId: e.target.value ?? undefined }); }}
        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "13px", background: "#fff" }}
      >
        <option value="">All labels</option>
        {labels?.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <select
        value={completed}
        onChange={(e) => { setCompleted(e.target.value); onFilterChange({ completed: e.target.value === "" ? undefined : e.target.value === "true" }); }}
        style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid #e5e7eb", fontSize: "13px", background: "#fff" }}
      >
        <option value="">All status</option>
        <option value="false">Incomplete</option>
        <option value="true">Completed</option>
      </select>

      <button
        onClick={clear}
        style={{
          padding: "6px 12px",
          borderRadius: "6px",
          border: "1px solid #e5e7eb",
          background: "#fff",
          cursor: "pointer",
          fontSize: "13px",
          color: "#6b7280",
        }}
      >
        Clear
      </button>
    </div>
  );
}
