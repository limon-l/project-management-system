"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  useProjectTasks,
  useProjectColumns,
  useCreateTask,
  useMoveTask,
  useDeleteTask,
  type Task,
} from "@/hooks/use-tasks";
import { TaskDetailDrawer } from "@/components/task-detail-drawer";
import { CreateTaskForm } from "@/components/create-task-form";
import { cn } from "@/lib/utils";

type SortField = "key" | "title" | "priority" | "dueDate" | "assignee";
type SortDirection = "asc" | "desc";

const priorityOrder: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  NO_PRIORITY: 4,
};

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  LOW: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  NO_PRIORITY: "bg-muted text-muted-foreground",
};

interface ProjectListViewProps {
  projectId: string;
}

export function ProjectListView({ projectId }: ProjectListViewProps) {
  const { user } = useAuth();
  const { data: tasks = [], isLoading: tasksLoading } = useProjectTasks(projectId);
  const { data: columns = [], isLoading: columnsLoading } = useProjectColumns(projectId);
  const createTask = useCreateTask(projectId);
  const _moveTask = useMoveTask(projectId);
  const deleteTask = useDeleteTask(projectId);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("key");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const columnMap = new Map<string, string>(columns.map((c) => [c.id, c.name]));

  const sortedTasks = [...tasks].sort((a, b) => {
    let comparison = 0;
    if (sortField === "key") {
      comparison = a.key.localeCompare(b.key);
    } else if (sortField === "title") {
      comparison = a.title.localeCompare(b.title);
    } else if (sortField === "priority") {
      comparison = (priorityOrder[a.priority] ?? 4) - (priorityOrder[b.priority] ?? 4);
    } else if (sortField === "dueDate") {
      const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      comparison = aDate - bDate;
    } else if (sortField === "assignee") {
      const aName = a.assignees?.[0]?.user?.name ?? "";
      const bName = b.assignees?.[0]?.user?.name ?? "";
      comparison = aName.localeCompare(bName);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleCreateTask = (title: string) => {
    if (!addingToColumn) return;
    const firstColumn = columns[0]?.id ?? addingToColumn;
    createTask.mutate(
      { title, columnId: firstColumn },
      { onSuccess: () => { setAddingToColumn(null); } }
    );
  };

  if (tasksLoading || columnsLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between border-b border-border px-6">
        <h1 className="text-lg font-semibold">List</h1>
        <button
          onClick={() => { setAddingToColumn(columns[0]?.id ?? ""); }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
            <tr className="border-b border-border">
              <th
                className="cursor-pointer px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => { handleSort("key"); }}
              >
                Task {sortField === "key" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => { handleSort("title"); }}
              >
                Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th
                className="cursor-pointer px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => { handleSort("priority"); }}
              >
                Priority {sortField === "priority" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => { handleSort("assignee"); }}
              >
                Assignee {sortField === "assignee" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th
                className="cursor-pointer px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => { handleSort("dueDate"); }}
              >
                Due Date {sortField === "dueDate" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No tasks yet. Create one to get started.
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => {
                const isOverdue = task.dueDate &&
                  new Date(task.dueDate) < new Date() && !task.completed;
                return (
                  <tr
                    key={task.id}
                    className="group cursor-pointer transition-colors hover:bg-accent/50"
                    onClick={() => { setSelectedTask(task); }}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground">{task.key}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{task.title}</span>
                        {task.labels && task.labels.length > 0 && (
                          <div className="flex gap-1">
                            {task.labels.slice(0, 2).map((label) => (
                              <span
                                key={label.id}
                                className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
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
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {columnMap.get(task.columnId) ?? "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                          priorityColors[task.priority] ?? priorityColors.NO_PRIORITY
                        )}
                      >
                        {task.priority === "NO_PRIORITY" ? "None" :
                          task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-2">
                        {task.assignees?.slice(0, 3).map((a) => (
                          <div
                            key={a.id}
                            className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-primary text-[10px] font-bold text-primary-foreground"
                            title={a.user.name}
                          >
                            {a.user.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {task.assignees && task.assignees.length > 3 && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                            +{task.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {task.dueDate ? (
                        <span className={cn("text-xs", isOverdue && "font-medium text-red-600")}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this task?")) {
                            deleteTask.mutate(task.id);
                          }
                        }}
                        className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {addingToColumn && (
        <div className="fixed inset-0 z-30 bg-black/20" onClick={() => { setAddingToColumn(null); }}>
          <div className="absolute left-1/2 top-1/2 w-96 -translate-x-1/2 -translate-y-1/2">
            <CreateTaskForm
              columnId={addingToColumn}
              onSubmit={handleCreateTask}
              onCancel={() => { setAddingToColumn(null); }}
            />
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskDetailDrawer
          taskId={selectedTask.id}
          projectId={projectId}
          currentUserId={user.id}
          onClose={() => { setSelectedTask(null); }}
        />
      )}
    </div>
  );
}
