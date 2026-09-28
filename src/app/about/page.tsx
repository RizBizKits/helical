import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "About — Helical",
  description:
    "Helical is a smol habit tracker that is low-stakes yet powerful. Habits are steps you take as you climb.",
};

export default function AboutPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none absolute inset-0 bg-test-courses" aria-hidden />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-between gap-3 px-4 pt-5 pb-2 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-wordmark)] text-4xl font-normal tracking-[0.14em] text-[var(--step)] sm:text-5xl"
        >
          HELICAL
        </Link>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-4 pb-6 sm:px-6">
        <h2 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--step)] sm:text-3xl">
          About
        </h2>
        <div className="mt-5 space-y-4 text-sm leading-relaxed text-[var(--ink-muted)] sm:text-base">
          <p>
            Helical is a smol habit tracker project that is low-stakes yet
            powerful.
          </p>
          <p>
            The name comes from a helical staircase: a continuous curve of steps
            winding upward around an open center.
          </p>
          <p>
            Habits are steps you take as you ascend to reach your destination.
          </p>
          <p>
            Each habit completed in a day increases the overall step count, so,
            even if you miss out reading a book, for example, you still made
            progress if you achieved going on a walk. Helical rewards some
            progress in some things over punishing missing a day or not
            completing every single one of your habits, daily. Of course, when
            you’re ready for it, you can zoom into stats for each habit.
          </p>
          <p>
            Another inspiration when thinking about habits and staircases was
            the stair stepper machine you’ll find at the gym. The step/day stat
            mimics the speed readout of the stepper machine as it records the
            average of how many steps you take on the days you climb. Check off
            3 habits on Monday and 1 on Thursday, and it shows 2 steps/day and
            not a lower average spread across the whole week.
          </p>
          <p>Habits, really, are just steps.</p>
          <p>So, what are you climbing towards?</p>
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
