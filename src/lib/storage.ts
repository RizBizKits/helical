import {
  EMPTY_STORE,
  STORAGE_KEY,
  type Completion,
  type Habit,
  type HabitStore,
} from "@/lib/types";

function isStore(value: unknown): value is HabitStore {
  if (!value || typeof value !== "object") return false;
  const v = value as HabitStore;
  return (
    v.version === 1 &&
    Array.isArray(v.habits) &&
    Array.isArray(v.completions)
  );
}

export function loadStore(): HabitStore {
  if (typeof window === "undefined") return EMPTY_STORE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STORE;
    const parsed: unknown = JSON.parse(raw);
    if (!isStore(parsed)) return EMPTY_STORE;
    return {
      version: 1,
      habits: parsed.habits,
      completions: dedupeCompletions(parsed.completions),
    };
  } catch {
    return EMPTY_STORE;
  }
}

export function saveStore(store: HabitStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function clearStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

function dedupeCompletions(completions: Completion[]): Completion[] {
  const seen = new Set<string>();
  const out: Completion[] = [];
  for (const c of completions) {
    const key = `${c.habitId}|${c.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

export function createHabit(store: HabitStore, name: string): HabitStore {
  const trimmed = name.trim();
  if (!trimmed) return store;
  const habit: Habit = {
    id: crypto.randomUUID(),
    name: trimmed,
    createdAt: new Date().toISOString(),
  };
  return { ...store, habits: [...store.habits, habit] };
}

export function renameHabit(
  store: HabitStore,
  id: string,
  name: string,
): HabitStore {
  const trimmed = name.trim();
  if (!trimmed) return store;
  return {
    ...store,
    habits: store.habits.map((h) =>
      h.id === id ? { ...h, name: trimmed } : h,
    ),
  };
}

export function removeHabit(store: HabitStore, id: string): HabitStore {
  return {
    ...store,
    habits: store.habits.filter((h) => h.id !== id),
    completions: store.completions.filter((c) => c.habitId !== id),
  };
}

/** Toggle completion for a habit+date. Second call undoes. No duplicates. */
export function toggleCompletion(
  store: HabitStore,
  habitId: string,
  date: string,
): HabitStore {
  const exists = store.completions.some(
    (c) => c.habitId === habitId && c.date === date,
  );
  if (exists) {
    return {
      ...store,
      completions: store.completions.filter(
        (c) => !(c.habitId === habitId && c.date === date),
      ),
    };
  }
  return {
    ...store,
    completions: [...store.completions, { habitId, date }],
  };
}

export function isCompleted(
  store: HabitStore,
  habitId: string,
  date: string,
): boolean {
  return store.completions.some(
    (c) => c.habitId === habitId && c.date === date,
  );
}
