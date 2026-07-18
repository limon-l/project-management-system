import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - BoardFlow",
  description: "BoardFlow's privacy policy and data handling practices.",
};

export default function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: July 18, 2026
        </p>

        <div className="prose mt-8 space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              BoardFlow (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              respects your privacy. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our project management platform and related services
              (collectively, the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              2. Information We Collect
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <strong className="text-foreground">Account Information:</strong>{" "}
                When you register, we collect your name, email address, and
                password (stored in hashed form). We may also collect your
                avatar URL if you choose to provide one.
              </p>
              <p>
                <strong className="text-foreground">Usage Data:</strong> We
                automatically collect information about how you interact with
                the Service, including IP address, browser type, device
                information, pages visited, and actions taken within the
                platform.
              </p>
              <p>
                <strong className="text-foreground">Project Data:</strong>{" "}
                Content you create within the Service, including workspaces,
                projects, tasks, comments, attachments, and other materials.
              </p>
              <p>
                <strong className="text-foreground">Cookies:</strong> We use
                session cookies to maintain your authentication state. These
                cookies are httpOnly and secure in production.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>To provide, maintain, and improve the Service</li>
              <li>To authenticate users and maintain session security</li>
              <li>To send service-related communications</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. Data Sharing & Disclosure
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We do not sell your personal information. We may share your
              information only in the following circumstances:
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>
                With team members within workspaces you belong to (name and
                email only)
              </li>
              <li>With service providers who assist in operating the Service</li>
              <li>When required by law or to protect our legal rights</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We implement industry-standard security measures including
              encrypted data transmission (HTTPS), hashed password storage
              (Argon2), httpOnly secure cookies, rate limiting, and input
              validation. However, no method of transmission over the Internet
              is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data Retention</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We retain your data for as long as your account is active or as
              needed to provide the Service. You may delete your account at any
              time, which will remove your personal data from our systems.
              Session data is automatically expired and deleted after 7 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Your Rights</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You have the right to access, correct, or delete your personal
              information. To exercise these rights, please contact us at the
              email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Changes to This Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page with an updated &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact Us</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If you have questions about this Privacy Policy, please contact
              us through the BoardFlow platform or via our{" "}
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
