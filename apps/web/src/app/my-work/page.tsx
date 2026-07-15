"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

interface Task {
  id: string;
  key: string;
  title: string;
  priority: string;
  dueDate: string | null;
  completed: boolean;
  projectId: string;
  assigneeIds: { _id: string; name: string; avatarUrl: string | null }[];
}

interface Summary {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
}

export default function MyWorkPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"dueDate" | "priority" | "project">("dueDate");
  const [groups, setGroups] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }

    async function load() {
      try {
        const [tasksRes, summaryRes] = await Promise.all([
          fetch(`${API}/api/my-work/tasks?groupBy=${groupBy}`, { credentials: "include" }),
          fetch(`${API}/api/my-work/summary`, { credentials: "include" }),
        ]);
        const tasksJson = await tasksRes.json() as { success: boolean; data: { tasks: Task[]; groups?: Record<string, Task[]> } };
        const summaryJson = await summaryRes.json() as { success: boolean; data: Summary };
        if (tasksJson.success) {
          setTasks(tasksJson.data.tasks);
          setGroups(tasksJson.data.groups ?? {});
        }
        if (summaryJson.success) setSummary(summaryJson.data);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [user, authLoading, router, groupBy]);

  if (authLoading || loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>Loading...</div>;
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

  const groupOrder = ["overdue", "today", "upcoming", "later", "noDate", "completed",
    "URGENT", "HIGH", "MEDIUM", "LOW", "NO_PRIORITY"];

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 700 }}>My Work</h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
            Tasks assigned to you across all projects
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {(["dueDate", "priority", "project"] as const).map((g) => (
            <button
              key={g}
              onClick={() => { setGroupBy(g); }}
              style={{
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid #e5e7eb",
                background: groupBy === g ? "#f3f4f6" : "#fff",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: groupBy === g ? 600 : 400,
              }}
            >
              {g === "dueDate" ? "By Due Date" : g === "priority" ? "By Priority" : "By Project"}
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total", value: summary.total, color: "#374151" },
            { label: "Completed", value: summary.completed, color: "#10b981" },
            { label: "Overdue", value: summary.overdue, color: "#ef4444" },
            { label: "Due Today", value: summary.dueToday, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb", textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {groupOrder.map((key) => {
        const section = groups[key];
        if (!section || section.length === 0) return null;
        return (
          <div key={key} style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#6b7280", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {sectionTitles[key] ?? key} ({section.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {section.map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 600, minWidth: "80px" }}>
                    {task.key}
                  </div>
                  <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>{task.title}</div>
                  {task.priority && task.priority !== "NO_PRIORITY" && (
                    <span style={{
                      fontSize: "11px",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      background: task.priority === "URGENT" ? "#fef2f2" : task.priority === "HIGH" ? "#fff7ed" : task.priority === "MEDIUM" ? "#fffbeb" : "#f9fafb",
                      color: task.priority === "URGENT" ? "#dc2626" : task.priority === "HIGH" ? "#ea580c" : task.priority === "MEDIUM" ? "#d97706" : "#6b7280",
                    }}>
                      {task.priority}
                    </span>
                  )}
                  {task.dueDate && (
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div style={{ padding: "48px", textAlign: "center", color: "#9ca3af" }}>
          No tasks assigned to you yet
        </div>
      )}
    </div>
  );
}
