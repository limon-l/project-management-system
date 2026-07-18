import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - BoardFlow",
  description: "BoardFlow's terms of service and usage agreements.",
};

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-background">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: July 18, 2026
        </p>

        <div className="prose mt-8 space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              By accessing or using BoardFlow (the &quot;Service&quot;), you
              agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Description of Service</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              BoardFlow is a collaborative project management platform that
              provides Kanban boards, task management, team workspaces,
              real-time collaboration, and analytics tools for teams and
              organizations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Account Registration</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                You must provide accurate, complete information when creating an
                account. You are responsible for maintaining the confidentiality
                of your credentials and for all activities under your account.
              </p>
              <p>
                You must be at least 13 years old to use the Service. You may
                not create multiple accounts for the same person.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. Acceptable Use Policy
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You agree not to:
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                Use the Service for any unlawful purpose or in violation of any
                applicable laws
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Service
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
              <li>
                Upload malicious content or attempt to compromise the security
                of the platform
              </li>
              <li>
                Scrape, crawl, or use automated tools to access the Service
                without permission
              </li>
              <li>
                Resell or redistribute the Service without written authorization
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The Service, including its design, code, and content, is owned by
              BoardFlow and protected by intellectual property laws. You retain
              ownership of all content you create within the Service. By using
              the Service, you grant us a limited license to host, store, and
              display your content as necessary to operate the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data & Privacy</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your
              information. Please review it carefully.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              7. Limitation of Liability
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              To the maximum extent permitted by law, BoardFlow shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or any loss of profits or revenues, whether
              incurred directly or indirectly. The Service is provided
              &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Termination</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We may suspend or terminate your access to the Service at any
              time, with or without cause, with or without notice. Upon
              termination, your right to use the Service ceases immediately.
              You may also delete your account at any time through the
              platform settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              9. Changes to Terms
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We reserve the right to modify these terms at any time. We will
              notify you of significant changes through the Service or via
              email. Your continued use of the Service after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              For questions about these Terms of Service, please contact us
              through the BoardFlow platform or via our{" "}
              <Link
                href="/"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                website
              </Link>
              .
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Back to BoardFlow
          </Link>
        </div>
      </div>
    </div>
  );
}
