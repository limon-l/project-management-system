"use client";

import { useEffect, useState } from "react";

const SHORTCUTS = [
  { category: "Navigation", items: [
    { keys: ["Ctrl", "K"], description: "Open command palette" },
    { keys: ["?"], description: "Toggle shortcuts panel" },
    { keys: ["Esc"], description: "Close dialog / cancel" },
  ]},
  { category: "Board", items: [
    { keys: ["N"], description: "New task (when board focused)" },
    { keys: ["Click + Drag"], description: "Move task between columns" },
  ]},
  { category: "Task Detail", items: [
    { keys: ["Click title"], description: "Edit task title inline" },
    { keys: ["Space"], description: "Toggle checklist item" },
  ]},
];

export function ShortcutsPanel() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="animate-scale-in w-full max-w-md rounded-2xl border border-border bg-surface p-0 shadow-deep"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="shortcuts-title" className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close shortcuts panel"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4 space-y-5">
          {SHORTCUTS.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{group.category}</h3>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <div key={item.description} className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{item.description}</span>
                    <div className="flex items-center gap-1">
                      {item.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex h-6 min-w-[24px] items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[11px] font-medium text-muted-foreground"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border px-6 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="mx-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10px] font-medium">?</kbd> to toggle this panel
          </p>
        </div>
      </div>
    </div>
  );
}
