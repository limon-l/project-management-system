"use client";

import { useState } from "react";
import { useSavedFilters, type FilterPreset } from "@/hooks/use-saved-filters";

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
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [presetName, setPresetName] = useState("");
  const { presets, savePreset, deletePreset } = useSavedFilters();

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

  function handleSave() {
    if (!presetName.trim()) return;
    savePreset(presetName.trim(), {
      assigneeId: assigneeId || undefined,
      priority: priority || undefined,
      labelId: labelId || undefined,
      completed: completed === "" ? undefined : completed,
      search: search || undefined,
    });
    setPresetName("");
    setShowSaveDialog(false);
  }

  function loadPreset(preset: FilterPreset) {
    setAssigneeId(preset.filters.assigneeId ?? "");
    setPriority(preset.filters.priority ?? "");
    setLabelId(preset.filters.labelId ?? "");
    setCompleted(preset.filters.completed ?? "");
    setSearch(preset.filters.search ?? "");
    onFilterChange({
      assigneeId: preset.filters.assigneeId,
      priority: preset.filters.priority,
      labelId: preset.filters.labelId,
      completed: preset.filters.completed === "true" ? true : preset.filters.completed === "false" ? false : undefined,
      search: preset.filters.search,
    });
  }

  const hasActiveFilters = assigneeId || priority || labelId || completed || search;

  const selectClass =
    "h-8 rounded-md border border-border bg-surface px-2.5 text-xs text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary";

  return (
    <div className="flex flex-wrap items-center gap-2 py-3">
      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); }}
        onKeyDown={(e) => { if (e.key === "Enter") apply(); }}
        placeholder="Search tasks..."
        aria-label="Search tasks"
        className="h-8 w-[180px] rounded-md border border-border bg-surface px-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />

      <select
        value={assigneeId}
        onChange={(e) => { setAssigneeId(e.target.value); onFilterChange({ assigneeId: e.target.value ?? undefined }); }}
        aria-label="Filter by assignee"
        className={selectClass}
      >
        <option value="">All assignees</option>
        {assignees?.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={priority}
        onChange={(e) => { setPriority(e.target.value); onFilterChange({ priority: e.target.value ?? undefined }); }}
        aria-label="Filter by priority"
        className={selectClass}
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      <select
        value={labelId}
        onChange={(e) => { setLabelId(e.target.value); onFilterChange({ labelId: e.target.value ?? undefined }); }}
        aria-label="Filter by label"
        className={selectClass}
      >
        <option value="">All labels</option>
        {labels?.map((l) => (
          <option key={l.id} value={l.id}>{l.name}</option>
        ))}
      </select>

      <select
        value={completed}
        onChange={(e) => { setCompleted(e.target.value); onFilterChange({ completed: e.target.value === "" ? undefined : e.target.value === "true" }); }}
        aria-label="Filter by completion status"
        className={selectClass}
      >
        <option value="">All status</option>
        <option value="false">Incomplete</option>
        <option value="true">Completed</option>
      </select>

      <button
        onClick={clear}
        className="h-8 rounded-md border border-border bg-surface px-3 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        Clear
      </button>

      {/* Saved filters */}
      {presets.length > 0 && (
        <select
          onChange={(e) => {
            const preset = presets.find((p) => p.id === e.target.value);
            if (preset) loadPreset(preset);
          }}
          aria-label="Load saved filter"
          className={selectClass}
          value=""
        >
          <option value="" disabled>Saved views...</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      )}

      {hasActiveFilters && (
        <div className="relative">
          <button
            onClick={() => { setShowSaveDialog(!showSaveDialog); }}
            className="h-8 rounded-md border border-primary/30 bg-primary/5 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Save view
          </button>

          {showSaveDialog && (
            <div className="absolute top-10 right-0 z-40 w-64 rounded-lg border border-border bg-surface p-3 shadow-lg">
              <p className="mb-2 text-xs font-medium">Save current filters</p>
              <input
                autoFocus
                value={presetName}
                onChange={(e) => { setPresetName(e.target.value); }}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
                placeholder="e.g. My urgent tasks"
                className="mb-2 h-8 w-full rounded-md border border-border bg-background px-2.5 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end gap-1.5">
                <button
                  onClick={() => { setShowSaveDialog(false); setPresetName(""); }}
                  className="rounded-md px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!presetName.trim()}
                  className="rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
