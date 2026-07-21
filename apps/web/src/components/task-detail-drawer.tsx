"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  useTaskDetail,
  useTaskChecklist,
  useTaskComments,
  useUpdateTask,
  useAddChecklistItem,
  useUpdateChecklistItem,
  useTaskDependencies,
  useAddDependency,
  useDeleteDependency,
} from "@/hooks/use-tasks";
import { CommentSection } from "./comment-section";
import { AttachmentUpload } from "./attachment-upload";

export interface TaskDetailDrawerProps {
  taskId: string | null;
  projectId: string;
  currentUserId: string;
  onClose: () => void;
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-blue-100 text-blue-700",
  NO_PRIORITY: "bg-muted text-muted-foreground",
};

export function TaskDetailDrawer({
  taskId,
  projectId,
  currentUserId: _currentUserId,
  onClose,
}: TaskDetailDrawerProps) {
  const { data: task } = useTaskDetail(taskId);
  const { data: checklist = [] } = useTaskChecklist(taskId);
  const { data: commentsData } = useTaskComments(taskId);
  const { data: dependencies } = useTaskDependencies(taskId);
  const updateTask = useUpdateTask(projectId);
  const addChecklistItem = useAddChecklistItem();
  const updateChecklistItem = useUpdateChecklistItem();
  const addDependency = useAddDependency(projectId);
  const deleteDependency = useDeleteDependency(projectId);

  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [addingDependencyKey, setAddingDependencyKey] = useState("");

  useEffect(() => {
    if (task) setTitleValue(task.title);
  }, [task]);

  if (!taskId || !task) return null;

  const comments = commentsData?.items ?? [];
  const completedCount = checklist.filter((i) => i.completed).length;

  const handleTitleSave = () => {
    if (titleValue.trim() && titleValue !== task.title) {
      updateTask.mutate({ taskId: task.id, title: titleValue.trim() });
    }
    setEditingTitle(false);
  };

  const handlePriorityChange = (priority: string) => {
    updateTask.mutate({ taskId: task.id, priority });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    addChecklistItem.mutate(
      { taskId: task.id, text: newChecklistItem.trim() },
      { onSuccess: () => { setNewChecklistItem(""); } }
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col border-l border-border bg-surface shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground">
              {task.key}
            </span>
            {editingTitle ? (
              <input
                autoFocus
                aria-label="Task title"
                value={titleValue}
                onChange={(e) => { setTitleValue(e.target.value); }}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleSave();
                  if (e.key === "Escape") {
                    setTitleValue(task.title);
                    setEditingTitle(false);
                  }
                }}
                className="flex-1 rounded border border-border px-2 py-1 text-sm font-semibold outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            ) : (
              <h2
                id="task-drawer-title"
                role="button"
                tabIndex={0}
                onClick={() => { setEditingTitle(true); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditingTitle(true);
                  }
                }}
                className="cursor-pointer text-lg font-semibold hover:text-primary"
              >
                {task.title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close task details"
            className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Priority */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Priority
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["NO_PRIORITY", "LOW", "MEDIUM", "HIGH", "URGENT"].map((p) => (
                  <button
                    key={p}
                    onClick={() => { handlePriorityChange(p); }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                      task.priority === p
                        ? `${priorityColors[p]} border-current`
                        : "border-border text-muted-foreground hover:border-foreground/30"
                    )}
                  >
                    {p === "NO_PRIORITY" ? "None" : p.charAt(0) + p.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignees */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Assignees
              </label>
              <div className="flex flex-wrap gap-2">
                {task.assignees && task.assignees.length > 0 ? (
                  task.assignees.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {a.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium">{a.name}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No assignees
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </label>
              {task.description ? (
                <div className="prose prose-sm max-w-none whitespace-pre-wrap rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground/80">
                  {task.description}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No description</p>
              )}
            </div>

            {/* Dates */}
            {(task.startDate ?? task.dueDate) && (
              <div className="flex gap-6">
                {task.startDate && (
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Start Date
                    </label>
                    <p className="text-sm">
                      {new Date(task.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Due Date
                    </label>
                    <p
                      className={cn(
                        "text-sm",
                        new Date(task.dueDate) < new Date() &&
                          !task.completed &&
                          "font-medium text-red-600"
                      )}
                    >
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Labels
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {task.labels.map((label) => (
                    <span
                      key={label.id}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${label.color}20`,
                        color: label.color,
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Dependencies
              </label>
              {dependencies?.blocking && dependencies.blocking.length > 0 && (
                <div className="mb-2">
                  <p className="mb-1 text-xs text-muted-foreground">Blocked by</p>
                  <div className="space-y-1">
                    {dependencies.blocking.map((dep) => (
                      <div
                        key={dep.id}
                        className={cn(
                          "flex items-center justify-between rounded border border-border p-2",
                          dep.blockingTask.completed && "opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            {dep.blockingTask.key}
                          </span>
                          <span className="text-sm">{dep.blockingTask.title}</span>
                          {dep.blockingTask.completed && (
                            <span className="text-xs text-success">Done</span>
                          )}
                        </div>
                        <button
                          onClick={() => { void deleteDependency.mutate(dep.id); }}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dependencies?.blockedBy && dependencies.blockedBy.length > 0 && (
                <div className="mb-2">
                  <p className="mb-1 text-xs text-muted-foreground">Blocking</p>
                  <div className="space-y-1">
                    {dependencies.blockedBy.map((dep) => (
                      <div
                        key={dep.id}
                        className={cn(
                          "flex items-center justify-between rounded border border-border p-2",
                          dep.blockedTask.completed && "opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            {dep.blockedTask.key}
                          </span>
                          <span className="text-sm">{dep.blockedTask.title}</span>
                          {dep.blockedTask.completed && (
                            <span className="text-xs text-success">Done</span>
                          )}
                        </div>
                        <button
                          onClick={() => { void deleteDependency.mutate(dep.id); }}
                          className="text-xs text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(!dependencies?.blocking || dependencies.blocking.length === 0) &&
                (!dependencies?.blockedBy || dependencies.blockedBy.length === 0) && (
                  <p className="text-xs text-muted-foreground">No dependencies</p>
                )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!addingDependencyKey.trim() || !taskId) return;
                   addDependency.mutate(
                     { taskId, blockingTaskId: addingDependencyKey.trim() },
                     { onSuccess: () => { setAddingDependencyKey(""); } }
                   );
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={addingDependencyKey}
                  onChange={(e) => { setAddingDependencyKey(e.target.value); }}
                  placeholder="Add blocker by task key..."
                  aria-label="Add blocker task key"
                  className="h-7 flex-1 rounded border border-border px-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!addingDependencyKey.trim()}
                  className="inline-flex h-7 items-center rounded bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Checklist */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Checklist
                {checklist.length > 0 && (
                  <span className="ml-1.5 text-foreground">
                    {completedCount}/{checklist.length}
                  </span>
                )}
              </label>
              {checklist.length > 0 && (
                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-success transition-all"
                    style={{
                      width: `${String(checklist.length > 0 ? (completedCount / checklist.length) * 100 : 0)}%`,
                    }}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                {checklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-accent"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) =>
                        updateChecklistItem.mutate({
                          itemId: item.id,
                          completed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                    <span
                      className={cn(
                        "text-sm",
                        item.completed && "text-muted-foreground line-through"
                      )}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddChecklistItem();
                }}
                className="mt-2 flex gap-2"
              >
                <input
                  value={newChecklistItem}
                  onChange={(e) => { setNewChecklistItem(e.target.value); }}
                  placeholder="Add an item..."
                  aria-label="Add checklist item"
                  className="h-7 flex-1 rounded border border-border px-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!newChecklistItem.trim()}
                  className="inline-flex h-7 items-center rounded bg-primary px-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Attachments */}
            <AttachmentUpload taskId={task.id} />

            {/* Divider */}
            <hr className="border-border" />

            {/* Comments */}
            <CommentSection
              taskId={task.id}
              comments={comments}
            />
          </div>
        </div>
      </div>
    </>
  );
}
