"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/projects/${projectId}/analytics`, {
          credentials: "include",
        });
        const json = await res.json() as { success: boolean; data: ProjectAnalytics };
        if (json.success) setData(json.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [projectId]);

  if (loading) {
    return <div style={{ padding: "16px", color: "#9ca3af", fontSize: "14px" }}>Loading analytics...</div>;
  }

  if (!data) return null;

  const priorityColors: Record<string, string> = {
    URGENT: "#ef4444",
    HIGH: "#f97316",
    MEDIUM: "#eab308",
    LOW: "#3b82f6",
    NO_PRIORITY: "#9ca3af",
  };

  const maxPriorityCount = Math.max(...Object.values(data.tasksByPriority), 1);

  return (
    <div>
      <h3 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>Project Analytics</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Tasks", value: String(data.totalTasks), color: "#374151" },
          { label: "Completed", value: String(data.completedTasks), color: "#10b981" },
          { label: "Completion", value: `${String(data.completionPercentage)}%`, color: data.completionPercentage >= 80 ? "#10b981" : data.completionPercentage >= 50 ? "#f59e0b" : "#ef4444" },
          { label: "Overdue", value: String(data.overdueTasks), color: data.overdueTasks > 0 ? "#ef4444" : "#9ca3af" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginBottom: "6px" }}>
          <span>Progress</span>
          <span>{`${String(data.completionPercentage)}%`}</span>
        </div>
        <div style={{ height: "8px", borderRadius: "4px", background: "#e5e7eb", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "4px", background: data.completionPercentage >= 80 ? "#10b981" : data.completionPercentage >= 50 ? "#f59e0b" : "#ef4444", width: `${String(data.completionPercentage)}%`, transition: "width 0.5s" }} />
        </div>
      </div>

      {/* Tasks by priority */}
      {Object.keys(data.tasksByPriority).length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase" }}>
            Tasks by Priority (incomplete)
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {Object.entries(data.tasksByPriority).map(([priority, count]) => (
              <div key={priority} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "80px", fontSize: "12px", color: "#374151" }}>{priority}</span>
                <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#e5e7eb", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: "3px", background: priorityColors[priority] ?? "#9ca3af", width: `${String((count / maxPriorityCount) * 100)}%` }} />
                </div>
                <span style={{ width: "24px", textAlign: "right", fontSize: "12px", color: "#6b7280", fontWeight: 600 }}>{String(count)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top assignees */}
      {data.tasksByAssignee.length > 0 && (
        <div>
          <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase" }}>
            Top Assignees
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {data.tasksByAssignee.slice(0, 5).map((a) => (
              <div key={a.userId} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f3f4f6", fontSize: "13px" }}>
                <span>{a.name}</span>
                <span style={{ color: "#6b7280", fontWeight: 600 }}>{`${String(a.taskCount)} tasks`}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
