"use client";

import { useEffect, useState } from "react";
import { API_URL as API } from "@/lib/utils";


interface WorkspaceAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  tasksCompletedThisWeek: number;
  tasksByStatus: Record<string, number>;
  tasksByPriority: Record<string, number>;
  workloadByMember: {
    userId: string;
    name: string;
    taskCount: number;
  }[];
  upcomingDeadlines: {
    taskId: string;
    taskKey: string;
    title: string;
    dueDate: string;
  }[];
  recentActivity: number;
}

export function WorkspaceAnalytics({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<WorkspaceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `${API}/api/workspaces/${workspaceId}/analytics`,
          { credentials: "include" },
        );
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [workspaceId]);

  if (loading)
    return (
      <div className="p-4 text-[13px] text-muted-foreground">
        Loading analytics...
      </div>
    );
  if (!data) return null;

  const maxPriority = Math.max(1, ...Object.values(data.tasksByPriority));

  const summaryCards = [
    {
      label: "Projects",
      value: data.totalProjects,
      sub: `${data.activeProjects} active`,
      colorClass: "text-primary",
    },
    {
      label: "Total Tasks",
      value: data.totalTasks,
      sub: `${data.completedTasks} completed`,
      colorClass: "text-foreground",
    },
    {
      label: "Overdue",
      value: data.overdueTasks,
      sub: `${data.tasksCompletedThisWeek} done this week`,
      colorClass: data.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground",
    },
    {
      label: "Activity",
      value: data.recentActivity,
      sub: "events this week",
      colorClass: "text-purple-500",
    },
  ];

  const priorityColorMap: Record<string, string> = {
    URGENT: "bg-destructive",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-muted-foreground",
  };

  return (
    <div className="mb-8 animate-fade-in">
      <h2 className="mb-4 text-base font-semibold">Workspace Overview</h2>

      <div className="mb-5 grid grid-cols-4 gap-3">
        {summaryCards.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border border-border p-4 card-hover"
          >
            <div className={`text-3xl font-bold ${s.colorClass}`}>
              {s.value}
            </div>
            <div className="mt-0.5 text-[13px] font-medium text-foreground">
              {s.label}
            </div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Tasks by priority */}
        {Object.keys(data.tasksByPriority).length > 0 && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
              Tasks by Priority
            </h3>
            <div className="flex flex-col gap-2">
              {Object.entries(data.tasksByPriority).map(([p, c]) => (
                <div key={p} className="flex items-center gap-2">
                  <span className="w-20 text-xs">{p}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-border">
                    <div
                      className={`h-full rounded-full ${
                        priorityColorMap[p] ?? "bg-muted-foreground"
                      }`}
                      style={{
                        width: `${Math.min(100, (c / maxPriority) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming deadlines */}
        {data.upcomingDeadlines.length > 0 && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
              Upcoming Deadlines
            </h3>
            <div className="flex flex-col gap-1.5">
              {data.upcomingDeadlines.slice(0, 5).map((t) => (
                <div
                  key={t.taskId}
                  className="flex justify-between border-b border-accent pb-1 text-[13px]"
                >
                  <div>
                    <span className="mr-1.5 font-semibold text-muted-foreground">
                      {t.taskKey}
                    </span>
                    {t.title}
                  </div>
                  <span className="text-xs text-destructive">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workload by member */}
        {data.workloadByMember.length > 0 && (
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase text-muted-foreground">
              Workload by Member
            </h3>
            <div className="flex flex-col gap-1.5">
              {data.workloadByMember.slice(0, 8).map((m) => (
                <div
                  key={m.userId}
                  className="flex justify-between border-b border-accent pb-1 text-[13px]"
                >
                  <span>{m.name}</span>
                  <span className="font-semibold text-muted-foreground">
                    {m.taskCount} tasks
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
