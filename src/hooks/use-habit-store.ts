"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  clearStore,
  createHabit,
  loadStore,
  removeHabit,
  renameHabit,
  saveStore,
  toggleCompletion,
} from "@/lib/storage";
import { EMPTY_STORE, STORAGE_KEY, type HabitStore } from "@/lib/types";

type Listener = () => void;

const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

let cacheRaw: string | null | undefined;
let cacheStore: HabitStore = EMPTY_STORE;

function getSnapshot(): HabitStore {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cacheRaw) return cacheStore;
  cacheRaw = raw;
  cacheStore = loadStore();
  return cacheStore;
}

function getServerSnapshot(): HabitStore {
  return EMPTY_STORE;
}

function commit(next: HabitStore) {
  saveStore(next);
  cacheRaw = window.localStorage.getItem(STORAGE_KEY);
  cacheStore = next;
  emit();
}

export function useHabitStore() {
  const store = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addHabit = useCallback((name: string) => {
    const current = getSnapshot();
    commit(createHabit(current, name));
  }, []);

  const rename = useCallback((id: string, name: string) => {
    const current = getSnapshot();
    commit(renameHabit(current, id, name));
  }, []);

  const remove = useCallback((id: string) => {
    const current = getSnapshot();
    commit(removeHabit(current, id));
  }, []);

  const toggle = useCallback((habitId: string, date: string) => {
    const current = getSnapshot();
    commit(toggleCompletion(current, habitId, date));
  }, []);

  const reset = useCallback(() => {
    clearStore();
    cacheRaw = null;
    cacheStore = EMPTY_STORE;
    emit();
  }, []);

  const completionsByHabit = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const c of store.completions) {
      let set = map.get(c.habitId);
      if (!set) {
        set = new Set();
        map.set(c.habitId, set);
      }
      set.add(c.date);
    }
    return map;
  }, [store.completions]);

  return {
    store,
    addHabit,
    rename,
    remove,
    toggle,
    reset,
    completionsByHabit,
    stepCount: store.completions.length,
  };
}
