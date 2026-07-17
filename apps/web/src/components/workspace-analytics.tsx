"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

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
  workloadByMember: { userId: string; name: string; taskCount: number }[];
  upcomingDeadlines: { taskId: string; taskKey: string; title: string; dueDate: string }[];
  recentActivity: number;
}

export function WorkspaceAnalytics({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<WorkspaceAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/workspaces/${workspaceId}/analytics`, {
          credentials: "include",
        });
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

  if (loading) return <div style={{ padding: "16px", color: "#9ca3af", fontSize: "13px" }}>Loading analytics...</div>;
  if (!data) return null;

  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 16px" }}>Workspace Overview</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[
          { label: "Projects", value: data.totalProjects, sub: `${data.activeProjects} active`, color: "#3b82f6" },
          { label: "Total Tasks", value: data.totalTasks, sub: `${data.completedTasks} completed`, color: "#374151" },
          { label: "Overdue", value: data.overdueTasks, sub: `${data.tasksCompletedThisWeek} done this week`, color: data.overdueTasks > 0 ? "#ef4444" : "#9ca3af" },
          { label: "Activity", value: data.recentActivity, sub: "events this week", color: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "#374151", fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
            <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "2px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Tasks by priority */}
        {Object.keys(data.tasksByPriority).length > 0 && (
          <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", margin: "0 0 12px", textTransform: "uppercase" }}>
              Tasks by Priority
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(data.tasksByPriority).map(([p, c]) => (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "80px", fontSize: "12px" }}>{p}</span>
                  <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "#e5e7eb" }}>
                    <div style={{ height: "100%", borderRadius: "3px", background: p === "URGENT" ? "#ef4444" : p === "HIGH" ? "#f97316" : p === "MEDIUM" ? "#eab308" : "#9ca3af", width: `${Math.min(100, (c / Math.max(1, ...Object.values(data.tasksByPriority))) * 100)}%` }} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280" }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming deadlines */}
        {data.upcomingDeadlines.length > 0 && (
          <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", margin: "0 0 12px", textTransform: "uppercase" }}>
              Upcoming Deadlines
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {data.upcomingDeadlines.slice(0, 5).map((t) => (
                <div key={t.taskId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <span style={{ color: "#6b7280", fontWeight: 600, marginRight: "6px" }}>{t.taskKey}</span>
                    {t.title}
                  </div>
                  <span style={{ color: "#ef4444", fontSize: "12px" }}>
                    {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Workload by member */}
        {data.workloadByMember.length > 0 && (
          <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", margin: "0 0 12px", textTransform: "uppercase" }}>
              Workload by Member
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {data.workloadByMember.slice(0, 8).map((m) => (
                <div key={m.userId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "4px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span>{m.name}</span>
                  <span style={{ fontWeight: 600, color: "#6b7280" }}>{m.taskCount} tasks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
