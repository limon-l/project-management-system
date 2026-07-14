"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import type { Task, Column } from "@/hooks/use-tasks";

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export function BoardColumn({
  column,
  tasks,
  onTaskClick,
  onAddTask,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { column },
  });

  const isDoneColumn = column.name.toLowerCase() === "done";

  return (
    <div
      className={cn(
        "flex w-72 flex-shrink-0 flex-col rounded-xl border border-border bg-muted/50",
        isOver && "ring-2 ring-primary/30"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">
            {column.name}
          </h3>
          <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        className="flex flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
        style={{ minHeight: 60 }}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}

        {isOver && (
          <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-3 text-center text-xs text-primary/50">
            Drop here
          </div>
        )}
      </div>

      {/* Add Task Button */}
      {!isDoneColumn && (
        <div className="px-2 pb-2">
          <button
            onClick={() => onAddTask(column.id)}
            className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" x2="12" y1="5" y2="19" />
              <line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add task
          </button>
        </div>
      )}
    </div>
  );
}
