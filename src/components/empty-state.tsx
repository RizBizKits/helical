"use client";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  onFocusAdd: () => void;
};

export function EmptyState({ onFocusAdd }: EmptyStateProps) {
  return (
    <section className="flex flex-col items-start gap-4 py-8">
      <p className="max-w-sm text-sm leading-relaxed text-[var(--ink-muted)]">
        Check a day and a new step appears on the stairwell. Steps you already
        climbed stay — even after quiet weeks.
      </p>
      <Button
        type="button"
        onClick={onFocusAdd}
        className="h-11 min-w-[10rem] border border-[color-mix(in_srgb,var(--brand-steel)_45%,transparent)] bg-[var(--brand-navy)] text-[var(--brand-sky)] hover:border-[var(--brand-steel)] hover:bg-[var(--brand-royal)]"
      >
        Add your first habit
      </Button>
    </section>
  );
}
