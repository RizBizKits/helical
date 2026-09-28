/** Local-calendar date helpers — never use UTC midnight. */

export function toDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

/** Rolling 7-day window ending on today (local). */
export function getRollingWeek(today: Date = new Date()): string[] {
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(end, i - 6)));
}

export function weekdayShort(dateKey: string): string {
  return parseDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: "short",
  });
}

export function dayOfMonth(dateKey: string): string {
  return String(parseDateKey(dateKey).getDate());
}

export function isToday(dateKey: string, today: Date = new Date()): boolean {
  return dateKey === toDateKey(today);
}
