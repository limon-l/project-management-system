import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <line x1="3" x2="21" y1="9" y2="9" />
                <line x1="9" x2="9" y1="21" y2="9" />
              </svg>
            </div>
            <span className="text-lg font-bold text-foreground">BoardFlow</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="btn-ripple inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pb-20 pt-24 md:pb-32 md:pt-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 to-transparent blur-3xl" />
            <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-violet-500/10 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Now in public beta &mdash; Try free
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Ship projects
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
                at light speed
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              BoardFlow brings your team together with powerful Kanban boards,
              real-time collaboration, and intelligent automation. Built for
              teams that move fast.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="btn-ripple inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
              >
                Start for free
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-accent hover:shadow-md"
              >
                Watch demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </Link>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              No credit card required &middot; Free forever for small teams
            </p>
          </div>
        </section>

        {/* Trusted By */}
        <section className="border-y border-border bg-surface/50 px-6 py-12">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by innovative teams worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {["Acme Corp", "Globex", "Initech", "Hooli", "Piedmont", "Aperture"].map(
                (company) => (
                  <span
                    key={company}
                    className="text-lg font-bold tracking-tight text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Kanban Board Showcase */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Visual Project Management
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Your workflow, beautifully organized
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Drag-and-drop Kanban boards that make managing work feel
                effortless. See everything at a glance and move work forward
                with ease.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-deep md:p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs font-medium text-muted-foreground">
                  Sprint 24 &mdash; Q2 Release
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Backlog",
                    color: "bg-muted-foreground",
                    tasks: [
                      { name: "Update API docs", tag: "Docs", tagColor: "bg-blue-100 text-blue-700" },
                      { name: "Mobile push notifications", tag: "Feature", tagColor: "bg-purple-100 text-purple-700" },
                    ],
                  },
                  {
                    title: "In Progress",
                    color: "bg-primary",
                    tasks: [
                      { name: "User auth flow redesign", tag: "Design", tagColor: "bg-pink-100 text-pink-700", avatar: "SK" },
                      { name: "Performance optimization", tag: "Eng", tagColor: "bg-emerald-100 text-emerald-700", avatar: "AR" },
                      { name: "Billing integration", tag: "Feature", tagColor: "bg-purple-100 text-purple-700" },
                    ],
                  },
                  {
                    title: "In Review",
                    color: "bg-amber-500",
                    tasks: [
                      { name: "Dark mode support", tag: "Design", tagColor: "bg-pink-100 text-pink-700", avatar: "MJ" },
                      { name: "Rate limiting", tag: "Eng", tagColor: "bg-emerald-100 text-emerald-700", avatar: "TL" },
                    ],
                  },
                  {
                    title: "Done",
                    color: "bg-emerald-500",
                    tasks: [
                      { name: "SSO integration", tag: "Eng", tagColor: "bg-emerald-100 text-emerald-700", avatar: "AR" },
                      { name: "Landing page v2", tag: "Design", tagColor: "bg-pink-100 text-pink-700" },
                      { name: "Onboarding flow", tag: "Feature", tagColor: "bg-purple-100 text-purple-700", avatar: "SK" },
                    ],
                  },
                ].map((column) => (
                  <div key={column.title} className="rounded-xl bg-muted/50 p-4">
                    <div className="mb-4 flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                      <span className="text-sm font-semibold text-foreground">
                        {column.title}
                      </span>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-border text-xs font-medium text-muted-foreground">
                        {column.tasks.length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <div
                          key={task.name}
                          className="rounded-lg border border-border bg-surface p-3 shadow-sm transition-all hover:shadow-md"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${task.tagColor}`}
                            >
                              {task.tag}
                            </span>
                            {task.avatar && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                {task.avatar}
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-medium leading-snug text-foreground">
                            {task.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="border-t border-border bg-surface/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Features
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Everything your team needs
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Powerful features designed for modern development teams. No
                bloat, no complexity &mdash; just what you need to ship faster.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                      <line x1="3" x2="21" y1="9" y2="9" />
                      <line x1="9" x2="9" y1="21" y2="9" />
                    </svg>
                  ),
                  title: "Kanban Boards",
                  desc: "Drag-and-drop boards with custom columns, WIP limits, swimlanes, and buttery smooth animations.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  title: "Real-time Sync",
                  desc: "See changes instantly across all devices. Multiplayer editing with live cursors and presence indicators.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  title: "Team Spaces",
                  desc: "Organize workspaces by team or project. Custom roles, granular permissions, and invite flows.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                  title: "Analytics & Insights",
                  desc: "Burndown charts, velocity tracking, and cycle time metrics. Identify bottlenecks before they happen.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  ),
                  title: "Custom Workflows",
                  desc: "Build workflows that match how your team works. Custom statuses, automation rules, and triggers.",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ),
                  title: "Enterprise Security",
                  desc: "SOC 2 compliant, SSO/SAML, 2FA, and role-based access control. Your data stays yours.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="card-hover group rounded-xl border border-border bg-surface p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Collaboration Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                  Collaboration
                </p>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Work together,
                  <br />
                  in real time
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  See who&apos;s working on what with live cursors and presence.
                  Comment on tasks, tag teammates, and keep conversations
                  attached to the work that matters.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Live cursors & presence", desc: "See teammates in real time" },
                    { label: "Threaded comments", desc: "Keep discussions in context" },
                    { label: "@mentions & notifications", desc: "Never miss what matters" },
                    { label: "Activity feed", desc: "Full history of every change" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-deep">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Task: Redesign dashboard</span>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">Active</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-blue-500 text-[10px] font-bold text-white">SK</div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-emerald-500 text-[10px] font-bold text-white">AR</div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-amber-500 text-[10px] font-bold text-white">MJ</div>
                    </div>
                    <span className="text-xs text-muted-foreground">3 people editing</span>
                  </div>
                  <div className="space-y-3 rounded-xl bg-muted/50 p-4">
                    <div className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[9px] font-bold text-white">SK</div>
                      <div className="rounded-lg bg-surface p-2.5 shadow-sm">
                        <p className="text-xs text-foreground">Updated the header component</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">Just now</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">AR</div>
                      <div className="rounded-lg bg-surface p-2.5 shadow-sm">
                        <p className="text-xs text-foreground">LGTM, merging now</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">2 min ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">MJ</div>
                      <div className="rounded-lg bg-surface p-2.5 shadow-sm">
                        <p className="text-xs text-foreground">Added the new chart components</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">5 min ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="border-t border-border bg-surface/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-deep">
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Sprint Velocity</span>
                    <span className="text-xs text-muted-foreground">Last 6 sprints</span>
                  </div>
                  <div className="mb-6 flex items-end gap-3">
                    {[40, 65, 45, 80, 70, 95].map((h, i) => (
                      <div key={i} className="flex flex-1 flex-col items-center gap-2">
                        <div className="w-full rounded-t-md bg-primary/10" style={{ height: `${h * 0.8}px` }}>
                          <div className="w-full rounded-t-md bg-gradient-to-t from-primary to-blue-500" style={{ height: `${h * 0.6}px` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">847</p>
                      <p className="text-xs text-muted-foreground">Tasks completed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">3.2d</p>
                      <p className="text-xs text-muted-foreground">Avg. cycle time</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">96%</p>
                      <p className="text-xs text-muted-foreground">On-time rate</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                  Analytics
                </p>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Data that drives
                  <br />
                  better decisions
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Get deep insights into your team&apos;s performance. Track
                  velocity, identify blockers, and optimize your process with
                  real-time dashboards and reports.
                </p>
                <div className="space-y-4">
                  {[
                    { label: "Burndown & burnup charts", desc: "Track sprint progress in real time" },
                    { label: "Velocity tracking", desc: "Measure team output over time" },
                    { label: "Cycle time analysis", desc: "Find and fix process bottlenecks" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                  Security
                </p>
                <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                  Enterprise-grade
                  <br />
                  security built in
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                  Your data is protected with industry-leading security. We
                  are SOC 2 Type II compliant and built with security-first
                  architecture from day one.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    ), title: "SOC 2 Type II", desc: "Audited annually" },
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    ), title: "SSO / SAML", desc: "Enterprise auth" },
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                    ), title: "2FA", desc: "Extra protection" },
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    ), title: "Audit Logs", desc: "Full activity trail" },
                  ].map((item) => (
                    <div key={item.title} className="rounded-xl border border-border bg-surface p-4">
                      <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {item.icon}
                      </div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-sm">
                  <div className="rounded-2xl border border-border bg-surface p-8 shadow-deep">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: "Encryption", value: "AES-256" },
                        { label: "Uptime SLA", value: "99.99%" },
                        { label: "Data residency", value: "US / EU / APAC" },
                        { label: "Compliance", value: "SOC 2, GDPR" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <span className="text-sm font-semibold text-foreground">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border bg-surface/50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Testimonials
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Loved by teams worldwide
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                See what our customers have to say about their experience with
                BoardFlow.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  quote:
                    "BoardFlow replaced 4 different tools for our team. The real-time collaboration is seamless and the Kanban boards are the best we've used.",
                  name: "Sarah Chen",
                  role: "Engineering Lead, Acme Corp",
                  avatar: "SC",
                  color: "bg-blue-500",
                },
                {
                  quote:
                    "We migrated from Jira and never looked back. BoardFlow is what project management should feel like — fast, intuitive, and beautiful.",
                  name: "Marcus Rivera",
                  role: "Product Manager, Globex",
                  avatar: "MR",
                  color: "bg-emerald-500",
                },
                {
                  quote:
                    "The analytics alone are worth it. We reduced our average cycle time by 40% in the first month using BoardFlow's insights.",
                  name: "Aisha Patel",
                  role: "CTO, Initech",
                  avatar: "AP",
                  color: "bg-amber-500",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="card-hover rounded-xl border border-border bg-surface p-6"
                >
                  <div className="mb-4 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-amber-400"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="mb-6 text-sm leading-relaxed text-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${t.color}`}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                Pricing
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Start for free, upgrade when you need to. No hidden fees, no
                surprises.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-surface p-8 shadow-premium">
                <h3 className="mb-1 text-lg font-bold text-foreground">Free</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  For small teams getting started
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <Link
                  href="/register"
                  className="mb-8 block rounded-xl border border-border bg-surface py-3 text-center text-sm font-semibold text-foreground transition-all hover:bg-accent"
                >
                  Get started
                </Link>
                <ul className="space-y-3">
                  {[
                    "Up to 5 team members",
                    "3 active projects",
                    "Kanban boards",
                    "Basic analytics",
                    "Community support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-500">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Pro */}
              <div className="relative rounded-2xl border-2 border-primary bg-surface p-8 shadow-deep">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                  Most Popular
                </div>
                <h3 className="mb-1 text-lg font-bold text-foreground">Pro</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  For growing teams that ship fast
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">$12</span>
                  <span className="text-sm text-muted-foreground">/month per user</span>
                </div>
                <Link
                  href="/register"
                  className="btn-ripple mb-8 block rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30"
                >
                  Start free trial
                </Link>
                <ul className="space-y-3">
                  {[
                    "Unlimited team members",
                    "Unlimited projects",
                    "Advanced Kanban + Timeline",
                    "Real-time collaboration",
                    "Analytics & insights",
                    "Custom workflows",
                    "Priority support",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Enterprise */}
              <div className="rounded-2xl border border-border bg-surface p-8 shadow-premium">
                <h3 className="mb-1 text-lg font-bold text-foreground">Enterprise</h3>
                <p className="mb-6 text-sm text-muted-foreground">
                  For organizations with advanced needs
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-foreground">Custom</span>
                </div>
                <a
                  href="#"
                  className="mb-8 block rounded-xl border border-border bg-surface py-3 text-center text-sm font-semibold text-foreground transition-all hover:bg-accent"
                >
                  Contact sales
                </a>
                <ul className="space-y-3">
                  {[
                    "Everything in Pro",
                    "SSO / SAML",
                    "Advanced security & compliance",
                    "Custom integrations",
                    "Dedicated account manager",
                    "99.99% uptime SLA",
                    "On-premise deployment",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-emerald-500">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-border bg-surface/50 px-6 py-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-16 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
                FAQ
              </p>
              <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Frequently asked questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about BoardFlow.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: "Is BoardFlow really free?",
                  a: "Yes! Our Free plan supports up to 5 team members and 3 active projects with no time limit. Upgrade to Pro when you need more.",
                },
                {
                  q: "Can I import data from other tools?",
                  a: "Absolutely. We support one-click imports from Jira, Trello, Asana, Linear, and ClickUp. CSV import is also available.",
                },
                {
                  q: "How does real-time collaboration work?",
                  a: "BoardFlow uses WebSocket connections for instant sync. You see live cursors, presence indicators, and changes appear without refreshing.",
                },
                {
                  q: "Is there a mobile app?",
                  a: "BoardFlow has a fully responsive web app that works great on mobile devices. Native iOS and Android apps are coming soon.",
                },
                {
                  q: "Can I cancel my subscription anytime?",
                  a: "Yes, you can cancel anytime from your account settings. You'll retain access until the end of your billing period. No questions asked.",
                },
                {
                  q: "Do you offer SSO for enterprise?",
                  a: "Yes, SAML-based SSO is included in our Enterprise plan along with advanced security features, audit logs, and dedicated support.",
                },
              ].map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-border bg-surface p-6"
                >
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    {item.q}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-violet-600 p-12 text-center md:p-16">
              <div className="absolute inset-0 -z-10">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
                Ready to move faster?
              </h2>
              <p className="mx-auto mb-8 max-w-lg text-lg text-white/80">
                Join thousands of teams already shipping better products with
                BoardFlow. Start for free today.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-sm font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:shadow-xl"
                >
                  Get started for free
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 px-8 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Schedule a demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <line x1="3" x2="21" y1="9" y2="9" />
                    <line x1="9" x2="9" y1="21" y2="9" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-foreground">BoardFlow</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                Project management that flows. Built for modern teams that
                move fast and ship often.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Product</h4>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "Changelog", "Integrations", "API Docs"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Company</h4>
              <ul className="space-y-2.5">
                {["About", "Blog", "Careers", "Press Kit", "Contact"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Security", "GDPR", "Cookie Policy"].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BoardFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
