import { useState, useCallback, useEffect } from "react";

export type Category = "Mental" | "Physical" | "Intelligence" | "Skills" | "Habits" | "Communication";

export interface Habit {
  id: string;
  name: string;
  type: "daily" | "weekly";
  category: Category;
  goal?: string;
  streak: number;
  completedToday: boolean;
}

export const CATEGORIES: { key: Category; emoji: string; cssVar: string }[] = [
  { key: "Mental", emoji: "🧠", cssVar: "--cat-mental" },
  { key: "Physical", emoji: "💪", cssVar: "--cat-physical" },
  { key: "Intelligence", emoji: "📚", cssVar: "--cat-intelligence" },
  { key: "Skills", emoji: "🛠", cssVar: "--cat-skills" },
  { key: "Habits", emoji: "🔁", cssVar: "--cat-habits" },
  { key: "Communication", emoji: "🗣", cssVar: "--cat-communication" },
];

export const categoryColor: Record<Category, string> = {
  Mental: "cat-mental",
  Physical: "cat-physical",
  Intelligence: "cat-intelligence",
  Skills: "cat-skills",
  Habits: "cat-habits",
  Communication: "cat-communication",
};

const STORAGE_KEY = "atomic-habits-data-v2";

const defaultHabits: Habit[] = [
  { id: "1", name: "Morning meditation", type: "daily", category: "Mental", streak: 12, completedToday: false },
  { id: "2", name: "Read for 30 minutes", type: "daily", category: "Intelligence", streak: 7, completedToday: false },
  { id: "3", name: "Workout session", type: "daily", category: "Physical", streak: 5, completedToday: false },
  { id: "4", name: "Practice public speaking", type: "weekly", category: "Communication", streak: 3, completedToday: false },
  { id: "5", name: "Learn a new tool", type: "weekly", category: "Skills", streak: 2, completedToday: false },
  { id: "6", name: "Journal before bed", type: "daily", category: "Habits", streak: 21, completedToday: false },
  { id: "7", name: "Deep breathing exercises", type: "daily", category: "Mental", streak: 8, completedToday: false },
  { id: "8", name: "Drink 8 glasses of water", type: "daily", category: "Physical", streak: 14, completedToday: false },
];

function loadHabits(): Habit[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultHabits;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completedToday: !h.completedToday,
              streak: !h.completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
            }
          : h
      )
    );
  }, []);

  const addHabit = useCallback(
    (data: { name: string; type: "daily" | "weekly"; category: Category; goal?: string }) => {
      setHabits((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          category: data.category,
          goal: data.goal,
          streak: 0,
          completedToday: false,
        },
      ]);
    },
    []
  );

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const completedCount = habits.filter((h) => h.completedToday).length;
  const percentage = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  const habitsByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      const items = habits.filter((h) => h.category === cat.key);
      if (items.length > 0) acc[cat.key] = items;
      return acc;
    },
    {} as Record<Category, Habit[]>
  );

  return { habits, habitsByCategory, toggleHabit, addHabit, deleteHabit, percentage, completedCount };
}
