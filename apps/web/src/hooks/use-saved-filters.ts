"use client";

import { useState, useCallback, useEffect } from "react";

export interface FilterPreset {
  id: string;
  name: string;
  filters: {
    search?: string;
    assigneeId?: string;
    priority?: string;
    labelId?: string;
    completed?: string;
  };
  createdAt: string;
}

const STORAGE_KEY = "boardflow-saved-filters";

function loadPresets(): FilterPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePresets(presets: FilterPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function useSavedFilters() {
  const [presets, setPresets] = useState<FilterPreset[]>([]);

  useEffect(() => {
    setPresets(loadPresets());
  }, []);

  const savePreset = useCallback((name: string, filters: FilterPreset["filters"]) => {
    const newPreset: FilterPreset = {
      id: crypto.randomUUID(),
      name,
      filters,
      createdAt: new Date().toISOString(),
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    savePresets(updated);
    return newPreset;
  }, [presets]);

  const deletePreset = useCallback((id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    savePresets(updated);
  }, [presets]);

  return { presets, savePreset, deletePreset };
}
