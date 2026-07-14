import type { TaskPriority } from "./index.js";

export interface ActivityMetadataMap {
  project_created: { projectName: string; projectKey: string };
  project_updated: { changes: string[] };
  project_archived: {};
  member_added: { addedUserId: string; addedUserName: string; role: string };
  member_removed: { removedUserId: string; removedUserName: string };
  task_created: { taskKey: string; taskTitle: string; columnName: string };
  task_updated: { taskKey: string; changes: string[] };
  task_moved: {
    taskKey: string;
    taskTitle: string;
    fromColumn: string;
    toColumn: string;
  };
  task_deleted: { taskKey: string; taskTitle: string };
  task_assigned: {
    taskKey: string;
    taskTitle: string;
    assigneeId: string;
    assigneeName: string;
  };
  task_unassigned: {
    taskKey: string;
    taskTitle: string;
    previousAssigneeId: string;
  };
  priority_changed: {
    taskKey: string;
    taskTitle: string;
    from: TaskPriority;
    to: TaskPriority;
  };
  due_date_changed: {
    taskKey: string;
    taskTitle: string;
    from: string | null;
    to: string | null;
  };
  comment_added: { taskKey: string; taskTitle: string; snippet: string };
  comment_deleted: { taskKey: string; taskTitle: string };
  attachment_uploaded: {
    taskKey: string;
    taskTitle: string;
    fileName: string;
  };
  attachment_deleted: {
    taskKey: string;
    taskTitle: string;
    fileName: string;
  };
  column_created: { columnName: string };
  column_updated: { columnName: string; changes: string[] };
  column_deleted: { columnName: string };
}

export type ActivityActionType = keyof ActivityMetadataMap;
