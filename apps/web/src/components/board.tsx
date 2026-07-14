"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { BoardColumn } from "./board-column";
import { TaskCard } from "./task-card";
import type { Task, Column } from "@/hooks/use-tasks";

interface BoardProps {
  columns: Column[];
  tasks: Task[];
  onTaskMove: (
    taskId: string,
    targetColumnId: string,
    position: string
  ) => void;
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
}

export function Board({
  columns,
  tasks,
  onTaskMove,
  onTaskClick,
  onAddTask,
}: BoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getTasksForColumn = useCallback(
    (columnId: string) => {
      return tasks
        .filter((t) => t.columnId === columnId)
        .sort((a, b) => a.position.localeCompare(b.position));
    },
    [tasks]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const task = tasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      // Determine target column
      let targetColumnId: string;

      // Check if dropped over a column directly
      const overData = over.data?.current;
      if (overData?.column) {
        targetColumnId = overData.column.id as string;
      } else {
        // Dropped over another task — find which column that task is in
        const overTask = tasks.find((t) => t.id === over.id);
        if (overTask) {
          targetColumnId = overTask.columnId;
        } else {
          // Dropped over a column id
          const overColumn = columns.find((c) => c.id === over.id);
          if (overColumn) {
            targetColumnId = overColumn.id;
          } else {
            return;
          }
        }
      }

      // Calculate new position
      const columnTasks = getTasksForColumn(targetColumnId).filter(
        (t) => t.id !== taskId
      );

      const overIndex = columnTasks.findIndex((t) => t.id === over.id);
      let newPosition: string;

      if (overIndex === -1) {
        // Dropped at end of column
        const lastPos = columnTasks[columnTasks.length - 1]?.position;
        newPosition = lastPos
          ? String(parseInt(lastPos) + 1000)
          : "0001000";
      } else {
        // Insert before/after the target task
        const prev = columnTasks[overIndex - 1];
        const curr = columnTasks[overIndex];

        if (prev) {
          newPosition = String(
            Math.floor((parseInt(prev.position) + parseInt(curr.position)) / 2)
          );
        } else {
          newPosition = String(Math.floor(parseInt(curr.position) / 2)) || "500";
        }
      }

      // Only move if something changed
      if (
        task.columnId !== targetColumnId ||
        task.position !== newPosition
      ) {
        onTaskMove(taskId, targetColumnId, newPosition);
      }
    },
    [tasks, columns, onTaskMove, getTasksForColumn]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto p-4" style={{ minHeight: "calc(100vh - 120px)" }}>
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={getTasksForColumn(column.id)}
            onTaskClick={onTaskClick}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} onClick={() => {}} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
