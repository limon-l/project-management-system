import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-foreground">
          BoardFlow
        </h1>
        <p className="mb-8 text-xl text-muted-foreground">
          Real-time collaborative project management for modern teams.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-6 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
