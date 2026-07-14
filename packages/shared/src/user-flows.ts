/**
 * User Flows — BoardFlow
 *
 * Each flow describes the step-by-step path a user takes through the application.
 */

export {};

/**
 * AUTHENTICATION FLOW
 *
 * Register:
 *   /register → fill name/email/password → POST /api/auth/register
 *   → receive session cookie → redirect to /dashboard
 *   → email verification link sent → click link → POST /api/auth/verify-email
 *
 * Login:
 *   /login → fill email/password → POST /api/auth/login
 *   → receive session cookie → redirect to /dashboard
 *
 * Logout:
 *   click "Sign out" → POST /api/auth/logout → clear cookie → redirect to /
 *
 * Forgot Password:
 *   /forgot-password → enter email → POST /api/auth/forgot-password
 *   → receive email with reset link → click link → /reset-password?token=...
 *   → enter new password → POST /api/auth/reset-password → redirect to /login
 */

/**
 * WORKSPACE FLOW
 *
 * Create Workspace:
 *   Dashboard → click "Create Workspace" → modal opens → enter name
 *   → POST /api/workspaces → workspace created → user becomes WORKSPACE_OWNER
 *   → workspace appears in sidebar
 *
 * Switch Workspace:
 *   Click workspace in sidebar → workspace selected → shows its projects
 *
 * Invite Member:
 *   Workspace settings → Members → click "Invite" → enter email + select role
 *   → POST /api/workspaces/:id/invite → invitation sent to email
 *   → pending invitation appears in list
 *
 * Accept Invitation:
 *   User receives email with invitation link → clicks link
 *   → GET /api/invitations/:token → shows invitation details
 *   → click "Accept" → POST /api/invitations/:token/respond → workspace added
 *   → redirect to workspace dashboard
 *
 * Remove Member:
 *   Workspace settings → Members → find member → "Remove"
 *   → DELETE /api/workspaces/:id/members/:memberId
 *   → member removed, real-time event emitted
 *
 * Change Role:
 *   Workspace settings → Members → find member → change role dropdown
 *   → PUT /api/workspaces/:id/members/:memberId/role → role updated
 *
 * Leave Workspace:
 *   Workspace settings → "Leave Workspace" → confirm
 *   → POST /api/workspaces/:id/leave → membership removed
 *   → redirect to dashboard
 */

/**
 * PROJECT FLOW
 *
 * Create Project:
 *   Select workspace → click "New Project" → modal opens
 *   → enter name + key → POST /api/workspaces/:wsId/projects
 *   → project created with default board and 5 default columns
 *   → redirect to /workspaces/:wsId/projects/:pId/board
 *
 * Change Project Status:
 *   Project settings → status dropdown → select new status
 *   → PUT /api/projects/:id → status updated
 *   → status transitions validated server-side
 *
 * Add Project Member:
 *   Project → Members → "Add Member" → select user + role
 *   → POST /api/projects/:id/members → member added
 *
 * Archive Project:
 *   Project settings → "Archive" → confirm
 *   → PUT /api/projects/:id { status: "ARCHIVED" }
 *   → project hidden from default views
 */

