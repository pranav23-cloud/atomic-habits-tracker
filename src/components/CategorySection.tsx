import { motion } from "framer-motion";
import type { Category, Habit } from "@/hooks/useHabits";
import { CATEGORIES, categoryColor } from "@/hooks/useHabits";
import HabitCard from "./HabitCard";

interface CategorySectionProps {
  category: Category;
  habits: Habit[];
  onToggle: (id: string) => void;
}

const CategorySection = ({ category, habits, onToggle }: CategorySectionProps) => {
  const catMeta = CATEGORIES.find((c) => c.key === category)!;
  const color = categoryColor[category];
  const completed = habits.filter((h) => h.completedToday).length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{catMeta.emoji}</span>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">{category}</h2>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {completed}/{habits.length}
          </span>
        </div>
        <div
          className="h-1 w-16 rounded-full bg-muted overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: `hsl(var(${catMeta.cssVar}))` }}
            initial={{ width: 0 }}
            animate={{ width: habits.length ? `${(completed / habits.length) * 100}%` : "0%" }}
            transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {habits.map((habit, i) => (
          <HabitCard
            key={habit.id}
            name={habit.name}
            category={habit.category}
            streak={habit.streak}
            completed={habit.completedToday}
            goal={habit.goal}
            onToggle={() => onToggle(habit.id)}
            index={i}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default CategorySection;
