"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProject } from "@/hooks/use-projects";
import { useRealtime } from "@/hooks/use-realtime";
import {
  useProjectTasks,
  useProjectColumns,
  useMoveTask,
  useCreateTask,
} from "@/hooks/use-tasks";
import { Board } from "@/components/board";
import { CreateTaskForm } from "@/components/create-task-form";
import { ProjectLayout } from "@/components/project-layout";
import { TaskDetailDrawer } from "@/components/task-detail-drawer-lazy";
import { Task } from "@/hooks/use-tasks";

interface BoardPageProps {
  projectId: string;
  workspaceId: string;
}

export function BoardPage({ projectId, workspaceId }: BoardPageProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { data: tasks = [], isLoading: tasksLoading } =
    useProjectTasks(projectId);
  const { data: columns = [], isLoading: columnsLoading } =
    useProjectColumns(projectId);
  const { data: project } = useProject(workspaceId, projectId);
  const moveTask = useMoveTask(projectId);
  const createTask = useCreateTask(projectId);
  useRealtime(projectId);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  if (authLoading || tasksLoading || columnsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const handleTaskMove = (
    taskId: string,
    targetColumnId: string,
    position: string
  ) => {
    moveTask.mutate({ taskId, columnId: targetColumnId, position });
  };

  const handleAddTask = (columnId: string) => {
    setAddingToColumn(columnId);
  };

  const handleCreateTask = (title: string) => {
    if (!addingToColumn) return;
    createTask.mutate(
      { title, columnId: addingToColumn },
      { onSuccess: () => { setAddingToColumn(null); } }
    );
  };

  return (
    <ProjectLayout
      projectId={projectId}
      workspaceId={workspaceId}
      projectName={project?.name ?? "Project"}
      projectKey={project?.key ?? "PRJ"}
    >
      <div className="flex h-14 items-center border-b border-border px-6">
        <h1 className="text-lg font-semibold">Board</h1>
      </div>

      <Board
        columns={columns}
        tasks={tasks}
        onTaskMove={handleTaskMove}
        onTaskClick={setSelectedTask}
        onAddTask={handleAddTask}
      />

      {/* Create Task Form Overlay */}
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

      {/* Task Detail Drawer */}
      {selectedTask && (
        <TaskDetailDrawer
          taskId={selectedTask.id}
          projectId={projectId}
          currentUserId={user.id}
          onClose={() => { setSelectedTask(null); }}
        />
      )}
    </ProjectLayout>
  );
}
