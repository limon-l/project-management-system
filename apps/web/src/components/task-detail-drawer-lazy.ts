import dynamic from "next/dynamic";

export const TaskDetailDrawer = dynamic(
  () => import("@/components/task-detail-drawer").then((m) => ({ default: m.TaskDetailDrawer })),
  { ssr: false }
);