/**
 * BOARD & TASK FLOW
 *
 * Create Column:
 *   Board → click "+" at end of columns → enter name
 *   → POST /api/boards/:boardId/columns → column created
 *
 * Rename Column:
 *   Column header → click name → edit inline → PUT /api/columns/:id
 *
 * Reorder Columns:
 *   Drag column header → drop at new position
 *   → PUT /api/boards/:boardId/columns/reorder → positions updated
 *
 * Delete Column:
 *   Column menu → "Delete" → if non-empty, choose where to move tasks
 *   → DELETE /api/columns/:id?moveTasksToColumnId=... → column removed
 *
 * Create Task:
 *   Click "+" at bottom of column → task appears inline
 *   → fill title → POST /api/columns/:columnId/tasks → task created
 *   → real-time broadcast to project room
 *
 * Move Task (Drag & Drop):
 *   Drag task card → drop in another column or reorder within column
 *   → optimistic UI update → PUT /api/tasks/:id/move → server confirms
 *   → on failure: rollback position, show error toast
 *   → real-time broadcast to project room
 *
 * Open Task Detail:
 *   Click task card → <TaskDetailDrawer> slides in from right
 *   → shows all task fields, comments, activity
 *   → edit fields inline → auto-saves or explicit save
 *
 * Assign User:
 *   Task detail → Assignees → search/select member
 *   → PUT /api/tasks/:id { assigneeIds: [...] }
 *   → notification sent to assignee via Socket.IO
 *   → activity logged
 *
 * Set Priority:
 *   Task card or detail → click priority badge → select level
 *   → PUT /api/tasks/:id { priority }
 *
 * Add Checklist:
 *   Task detail → Checklist → "Add item" → enter text
 *   → POST /api/tasks/:id/checklist → item created
 *   → check/uncheck → PUT /api/tasks/:taskId/checklist/:itemId
 *
 * Add Label:
 *   Task detail → Labels → select from project labels or create new
 *   → PUT /api/tasks/:id { labelIds: [...] }
 *
 * Set Due Date:
 *   Task detail → Due date → date picker → select date
 *   → PUT /api/tasks/:id { dueDate }
 */

/**
 * COMMENT FLOW
 *
 * Add Comment:
 *   Task detail → Comment section → type in textarea
 *   → use @ to mention users → type message → POST /api/tasks/:taskId/comments
 *   → comment appears optimistically → real-time broadcast
 *   → mentioned users receive notification
 *
 * Edit Comment:
 *   Comment → "Edit" → edit text → save → PUT /api/comments/:id
 *   → "edited" indicator shown
 *
 * Delete Comment:
 *   Comment → "Delete" → confirm → DELETE /api/comments/:id
 *   → comment removed, activity logged
 */

/**
 * NOTIFICATION FLOW
 *
 * Receive Notification:
 *   Socket.IO event → notification:created → badge count updates
 *   → notification appears in top-right toast (sonner)
 *   → notification added to in-app notification center
 *
 * View Notifications:
 *   Click bell icon → <NotificationPanel> slides open
 *   → shows list of notifications sorted by most recent
 *   → unread items highlighted
 *
 * Mark as Read:
 *   Click notification → PUT /api/notifications/:id/read
 *   → notification marked read → count decrements
 *
 * Mark All Read:
 *   Notification panel → "Mark all read" → PUT /api/notifications/read-all
 */

/**
 * SEARCH FLOW
 *
 * Global Search:
 *   Press Cmd+K or click search bar → search overlay opens
 *   → type query → GET /api/workspaces/:id/search?q=...
 *   → results grouped by type (tasks, projects, members)
 *   → click result → navigate to resource
 *
 * Board Filtering:
 *   Board toolbar → click filter button → filter panel opens
 *   → select assignee, priority, label, due date range
 *   → tasks filtered client-side with query parameter support
 *   → "My Tasks" quick filter → show only current user's tasks
 */

/**
 * MY WORK FLOW
 *
 * View My Tasks:
 *   Click "My Work" in sidebar → /my-work
 *   → GET /api/my-work/tasks → shows all assigned tasks across workspaces
 *   → grouped by default by project
 *   → sections: Today, Upcoming (next 7 days), Overdue, Recently Assigned
 *
 * Interact with Task:
 *   Click task in My Work list → TaskDetailDrawer opens → full interaction
 */

/**
 * MOBILE FLOW
 *
 * Narrow Viewport (< 768px):
 *   Sidebar collapses to bottom tab bar or hamburger menu
 *   Board scrolls horizontally with column snap
 *   Task drawer becomes full-screen
 *   Modal dialogs become full-screen sheets
 *   Drag-and-drop replaced with "Move to column" action menu
 */
