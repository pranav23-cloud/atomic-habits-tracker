import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/sonner";

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

type HabitDoc = {
  userId: string;
  name: string;
  type: "daily" | "weekly";
  category: Category;
  goal?: string;
  streak: number;
  createdAt?: DocumentData;
  updatedAt?: DocumentData;
};

type HabitLogDoc = {
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  updatedAt?: DocumentData;
};

function isoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useHabits() {
  const { user } = useAuth();
  const userId = user?.uid;
  const today = useMemo(() => isoDate(new Date()), []);

  const [habitsRaw, setHabitsRaw] = useState<Array<Omit<Habit, "completedToday">>>([]);
  const [todayCompletedMap, setTodayCompletedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const qHabits = query(
      collection(db, "habits"),
      where("userId", "==", userId),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(
      qHabits,
      (snap) => {
        const next = snap.docs.map((d) => {
          const data = d.data() as HabitDoc;
          return {
            id: d.id,
            name: data.name,
            type: data.type,
            category: data.category,
            goal: data.goal,
            streak: data.streak ?? 0,
          };
        });
        setHabitsRaw(next);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const qLogs = query(
      collection(db, "habit_logs"),
      where("userId", "==", userId),
      where("date", "==", today)
    );

    const unsub = onSnapshot(qLogs, (snap) => {
      const next: Record<string, boolean> = {};
      for (const d of snap.docs) {
        const data = d.data() as HabitLogDoc;
        next[data.habitId] = Boolean(data.completed);
      }
      setTodayCompletedMap(next);
    });

    return () => unsub();
  }, [userId, today]);

  const habits: Habit[] = useMemo(
    () =>
      habitsRaw.map((h) => ({
        ...h,
        completedToday: Boolean(todayCompletedMap[h.id]),
      })),
    [habitsRaw, todayCompletedMap]
  );

  const toggleHabit = useCallback(
    async (id: string) => {
      if (!userId) return;

      const habit = habits.find((h) => h.id === id);
      if (!habit) return;

      const nextCompleted = !habit.completedToday;
      const habitRef = doc(db, "habits", id);

      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return isoDate(d);
      })();

      let nextStreak = habit.streak;
      if (nextCompleted) {
        const yDocId = `${id}_${yesterday}`;
        const yRef = doc(db, "habit_logs", yDocId);
        try {
          const ySnap = await getDoc(yRef);
          const yCompleted = ySnap.exists() ? Boolean((ySnap.data() as HabitLogDoc).completed) : false;
          nextStreak = yCompleted ? habit.streak + 1 : 1;
        } catch {
          nextStreak = Math.max(1, habit.streak);
        }
      } else {
        nextStreak = Math.max(0, habit.streak - 1);
      }

      // Optimistic UI (instant tick), then persist.
      const prevCompleted = habit.completedToday;
      const prevStreak = habit.streak;
      setTodayCompletedMap((prev) => ({ ...prev, [id]: nextCompleted }));
      setHabitsRaw((prev) => prev.map((h) => (h.id === id ? { ...h, streak: nextStreak } : h)));

      try {
        await updateDoc(habitRef, { streak: nextStreak, updatedAt: serverTimestamp() });

        const logId = `${id}_${today}`;
        const logRef = doc(db, "habit_logs", logId);
        await setDoc(
          logRef,
          {
            userId,
            habitId: id,
            date: today,
            completed: nextCompleted,
            updatedAt: serverTimestamp(),
          } satisfies HabitLogDoc,
          { merge: true }
        );
      } catch (e) {
        // Revert optimistic UI if Firestore rejects (rules / network).
        setTodayCompletedMap((prev) => ({ ...prev, [id]: prevCompleted }));
        setHabitsRaw((prev) => prev.map((h) => (h.id === id ? { ...h, streak: prevStreak } : h)));
        toast.error("Couldn’t update habit. Check Firestore rules / internet.");
      }
    },
    [habits, today, userId]
  );

  const addHabit = useCallback(
    async (data: { name: string; type: "daily" | "weekly"; category: Category; goal?: string }) => {
      if (!userId) return;
      const payload: HabitDoc = {
        userId,
        name: data.name,
        type: data.type,
        category: data.category,
        goal: data.goal,
        streak: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      try {
        await addDoc(collection(db, "habits"), payload);
        toast.success("Habit added");
      } catch {
        toast.error("Couldn’t add habit. Check Firestore rules.");
      }
    },
    [userId]
  );

  const updateHabit = useCallback(
    async (id: string, data: { name: string; type: "daily" | "weekly"; category: Category; goal?: string }) => {
      if (!userId) return;
      try {
        await updateDoc(doc(db, "habits", id), {
          name: data.name,
          type: data.type,
          category: data.category,
          goal: data.goal ?? null,
          updatedAt: serverTimestamp(),
        });
        toast.success("Habit updated");
      } catch {
        toast.error("Couldn’t update habit. Check Firestore rules.");
      }
    },
    [userId]
  );

  const deleteHabit = useCallback(
    async (id: string) => {
      if (!userId) return;
      try {
        await deleteDoc(doc(db, "habits", id));
        toast.success("Habit deleted");
      } catch {
        toast.error("Couldn’t delete habit. Check Firestore rules.");
      }
    },
    [userId]
  );

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

  return {
    habits,
    habitsByCategory,
    toggleHabit,
    addHabit,
    updateHabit,
    deleteHabit,
    percentage,
    completedCount,
    loading,
  };
}
