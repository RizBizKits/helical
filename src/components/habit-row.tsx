"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2, Check, X, ScanSearch } from "lucide-react";
import { dayOfMonth, isToday, parseDateKey, weekdayShort } from "@/lib/dates";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HabitRowProps = {
  id: string;
  name: string;
  createdAt: string;
  week: string[];
  completedDates: Set<string>;
  onToggle: (date: string) => void;
  onRename: (name: string) => boolean;
  onRemove: () => void;
};

function formatLongDate(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HabitRow({
  name,
  createdAt,
  week,
  completedDates,
  onToggle,
  onRename,
  onRemove,
}: HabitRowProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const stats = useMemo(() => {
    const dates = [...completedDates].sort();
    const total = dates.length;
    const thisWeek = week.filter((d) => completedDates.has(d)).length;
    const first = dates[0] ?? null;
    const latest = dates[dates.length - 1] ?? null;
    const started = new Date(createdAt);
    return { total, thisWeek, first, latest, started };
  }, [completedDates, week, createdAt]);

  function commitRename() {
    const ok = onRename(draft);
    if (!ok) {
      setError("Give this habit a name.");
      return;
    }
    setError("");
    setEditing(false);
  }

  function cancelRename() {
    setDraft(name);
    setError("");
    setEditing(false);
  }

  return (
    <article className="border-b border-[var(--line)] py-5 last:border-b-0">
      <div className="mb-3 flex items-start justify-between gap-3">
        {editing ? (
          <div className="min-w-0 flex-1">
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") cancelRename();
                }}
                aria-label="Rename habit"
                aria-invalid={!!error}
                className="h-10 border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
                autoFocus
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-10 shrink-0 text-[var(--step)] hover:bg-[var(--surface)] hover:text-[var(--step)]"
                onClick={commitRename}
                aria-label="Save name"
              >
                <Check className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-10 shrink-0 text-[var(--ink-muted)] hover:bg-[var(--surface)]"
                onClick={cancelRename}
                aria-label="Cancel rename"
              >
                <X className="size-4" />
              </Button>
            </div>
            {error && (
              <p className="mt-1.5 text-sm text-rose-300" role="alert">
                {error}
              </p>
            )}
          </div>
        ) : (
          <>
            <h3
              className="min-w-0 flex-1 truncate font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--ink)]"
              title={name}
            >
              {name}
            </h3>
            <div className="flex shrink-0 gap-1">
              <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-10 text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-[var(--step)]"
                    />
                  }
                >
                  <ScanSearch className="size-4" />
                  <span className="sr-only">Dig deep into {name}</span>
                </DialogTrigger>
                <DialogContent className="border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="truncate font-[family-name:var(--font-display)] text-xl text-[var(--step)]">
                      {name}
                    </DialogTitle>
                  </DialogHeader>
                  <dl className="mt-2 grid gap-4 font-mono text-sm">
                    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                      <dt className="text-[var(--ink-muted)]">Total steps</dt>
                      <dd className="text-2xl font-semibold tabular-nums text-[var(--step)]">
                        {stats.total}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                      <dt className="text-[var(--ink-muted)]">This week</dt>
                      <dd className="tabular-nums text-[var(--ink)]">
                        {stats.thisWeek} of {week.length} days
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                      <dt className="text-[var(--ink-muted)]">First step</dt>
                      <dd className="text-right text-[var(--ink)]">
                        {stats.first ? formatLongDate(stats.first) : "Not yet"}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line)] pb-3">
                      <dt className="text-[var(--ink-muted)]">Latest step</dt>
                      <dd className="text-right text-[var(--ink)]">
                        {stats.latest ? formatLongDate(stats.latest) : "Not yet"}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-[var(--ink-muted)]">Added</dt>
                      <dd className="text-right text-[var(--ink)]">
                        {stats.started.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </dd>
                    </div>
                  </dl>
                </DialogContent>
              </Dialog>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-10 text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-[var(--step)]"
                onClick={() => {
                  setDraft(name);
                  setEditing(true);
                }}
                aria-label={`Rename ${name}`}
              >
                <Pencil className="size-4" />
              </Button>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger
                  render={
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-10 text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-rose-300"
                    />
                  }
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Remove {name}</span>
                </DialogTrigger>
                <DialogContent className="border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="font-[family-name:var(--font-display)] text-[var(--step)]">
                      Remove this habit?
                    </DialogTitle>
                    <DialogDescription className="text-[var(--ink-muted)]">
                      “{name}” and its {stats.total}{" "}
                      {stats.total === 1 ? "step" : "steps"} will be cleared
                      from this browser.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-[var(--ink-muted)]"
                      onClick={() => setDeleteOpen(false)}
                    >
                      Keep it
                    </Button>
                    <Button
                      type="button"
                      className="bg-rose-400/90 text-[var(--bg)] hover:bg-rose-400"
                      onClick={() => {
                        onRemove();
                        setDeleteOpen(false);
                      }}
                    >
                      Remove
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>

      <div
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
        role="group"
        aria-label={`Weekly progress for ${name}`}
      >
        {week.map((date) => {
          const done = completedDates.has(date);
          const today = isToday(date);
          return (
            <button
              key={date}
              type="button"
              onClick={() => onToggle(date)}
              aria-pressed={done}
              aria-label={`${weekdayShort(date)} ${dayOfMonth(date)}${
                today ? ", today" : ""
              }: ${done ? "completed, activate to undo" : "not completed"}`}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center rounded-md border transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--step)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
                "active:scale-[0.96]",
                done
                  ? "border-[var(--step)] bg-[var(--step)] text-[var(--bg)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-sky)_30%,transparent)]"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--ink-muted)] hover:border-[var(--step)]/50",
                today && !done && "ring-1 ring-[var(--step)]/40",
                today && "font-semibold",
              )}
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-wide opacity-80">
                {weekdayShort(date).slice(0, 2)}
              </span>
              <span className="text-sm leading-none">{dayOfMonth(date)}</span>
              {today && (
                <span className="mt-0.5 h-1 w-1 rounded-full bg-current opacity-70" />
              )}
            </button>
          );
        })}
      </div>
    </article>
  );
}
