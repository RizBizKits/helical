"use client";

import Link from "next/link";
import { useState } from "react";
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

type SiteFooterProps = {
  onReset?: () => void;
  showReset?: boolean;
};

export function SiteFooter({ onReset, showReset = false }: SiteFooterProps) {
  const [resetOpen, setResetOpen] = useState(false);

  return (
    <footer className="relative z-10 mx-auto flex w-full max-w-6xl shrink-0 items-center justify-center gap-4 px-4 py-3 sm:px-6">
      <p className="font-mono text-xs tracking-wide text-[var(--ink-muted)]">
        shipped by{" "}
        <a
          href="https://rizwankhan.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 decoration-[color-mix(in_srgb,var(--brand-steel)_55%,transparent)] transition-colors hover:text-[var(--brand-sky)] hover:decoration-[var(--brand-sky)]"
        >
          riz
        </a>
        <span className="mx-1.5 text-[var(--ink-muted)]/50" aria-hidden>
          |
        </span>
        <Link
          href="/about"
          className="underline underline-offset-2 decoration-[color-mix(in_srgb,var(--brand-steel)_55%,transparent)] transition-colors hover:text-[var(--brand-sky)] hover:decoration-[var(--brand-sky)]"
        >
          about
        </Link>
      </p>

      {showReset && onReset ? (
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogTrigger
            render={
              <button
                type="button"
                className="absolute right-4 font-mono text-xs tracking-wide text-[var(--ink-muted)]/55 transition-colors hover:text-[var(--ink-muted)] sm:right-6"
              />
            }
          >
            Reset
          </DialogTrigger>
          <DialogContent className="border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--ink)]">
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-display)] text-[var(--step)]">
                Reset to empty?
              </DialogTitle>
              <DialogDescription className="text-[var(--ink-muted)]">
                This clears every habit and completion from this browser.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="ghost"
                className="text-[var(--ink-muted)]"
                onClick={() => setResetOpen(false)}
              >
                Keep climbing
              </Button>
              <Button
                type="button"
                className="bg-rose-400/90 text-[var(--bg)] hover:bg-rose-400"
                onClick={() => {
                  onReset();
                  setResetOpen(false);
                }}
              >
                Clear everything
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </footer>
  );
}
