"use client";

import { useEffect, useState } from "react";
import { API_URL as API } from "@/lib/utils";

interface ProjectAnalytics {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  overdueTasks: number;
  tasksByPriority: Record<string, number>;
  tasksByAssignee: { userId: string; name: string; taskCount: number }[];
  status: string;
}

export function ProjectAnalytics({ projectId }: { projectId: string }) {
  const [data, setData] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/projects/${projectId}/analytics`, {
          credentials: "include",
        });
        const json = await res.json() as { success: boolean; data: ProjectAnalytics };
        if (json.success) setData(json.data);
      } catch {
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [projectId]);

  if (loading) {
    return <div className="p-4 text-xs text-muted-foreground">Loading analytics...</div>;
  }

  if (error) {
    return <div className="p-4 text-xs text-destructive">{error}</div>;
  }

  if (!data) return null;

  const priorityColorMap: Record<string, string> = {
    URGENT: "bg-destructive",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-blue-500",
    NO_PRIORITY: "bg-muted-foreground",
  };

  const maxPriorityCount = Math.max(...Object.values(data.tasksByPriority), 1);

  const completionColor =
    data.completionPercentage >= 80
      ? "text-success"
      : data.completionPercentage >= 50
        ? "text-warning"
        : "text-destructive";

  const completionBarColor =
    data.completionPercentage >= 80
      ? "bg-success"
      : data.completionPercentage >= 50
        ? "bg-warning"
        : "bg-destructive";

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold">Project Analytics</h3>

      <div className="mb-6 grid grid-cols-4 gap-3">
        {[
          { label: "Total Tasks", value: data.totalTasks, colorClass: "text-foreground" },
          { label: "Completed", value: data.completedTasks, colorClass: "text-success" },
          { label: "Completion", value: `${data.completionPercentage}%`, colorClass: completionColor },
          {
            label: "Overdue",
            value: data.overdueTasks,
            colorClass: data.overdueTasks > 0 ? "text-destructive" : "text-muted-foreground",
          },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-3 text-center">
            <div className={`text-2xl font-bold ${s.colorClass}`}>{s.value}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="mb-5">
        <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{data.completionPercentage}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className={`h-full rounded-full transition-all ${completionBarColor}`}
            style={{ width: `${data.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Tasks by priority */}
      {Object.keys(data.tasksByPriority).length > 0 && (
        <div className="mb-5">
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tasks by Priority (incomplete)
          </h4>
          <div className="flex flex-col gap-1.5">
            {Object.entries(data.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center gap-2">
                <span className="w-20 text-xs text-foreground">{priority}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${priorityColorMap[priority] ?? "bg-muted-foreground"}`}
                    style={{ width: `${(count / maxPriorityCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-xs font-semibold text-muted-foreground">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top assignees */}
      {data.tasksByAssignee.length > 0 && (
        <div>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Top Assignees
          </h4>
          <div className="flex flex-col gap-1">
            {data.tasksByAssignee.slice(0, 5).map((a) => (
              <div
                key={a.userId}
                className="flex justify-between border-b border-accent py-1.5 text-[13px]"
              >
                <span>{a.name}</span>
                <span className="font-semibold text-muted-foreground">{a.taskCount} tasks</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
