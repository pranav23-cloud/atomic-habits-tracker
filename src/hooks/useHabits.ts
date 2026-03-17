import { useState, useCallback, useEffect } from "react";

export interface Habit {
  id: string;
  name: string;
  type: "daily" | "weekly";
  category: string;
  streak: number;
  completedToday: boolean;
}

const STORAGE_KEY = "atomic-habits-data";

const defaultHabits: Habit[] = [
  { id: "1", name: "Morning meditation", type: "daily", category: "Mindfulness", streak: 12, completedToday: false },
  { id: "2", name: "Read for 20 minutes", type: "daily", category: "Study", streak: 7, completedToday: false },
  { id: "3", name: "Exercise 30 minutes", type: "daily", category: "Fitness", streak: 5, completedToday: false },
  { id: "4", name: "Drink 8 glasses of water", type: "daily", category: "Health", streak: 21, completedToday: false },
  { id: "5", name: "Journal before bed", type: "daily", category: "Mindfulness", streak: 3, completedToday: false },
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
    (data: { name: string; type: "daily" | "weekly"; category: string }) => {
      setHabits((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          name: data.name,
          type: data.type,
          category: data.category,
          streak: 0,
          completedToday: false,
        },
      ]);
    },
    []
  );

  const completedCount = habits.filter((h) => h.completedToday).length;
  const percentage = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return { habits, toggleHabit, addHabit, percentage, completedCount };
}
