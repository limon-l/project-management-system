"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import type { Task } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-blue-100 text-blue-700 border-blue-200",
  NO_PRIORITY: "",
};

const priorityLabels: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "High",
  MEDIUM: "Medium",
  LOW: "Low",
  NO_PRIORITY: "",
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style = transform
    ? {
        transform: `translate3d(${String(transform.x)}px, ${String(transform.y)}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => { onClick(task); }}
      className={cn(
        "cursor-grab rounded-lg border border-border bg-surface p-3 shadow-sm transition-shadow",
        "hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/20"
      )}
    >
      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label.id}
              className="inline-block rounded-full px-2 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: `${label.color}20`,
                color: label.color,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium leading-snug">{task.title}</p>

      {/* Footer: key + priority + assignees */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{task.key}</span>
          {task.priority !== "NO_PRIORITY" && (
            <span
              className={cn(
                "inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium",
                priorityColors[task.priority]
              )}
            >
              {priorityLabels[task.priority]}
            </span>
          )}
        </div>

        {/* Assignee avatars */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1.5">
            {task.assignees.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-primary text-[8px] font-bold text-primary-foreground"
                title={a.user.name}
              >
                {a.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {task.assignees.length > 3 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-muted text-[8px] font-medium text-muted-foreground">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Due date */}
      {task.dueDate && (
        <div className="mt-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium",
              new Date(task.dueDate) < new Date() && !task.completed
                ? "bg-red-50 text-red-600"
                : "bg-muted text-muted-foreground"
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}
    </div>
  );
}
