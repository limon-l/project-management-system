# BoardFlow

> A production-grade, real-time project management system built with a modern monorepo architecture — featuring Kanban boards, team collaboration, task dependencies, analytics, and more.

![BoardFlow](https://img.shields.io/badge/Built_With-Next.js_15-black?style=flat-square&logo=next.js)
![Fastify](https://img.shields.io/badge/API-Fastify_5-000000?style=flat-square&logo=fastify)
![MongoDB](https://img.shields.io/badge/Database-MongoDB_7-47A248?style=flat-square&logo=mongodb)
![TypeScript](https://img.shields.io/badge/Language-TypeScript_5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Live:** [Frontend (Vercel)](https://project-management-system-web-rho.vercel.app) · [API (Render)](https://project-management-system-u5xh.onrender.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Real-Time Features](#real-time-features)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Core Functionality
- **Kanban Boards** — Drag-and-drop task management with customizable columns and WIP limits
- **Multi-Workspace Support** — Organize projects across workspaces with role-based access
- **Task Management** — Create, assign, prioritize, and track tasks with labels, checklists, due dates, and attachments
- **Task Dependencies** — Define blocking relationships between tasks with dependency visualization
- **Project Views** — Switch between board, list, and analytics views per project
- **Comments & Activity** — Threaded discussions and full activity history on every task

### Collaboration
- **Real-Time Updates** — WebSocket-powered live sync across all connected clients
- **Team Workspaces** — Invite members, assign roles (Owner, Admin, Member, Guest), manage permissions
- **Notifications** — In-app notification center with read/unread tracking
- **Global Search** — Instantly search across tasks, projects, and workspaces
- **Command Palette** — Keyboard-driven navigation (`Ctrl/Cmd + K`) for power users

### Analytics & Reporting
- **Workspace Analytics** — Task distribution, completion rates, member workload charts
- **Project Analytics** — Velocity tracking, burndown-style insights, status breakdowns
- **My Work** — Personal task dashboard grouped by project, priority, or status

### Security & Auth
- **Session-Based Authentication** — Secure HTTP-only cookie sessions with Argon2 password hashing
- **Email Verification** — Token-based email verification flow
- **Password Reset** — Forgot/reset password workflow with secure token expiration
- **Role-Based Access Control** — Granular permissions per workspace role
- **Security Headers** — CSP, HSTS, Permissions-Policy, X-Frame-Options in production

### Developer Experience
- **Monorepo** — Turborepo + pnpm workspaces for fast, incremental builds
- **Shared Package** — Common types, Zod validation schemas, constants, and design tokens
- **Type Safety** — End-to-end TypeScript with strict mode
- **Hot Reload** — Instant feedback during development across all packages

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React 19, Tailwind CSS 4, TanStack Query, Zustand, dnd-kit, Socket.IO Client |
| **Backend** | Fastify 5, Mongoose 8, Socket.IO 4, Argon2, nanoid |
| **Database** | MongoDB 7 (Atlas or local) |
| **Shared** | TypeScript 5, Zod, shared constants & types |
| **Build** | Turborepo, pnpm 9, TypeScript project references |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                      Turborepo                           │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │   apps/web   │  │  apps/api    │  │ packages/shared│  │
│  │  Next.js 15  │  │  Fastify 5   │  │   Zod + Types  │  │
│  │  React 19    │  │  Mongoose 8  │  │   Constants    │  │
│  │  Tailwind 4  │  │  Socket.IO 4 │  │   Design Tokens│  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                  │                  │           │
│         │    REST + WS     │                  │           │
│         └──────────────────┴──────────────────┘           │
│                        │                                  │
│                 ┌──────┴──────┐                           │
│                 │   MongoDB 7  │                           │
│                 └─────────────┘                           │
└──────────────────────────────────────────────────────────┘
```

- **`apps/web`** — Next.js 15 App Router with React 19, Tailwind CSS 4, and client-side state management via Zustand + TanStack Query
- **`apps/api`** — Fastify 5 REST API with Mongoose ODM, cookie-based sessions, RBAC middleware, Socket.IO for real-time events, and structured logging
- **`packages/shared`** — Zod validation schemas, TypeScript interfaces, role/status/priority constants, and design tokens shared across both apps

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9.15.0+ (`corepack enable`)
- [MongoDB](https://www.mongodb.com/) 7+ (local, Docker, or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/limon-l/project-management-system.git
cd project-management-system

# Enable pnpm via corepack
corepack enable
corepack prepare pnpm@9.15.0 --activate

# Install all dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and session secret
```

### Local Development

```bash
# Start MongoDB (if running locally)
docker compose up -d

# Start all apps in development mode
pnpm dev
```

This starts:
- **API** → `http://localhost:3001`
- **Web** → `http://localhost:3000`

### Build & Typecheck

```bash
# Build all packages
pnpm build

# Typecheck all packages
pnpm typecheck

# Run linter
pnpm lint
```

---

## Environment Variables

### Root `.env` (used by both apps)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URI` | Yes | `mongodb://localhost:27017/boardflow` | MongoDB connection string |
| `SESSION_SECRET` | Yes | — | Random string for session signing (min 32 chars) |
| `SESSION_MAX_AGE` | No | `604800000` | Session max age in ms (default 7 days) |
| `CORS_ORIGIN` | Yes | `http://localhost:3000` | Comma-separated allowed origins |
| `API_PORT` | No | `3001` | API server port |
| `API_HOST` | No | `0.0.0.0` | API server host |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `MAX_FILE_SIZE` | No | `10485760` | Max upload size in bytes (10MB) |
| `STORAGE_TYPE` | No | `local` | `local` or `s3` for file storage |
| `UPLOAD_DIR` | No | `./uploads` | Local upload directory |
| `NEXT_PUBLIC_API_URL` | Yes | `http://localhost:3001` | API URL (client-side) |
| `NEXT_PUBLIC_APP_URL` | Yes | `http://localhost:3000` | App URL (client-side) |

### Optional S3/R2 Storage

| Variable | Description |
|---|---|
| `S3_ENDPOINT` | S3-compatible endpoint (e.g., Cloudflare R2) |
| `S3_REGION` | Storage region |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |
| `S3_BUCKET` | Bucket name |
| `S3_PUBLIC_URL` | Public URL for served files |

---

## Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Set **Root Directory** to `apps/web`
4. Framework: **Next.js** (auto-detected)
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL` → your Render API URL
   - `NEXT_PUBLIC_APP_URL` → your Vercel frontend URL

### Backend (Render)

1. Create a **Web Service** on [Render](https://render.com)
2. **Build Command:**
   ```bash
   corepack enable && corepack prepare pnpm@9.15.0 --activate && pnpm install --frozen-lockfile && pnpm --filter @boardflow/shared build && pnpm --filter @boardflow/api build
   ```
3. **Start Command:** `node apps/api/dist/index.js`
4. **Health Check Path:** `/api/health`
5. Add environment variables in the Render dashboard (see table above)
6. Set `CORS_ORIGIN` to your Vercel frontend URL

### Database (MongoDB Atlas)

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user
3. Whitelist your IP (or `0.0.0.0/0` for Render)
4. Copy the connection string to `MONGODB_URI`

---

## Project Structure

```
project-management-system/
├── apps/
│   ├── api/                          # Fastify REST API
│   │   ├── src/
│   │   │   ├── index.ts              # Entry point, server bootstrap
│   │   │   ├── config/               # Database & app config
│   │   │   ├── middleware/           # Auth, RBAC, error handling
│   │   │   ├── models/              # 18 Mongoose models
│   │   │   ├── routes/              # 13 route modules
│   │   │   ├── socket/              # Socket.IO event handlers
│   │   │   └── utils/               # Helpers, logging, responses
│   │   └── package.json
│   │
│   └── web/                          # Next.js 15 frontend
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   │   ├── page.tsx          # Landing page (13 sections)
│       │   │   ├── dashboard/        # Dashboard with sidebar
│       │   │   ├── login/            # Auth pages
│       │   │   ├── register/
│       │   │   └── workspaces/       # Workspace & board views
│       │   ├── components/           # 18 reusable components
│       │   ├── hooks/                # 6 custom React hooks
│       │   ├── providers/            # 5 context providers
│       │   └── lib/                  # API client, utilities
│       └── package.json
│
├── packages/
│   └── shared/                       # Shared package
│       ├── src/
│       │   ├── types/                # TypeScript interfaces
│       │   ├── validation/           # Zod schemas
│       │   ├── constants/            # Roles, statuses, events
│       │   └── design-tokens/        # Shared design values
│       └── package.json
│
├── pnpm-workspace.yaml
├── turbo.json                        # Turborepo pipeline config
├── docker-compose.yml                # Local MongoDB
├── render.yaml                       # Render deployment config
├── .env.example                      # Environment template
└── README.md
```

---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/register` | Create account |
| `POST` | `/auth/login` | Sign in |
| `POST` | `/auth/logout` | Sign out |
| `GET` | `/auth/me` | Get current user |
| `POST` | `/auth/forgot-password` | Request password reset |
| `POST` | `/auth/reset-password` | Reset password with token |
| `POST` | `/auth/verify-email` | Verify email address |

### Workspaces
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workspaces` | List user's workspaces |
| `POST` | `/workspaces` | Create workspace |
| `GET` | `/workspaces/:id` | Get workspace |
| `PATCH` | `/workspaces/:id` | Update workspace |
| `DELETE` | `/workspaces/:id` | Delete workspace |
| `POST` | `/workspaces/:id/invite` | Invite member |
| `PUT` | `/workspaces/:id/members/:userId` | Update member role |
| `DELETE` | `/workspaces/:id/members/:userId` | Remove member |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/workspaces/:wid/projects` | List projects |
| `POST` | `/workspaces/:wid/projects` | Create project |
| `GET` | `/projects/:id` | Get project |
| `PUT` | `/projects/:id` | Update project |
| `DELETE` | `/projects/:id` | Delete project |

### Boards & Tasks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/projects/:pid/boards` | List boards |
| `POST` | `/projects/:pid/boards` | Create board |
| `GET` | `/boards/:id` | Get board with columns & tasks |
| `POST` | `/boards/:bid/columns` | Add column |
| `POST` | `/boards/:bid/tasks` | Create task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |
| `POST` | `/tasks/:id/reorder` | Reorder task |
| `POST` | `/tasks/:id/assign` | Assign user |
| `POST` | `/tasks/:id/labels` | Add label |
| `POST` | `/tasks/:id/checklist` | Add checklist item |
| `POST` | `/tasks/:id/dependencies` | Add dependency |

### Comments & Attachments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/tasks/:id/comments` | List comments |
| `POST` | `/tasks/:id/comments` | Add comment |
| `PUT` | `/comments/:id` | Edit comment |
| `DELETE` | `/comments/:id` | Delete comment |
| `POST` | `/tasks/:id/attachments` | Upload attachment |
| `GET` | `/attachments/:id` | Download attachment |

### Notifications & Search
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/notifications` | List notifications |
| `PUT` | `/notifications/:id/read` | Mark as read |
| `PUT` | `/notifications/read-all` | Mark all as read |
| `GET` | `/search` | Global search |
| `GET` | `/analytics/workspace/:id` | Workspace analytics |
| `GET` | `/my-work` | User's assigned tasks |

---

## Real-Time Features

BoardFlow uses **Socket.IO** for instant collaboration:

- **Board Rooms** — Users join a board room; task updates, column changes, and assignments are broadcast live
- **Workspace Rooms** — Project creation, member changes, and workspace updates sync in real-time
- **Online Presence** — Track which team members are currently viewing a board
- **Optimistic UI** — Client-side updates are immediate; server confirms in the background

Events are namespaced by project and workspace IDs for efficient routing.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes
4. Run typecheck and lint:
   ```bash
   pnpm typecheck && pnpm lint
   ```
5. Commit your changes (`git commit -m 'feat: add my feature'`)
6. Push to the branch (`git push origin feat/my-feature`)
7. Open a Pull Request

---

## Author

**Limon Roy Apu** — [@limon-l](https://github.com/limon-l) · [Portfolio](https://my-profile-green-beta.vercel.app/)

---

## License

This project is licensed under the MIT License.
