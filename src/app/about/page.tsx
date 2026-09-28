import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About — Helical",
  description:
    "Helical is a forgiving habit tracker. Completions are lifetime steps on a staircase — no streak guilt.",
};

export default function AboutPage() {
  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-test-courses" aria-hidden />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-3 px-4 pt-5 pb-2 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-wordmark)] text-4xl font-normal tracking-[0.14em] text-[var(--step)] sm:text-5xl"
        >
          HELICAL
        </Link>
      </header>

      <main className="relative z-10 mx-auto min-h-0 w-full max-w-2xl flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--step)] sm:text-3xl">
          About
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
          <p>
            Helical is a calm habit tracker. Every check-in is a step on your
            staircase — and steps you already climbed stay with you, even after
            quiet weeks.
          </p>
          <p>
            There are no streaks to break and no guilt for missing a day. The
            climb is lifetime steps, a gentle pace, and how wide your habits
            run — not a scoreboard.
          </p>
          <p>
            Your habits live in this browser only. Reset clears them if you want
            a fresh start.
          </p>
          <p>
            <Link
              href="/"
              className="text-[var(--brand-sky)] underline underline-offset-2 decoration-[color-mix(in_srgb,var(--brand-steel)_55%,transparent)] hover:decoration-[var(--brand-sky)]"
            >
              Back to the climb
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
