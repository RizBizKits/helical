export type Habit = {
  id: string;
  name: string;
  createdAt: string;
};

export type Completion = {
  habitId: string;
  date: string; // YYYY-MM-DD in local calendar
};

export type HabitStore = {
  version: 1;
  habits: Habit[];
  completions: Completion[];
};

export const STORAGE_KEY = "helical.habits.v1";

export const EMPTY_STORE: HabitStore = {
  version: 1,
  habits: [],
  completions: [],
};
