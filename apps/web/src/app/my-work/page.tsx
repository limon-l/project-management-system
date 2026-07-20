"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";

interface Task {
  id: string;
  key: string;
  title: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
  projectId: string;
  assigneeIds: { id: string; name: string; avatarUrl: string | null }[];
}

interface Summary {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
}

interface MyWorkResponse {
  tasks: Task[];
  groups?: Record<string, Task[]>;
}

const PRIORITY_STYLES: Record<string, { bg: string; text: string }> = {
  URGENT: { bg: "bg-red-50", text: "text-red-600" },
  HIGH: { bg: "bg-orange-50", text: "text-orange-600" },
  MEDIUM: { bg: "bg-yellow-50", text: "text-yellow-600" },
  LOW: { bg: "bg-gray-50", text: "text-gray-500" },
  NO_PRIORITY: { bg: "bg-gray-50", text: "text-gray-500" },
};

export default function MyWorkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [groupBy, setGroupBy] = useState<"dueDate" | "priority" | "project">(
    "dueDate",
  );

  const { data: myWorkData, isLoading: tasksLoading } = useQuery<MyWorkResponse>({
    queryKey: ["myWorkTasks", groupBy],
    queryFn: () => api<MyWorkResponse>(`/api/my-work/tasks?groupBy=${groupBy}`),
    enabled: !!user,
    staleTime: 30_000,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery<Summary>({
    queryKey: ["myWorkSummary"],
    queryFn: () => api<Summary>("/api/my-work/summary"),
    enabled: !!user,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const tasks = myWorkData?.tasks ?? [];
  const groups = myWorkData?.groups ?? {};
  const loading = authLoading || tasksLoading || summaryLoading;

  if (loading) {
    return (
      <div className="p-10 text-center text-muted-foreground">Loading...</div>
    );
  }

  const sectionTitles: Record<string, string> = {
    overdue: "Overdue",
    today: "Today",
    upcoming: "Upcoming (Next 7 Days)",
    later: "Later",
    noDate: "No Due Date",
    completed: "Completed",
    URGENT: "Urgent",
    HIGH: "High",
    MEDIUM: "Medium",
    LOW: "Low",
    NO_PRIORITY: "No Priority",
  };

  const groupOrder = [
    "overdue",
    "today",
    "upcoming",
    "later",
    "noDate",
    "completed",
    "URGENT",
    "HIGH",
    "MEDIUM",
    "LOW",
    "NO_PRIORITY",
  ];

  return (
    <div className="mx-auto max-w-3xl animate-fade-in px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="m-0 text-2xl font-bold">My Work</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tasks assigned to you across all projects
          </p>
        </div>

        <div className="flex gap-2">
          {(["dueDate", "priority", "project"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`rounded-md border border-border px-3.5 py-1.5 text-[13px] ${
                groupBy === g
                  ? "bg-accent font-semibold"
                  : "bg-surface font-normal"
              }`}
            >
              {g === "dueDate"
                ? "By Due Date"
                : g === "priority"
                  ? "By Priority"
                  : "By Project"}
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="mb-8 flex gap-4">
          {[
            { label: "Total", value: summary.total, color: "text-foreground" },
            {
              label: "Completed",
              value: summary.completed,
              color: "text-success",
            },
            {
              label: "Overdue",
              value: summary.overdue,
              color: "text-destructive",
            },
            {
              label: "Due Today",
              value: summary.dueToday,
              color: "text-warning",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-lg border border-border p-4 text-center card-hover"
            >
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {groupOrder.map((key) => {
        const section = groups[key];
        if (!section || section.length === 0) return null;
        return (
          <div key={key} className="mb-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {sectionTitles[key] ?? key} ({section.length})
            </h2>
            <div className="flex flex-col gap-1">
              {section.map((task) => {
                const ps =
                  PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.NO_PRIORITY;
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-md border border-border bg-surface px-3.5 py-2.5 card-hover"
                  >
                    <div className="min-w-[80px] text-xs font-semibold text-muted-foreground">
                      {task.key}
                    </div>
                    <div className="flex-1 text-sm font-medium">
                      {task.title}
                    </div>
                    {task.priority && task.priority !== "NO_PRIORITY" && (
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] ${ps.bg} ${ps.text}`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="p-12 text-center text-muted-foreground">
          No tasks assigned to you yet
        </div>
      )}
    </div>
  );
}
