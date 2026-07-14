/**
 * Sitemap — BoardFlow
 */

export const SITEMAP = {
  /** Public routes */
  public: {
    "/": { name: "Landing", description: "Marketing home page" },
    "/login": { name: "Login", description: "Sign in page" },
    "/register": { name: "Register", description: "Create account" },
    "/forgot-password": { name: "Forgot Password", description: "Request password reset" },
    "/reset-password": { name: "Reset Password", description: "Set new password (token in URL)" },
  },

  /** Authenticated routes */
  authenticated: {
    "/dashboard": { name: "Dashboard", description: "Main dashboard — workspace overview" },
    "/my-work": { name: "My Work", description: "Personal task dashboard across all workspaces" },
    "/notifications": { name: "Notifications", description: "In-app notification center" },
    "/settings": { name: "Account Settings", description: "Profile, password, preferences" },
  },

  /** Workspace routes */
  workspace: {
    "/workspaces/:id": { name: "Workspace Dashboard", description: "Workspace overview with projects" },
    "/workspaces/:id/members": { name: "Workspace Members", description: "Member list and management" },
    "/workspaces/:id/settings": { name: "Workspace Settings", description: "Name, description, delete" },
    "/workspaces/:id/activity": { name: "Workspace Activity", description: "Cross-project activity feed" },
  },

  /** Project routes */
  project: {
    "/workspaces/:wsId/projects/:pId/board": { name: "Board", description: "Kanban board view" },
    "/workspaces/:wsId/projects/:pId/list": { name: "List", description: "Tabular task list view" },
    "/workspaces/:wsId/projects/:pId/members": { name: "Project Members", description: "Project member list" },
    "/workspaces/:wsId/projects/:pId/activity": { name: "Project Activity", description: "Project activity timeline" },
    "/workspaces/:wsId/projects/:pId/files": { name: "Project Files", description: "Shared project files" },
    "/workspaces/:wsId/projects/:pId/settings": { name: "Project Settings", description: "Project configuration" },
  },
} as const;

/**
 * Responsive Behavior
 *
 * Mobile (< 640px):
 *   - Sidebar hidden behind hamburger menu
 *   - Board columns snap-scroll horizontally, each column is ~80vw
 *   - Task drawer opens as full-screen overlay
 *   - Bottom tab bar with: Home, Board, My Work, Notifications
 *   - Modal dialogs are full-screen bottom sheets
 *   - Drag-and-drop disabled; use "Move to column" action menu instead
 *
 * Tablet (640px - 1024px):
 *   - Sidebar collapsed by default (icons only, shows labels on tap)
 *   - Board shows 2-3 columns at a time with horizontal scroll
 *   - Task drawer opens sliding from right, not full-screen
 *   - Bottom tab bar on mobile orientation, sidebar on landscape
 *
 * Desktop (> 1024px):
 *   - Full sidebar visible (260px)
 *   - Board shows all columns with horizontal scroll if needed
 *   - Task drawer 480px wide, slides over board
 *   - All drag-and-drop interactions enabled
 *   - Keyboard shortcuts enabled
 *
 * Breakpoint reference:
 *   sm: 640px   — Mobile landscape / small tablet
 *   md: 768px   — Tablet portrait
 *   lg: 1024px  — Tablet landscape / small desktop
 *   xl: 1280px  — Desktop
 *   2xl: 1536px — Large desktop
 */
