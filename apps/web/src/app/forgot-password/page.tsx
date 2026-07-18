"use client";

import { useState } from "react";
import Link from "next/link";
import { api, ApiError } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: { email },
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              B
            </div>
            BoardFlow
          </Link>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-8 shadow-subtle">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <svg
                  className="h-6 w-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists with{" "}
                <span className="font-medium text-foreground">{email}</span>,
                we&apos;ve sent a password reset link.
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex h-10 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl font-bold text-foreground">
                  Forgot your password?
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 animate-slide-up">
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                      />
                    </svg>
                    <span className="text-sm text-destructive">{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    placeholder="name@company.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="relative h-11 w-full overflow-hidden rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:bg-primary"
                >
                  <span
                    className={`inline-flex items-center gap-2 transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}
                  >
                    Send Reset Link
                  </span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Sending...
                    </span>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
