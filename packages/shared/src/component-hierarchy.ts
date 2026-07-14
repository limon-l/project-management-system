/**
 * Component Hierarchy — BoardFlow Design System
 *
 * Layout:
 *   <AppShell>
 *     <Sidebar>
 *       <WorkspaceSwitcher />
 *       <NavLinks />
 *       <UserMenu />
 *     </Sidebar>
 *     <MainContent>
 *       <PageHeader />
 *       {children}
 *     </MainContent>
 *   </AppShell>
 *
 * Board View:
 *   <BoardPage>
 *     <ProjectHeader />
 *     <BoardToolbar />        — filters, search, view switcher
 *     <Board>
 *       <BoardColumn>         — renders column header + task list
 *         <ColumnHeader />    — name, task count, menu
 *         <TaskList>          — sortable container
 *           <TaskCard />      — draggable card
 *         </TaskList>
 *         <AddTaskButton />
 *       </BoardColumn>
 *       <AddColumnButton />
 *     </Board>
 *   </BoardPage>
 *
 * Task Detail:
 *   <TaskDetailDrawer>       — slides in from right
 *     <TaskDetailHeader />   — title, key, close, menu
 *     <TaskDetailBody>
 *       <TaskDescription />
 *       <TaskAssignees />
 *       <TaskPriorityPicker />
 *       <TaskDatePicker />
 *       <TaskLabels />
 *       <TaskChecklist />
 *       <TaskAttachments />
 *     </TaskDetailBody>
 *     <TaskDetailSidebar>
 *       <TaskActivity />
 *     </TaskDetailSidebar>
 *     <CommentSection />     — bottom section
 *   </TaskDetailDrawer>
 *
 * Dashboard:
 *   <DashboardPage>
 *     <MyTasksSection />
 *     <RecentActivity />
 *     <UpcomingDeadlines />
 *   </DashboardPage>
 *
 * Workspace:
 *   <WorkspacePage>
 *     <WorkspaceHeader />
 *     <ProjectList />
 *     <MemberList />
 *     <WorkspaceSettings />
 *   </WorkspacePage>
 *
 * Project:
 *   <ProjectPage>            — tabbed layout
 *     <ProjectTabs />        — Board, List, Members, Activity, Files, Settings
 *     {tab content}
 *   </ProjectPage>
 *
 * Shared/UI Primitives:
 *   <Button />              — variant: primary, secondary, ghost, danger
 *   <Input />               — text, email, password, search
 *   <Select />
 *   <Dialog />              — modal
 *   <DropdownMenu />
 *   <Popover />
 *   <Tooltip />
 *   <Avatar />
 *   <Badge />               — label, priority, status
 *   <Skeleton />            — loading skeleton
 *   <EmptyState />
 *   <Spinner />
 *   <Toast />               — via sonner
 *   <Kbd />                 — keyboard shortcut indicator
 */

export const COMPONENT_CATEGORIES = {
  LAYOUT: ["AppShell", "Sidebar", "MainContent", "PageHeader"],
  BOARD: [
    "Board",
    "BoardColumn",
    "ColumnHeader",
    "TaskList",
    "TaskCard",
    "AddTaskButton",
    "AddColumnButton",
    "BoardToolbar",
  ],
  TASK_DETAIL: [
    "TaskDetailDrawer",
    "TaskDetailHeader",
    "TaskDescription",
    "TaskAssignees",
    "TaskPriorityPicker",
    "TaskDatePicker",
    "TaskLabels",
    "TaskChecklist",
    "TaskAttachments",
  ],
  COMMENTS: ["CommentSection", "CommentItem", "CommentForm", "MentionInput"],
  WORKSPACE: [
    "WorkspaceSwitcher",
    "WorkspacePage",
    "WorkspaceHeader",
    "ProjectList",
    "MemberList",
    "InviteDialog",
    "InvitationList",
  ],
  PROJECT: [
    "ProjectPage",
    "ProjectHeader",
    "ProjectTabs",
    "ProjectSettings",
    "ProjectMembers",
    "ProjectActivity",
  ],
  DASHBOARD: [
    "MyWorkPage",
    "MyTasksSection",
    "TodaySection",
    "UpcomingSection",
    "OverdueSection",
    "ActivityFeed",
  ],
  NOTIFICATIONS: [
    "NotificationPanel",
    "NotificationItem",
    "NotificationBadge",
    "NotificationPreferences",
  ],
  AUTH: ["LoginForm", "RegisterForm", "ForgotPasswordForm", "ResetPasswordForm"],
  UI: [
    "Button",
    "Input",
    "Select",
    "Dialog",
    "DropdownMenu",
    "Popover",
    "Tooltip",
    "Avatar",
    "Badge",
    "Skeleton",
    "EmptyState",
    "Spinner",
    "Kbd",
    "Tabs",
    "Separator",
  ],
} as const;
