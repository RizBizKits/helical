"use client";

import { useMemo, useRef, useState } from "react";
import { EmptyState } from "@/components/empty-state";
import { ClimbStats } from "@/components/climb-stats";
import { HabitRow } from "@/components/habit-row";
import { SiteFooter } from "@/components/site-footer";
import { StaircasePov } from "@/components/staircase-pov";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHabitStore } from "@/hooks/use-habit-store";
import { getRollingWeek } from "@/lib/dates";
import { playFootstep } from "@/lib/footstep";

export function HabitApp() {
  const {
    store,
    addHabit,
    rename,
    remove,
    toggle,
    reset,
    completionsByHabit,
    stepCount,
  } = useHabitStore();
  const [newName, setNewName] = useState("");
  const [nameError, setNameError] = useState("");
  const [celebrateToken, setCelebrateToken] = useState(0);
  const addInputRef = useRef<HTMLInputElement>(null);

  const week = useMemo(() => getRollingWeek(), []);
  const isEmpty = store.habits.length === 0;

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) {
      setNameError("Give your habit a name to take the first step.");
      return;
    }
    addHabit(newName);
    setNewName("");
    setNameError("");
  }

  function handleToggle(habitId: string, date: string) {
    const wasDone = completionsByHabit.get(habitId)?.has(date) ?? false;
    toggle(habitId, date);
    if (!wasDone) {
      playFootstep();
      setCelebrateToken((n) => n + 1);
    }
  }

  return (
    <div className="relative flex h-dvh max-h-dvh flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-test-courses" aria-hidden />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center px-4 pt-5 pb-2 sm:px-6">
        <h1 className="font-[family-name:var(--font-wordmark)] text-4xl font-normal tracking-[0.14em] text-[var(--step)] sm:text-5xl">
          HELICAL
        </h1>
      </header>

      <main className="relative z-10 mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 px-4 pb-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)] lg:grid-rows-1 lg:gap-8 sm:px-6">
        <section className="flex shrink-0 flex-col items-center justify-center lg:min-h-0 lg:overflow-hidden">
          <StaircasePov
            steps={stepCount}
            celebrateToken={celebrateToken}
            className="w-full"
          />
          <ClimbStats store={store} />
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden">
          <form
            onSubmit={handleAdd}
            className="mb-2 flex shrink-0 flex-col gap-2 sm:flex-row"
          >
            <div className="min-w-0 flex-1">
              <label htmlFor="new-habit" className="sr-only">
                New habit name
              </label>
              <Input
                id="new-habit"
                ref={addInputRef}
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  if (nameError) setNameError("");
                }}
                placeholder="Name a habit to climb…"
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
                className="h-11 border-[color-mix(in_srgb,var(--brand-steel)_28%,transparent)] bg-[color-mix(in_srgb,var(--brand-navy)_55%,var(--brand-midnight))] text-[var(--ink)] placeholder:text-[var(--ink-muted)] focus-visible:border-[var(--brand-steel)] focus-visible:ring-[var(--brand-steel)]/25"
              />
            </div>
            <Button
              type="submit"
              className="h-11 shrink-0 border border-[color-mix(in_srgb,var(--brand-steel)_45%,transparent)] bg-[var(--brand-navy)] px-5 text-[var(--brand-sky)] hover:border-[var(--brand-steel)] hover:bg-[var(--brand-royal)]"
            >
              Add habit
            </Button>
          </form>
          {nameError && (
            <p id="name-error" className="mb-2 shrink-0 text-sm text-rose-300" role="alert">
              {nameError}
            </p>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
            {isEmpty ? (
              <EmptyState
                onFocusAdd={() => {
                  addInputRef.current?.focus();
                }}
              />
            ) : (
              <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)]/50 px-3 sm:px-4">
                {store.habits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    createdAt={habit.createdAt}
                    week={week}
                    completedDates={
                      completionsByHabit.get(habit.id) ?? new Set()
                    }
                    onToggle={(date) => handleToggle(habit.id, date)}
                    onRename={(name) => {
                      if (!name.trim()) return false;
                      rename(habit.id, name);
                      return true;
                    }}
                    onRemove={() => remove(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter showReset onReset={reset} />
    </div>
  );
}
