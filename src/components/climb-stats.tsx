"use client";

import { useEffect, useMemo, useState } from "react";
import type { HabitStore } from "@/lib/types";
import { cn } from "@/lib/utils";

type StatMode = "steps" | "pace" | "load";

const MODES: StatMode[] = ["steps", "pace", "load"];
const SLIDE_MS = 4200;

function nextMode(current: StatMode): StatMode {
  return MODES[(MODES.indexOf(current) + 1) % MODES.length];
}

function climbStats(store: HabitStore) {
  const steps = store.completions.length;
  const load = store.habits.length;
  const days = new Set(store.completions.map((c) => c.date));
  const pace =
    days.size === 0 ? 0 : Math.round((steps / days.size) * 10) / 10;
  return { steps, pace, load };
}

type ClimbStatsProps = {
  store: HabitStore;
  className?: string;
};

export function ClimbStats({ store, className }: ClimbStatsProps) {
  const [mode, setMode] = useState<StatMode>("steps");
  const [fadeKey, setFadeKey] = useState(0);
  const stats = useMemo(() => climbStats(store), [store]);

  function advance() {
    setMode(nextMode);
    setFadeKey((k) => k + 1);
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = window.setInterval(() => {
      setMode(nextMode);
      setFadeKey((k) => k + 1);
    }, SLIDE_MS);
    return () => window.clearInterval(id);
  }, [mode]);

  const display = (() => {
    switch (mode) {
      case "pace":
        return {
          value: stats.pace === 0 ? "—" : String(stats.pace),
          label: "steps / day",
          hint: "Average on days you climbed — denser check-offs raise the pace.",
        };
      case "load":
        return {
          value: String(stats.load),
          label: stats.load === 1 ? "habit" : "habits",
          hint: "How wide the climb is. More habits means more ways to take a step today.",
        };
      default:
        return {
          value: String(stats.steps),
          label: stats.steps === 1 ? "step" : "steps",
          hint: "Lifetime steps climbed. Rotates through climb stats — tap to skip ahead.",
        };
    }
  })();

  return (
    <button
      type="button"
      onClick={advance}
      className={cn(
        "group mt-1 flex flex-col items-center rounded-lg px-4 py-1 text-center transition-colors",
        "hover:bg-[var(--surface)]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--step)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        className,
      )}
      aria-live="polite"
      aria-label={`${display.value} ${display.label}. ${display.hint}`}
      title="Tap to skip to next stat"
    >
      <span
        key={fadeKey}
        className="animate-stat-fade font-mono text-4xl font-semibold tabular-nums tracking-tight text-[var(--step)] sm:text-5xl"
      >
        {display.value}
      </span>
      <span
        key={`label-${fadeKey}`}
        className="animate-stat-fade font-mono text-xs tracking-[0.18em] text-[var(--ink-muted)] uppercase"
      >
        {display.label}
      </span>
      <span className="mt-1 font-mono text-[0.6rem] tracking-wide text-[var(--ink-muted)]/70 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        tap to skip
      </span>
    </button>
  );
}
