"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useWorkspaces } from "@/hooks/use-workspaces";
import { useProjects } from "@/hooks/use-projects";
import { useProjectTasks } from "@/hooks/use-tasks";

type CommandGroup = "tasks" | "projects" | "workspaces" | "actions";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group: CommandGroup;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { user: _user } = useAuth();
  const router = useRouter();
  const { data: workspaces = [] } = useWorkspaces();
  const { data: projects = [] } = useProjects(workspaces[0]?.id ?? "");
  const { data: tasks = [] } = useProjectTasks(projects[0]?.id ?? "");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => { return !prev; });
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const handleOpenPalette = () => {
      setOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleOpenPalette);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleOpenPalette);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  const items: CommandItem[] = [
    ...tasks
      .filter((t) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- boolean OR, not value coalescing
        return t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.key.toLowerCase().includes(query.toLowerCase());
      })
      .slice(0, 5)
      .map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        const workspaceId = project?.workspaceId ?? "";
        return {
          id: `task-${task.id}`,
          label: task.title,
          description: task.key,
          group: "tasks" as CommandGroup,
          action: () => {
            setOpen(false);
            if (workspaceId) {
              router.push(`/workspaces/${workspaceId}/projects/${task.projectId}/board`);
            }
          },
        };
      }),
    ...projects
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((project) => ({
        id: `project-${project.id}`,
        label: project.name,
        description: project.key,
        group: "projects" as CommandGroup,
        action: () => {
          setOpen(false);
          router.push(`/workspaces/${project.workspaceId}/projects/${project.id}/board`);
        },
      })),
    ...workspaces
      .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map((workspace) => ({
        id: `workspace-${workspace.id}`,
        label: workspace.name,
        group: "workspaces" as CommandGroup,
        action: () => {
          setOpen(false);
          router.push(`/workspaces/${workspace.id}`);
        },
      })),
    {
      id: "action-new-task",
      label: "Create new task",
      description: "Quickly create a new task",
      group: "actions",
      action: () => {
        setOpen(false);
        router.push("/dashboard");
      },
    },
    {
      id: "action-new-project",
      label: "Create new project",
      description: "Start a new project",
      group: "actions",
      action: () => {
        setOpen(false);
        router.push("/dashboard");
      },
    },
  ];

  const filteredItems = query
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  const groupedItems = filteredItems.reduce<Record<string, CommandItem[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatItems = filteredItems;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" && flatItems.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % flatItems.length);
      } else if (e.key === "ArrowUp" && flatItems.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === "Enter" && flatItems[selectedIndex]) {
        e.preventDefault();
        flatItems[selectedIndex].action();
      }
    },
    [flatItems, selectedIndex]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => { setOpen(false); }} />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-surface shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {Object.entries(groupedItems).map(([group, groupItems]) => (
            <div key={group} className="mb-2">
              <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group}
              </p>
              {groupItems.map((item) => {
                const globalIndex = flatItems.indexOf(item);
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      globalIndex === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/50"
                    )}
                    onMouseEnter={() => { setSelectedIndex(globalIndex); }}
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    {item.group === "tasks" && (
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filteredItems.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found
            </p>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border px-1 py-0.5">↑</kbd>
              <kbd className="rounded border border-border px-1 py-0.5">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-border px-1 py-0.5">↵</kbd>
              to select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
