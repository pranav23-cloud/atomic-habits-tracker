import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import ProgressGauge from "@/components/ProgressGauge";
import HabitCard from "@/components/HabitCard";
import AddHabitDrawer from "@/components/AddHabitDrawer";
import WeekView from "@/components/WeekView";
import { useHabits } from "@/hooks/useHabits";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

const Index = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { habits, toggleHabit, addHabit, percentage, completedCount } = useHabits();

  // Mock week data based on current day
  const today = new Date().getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => i < (today === 0 ? 7 : today));

  return (
    <div className="min-h-screen bg-background">
      <ProgressGauge percentage={percentage} />

      <div className="mx-auto max-w-[640px] px-5 pt-14 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{getFormattedDate()}</p>
        </motion.div>

        {/* Progress Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-xs tracking-widest uppercase text-muted-foreground">
              Progress
            </span>
            <span className="font-mono text-sm tabular-nums text-foreground">
              {completedCount}/{habits.length}
            </span>
          </div>
          <span className="font-mono text-xs tabular-nums tracking-widest uppercase text-muted-foreground">
            {percentage}%
          </span>
        </motion.div>

        {/* Habit List */}
        <div className="space-y-3">
          {habits.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground text-center py-12"
            >
              No habits defined for {getFormattedDate()}.
            </motion.p>
          ) : (
            habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                name={habit.name}
                category={habit.category}
                streak={habit.streak}
                completed={habit.completedToday}
                onToggle={() => toggleHabit(habit.id)}
                index={i}
              />
            ))
          )}
        </div>

        {/* Week View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 p-5 rounded-xl shadow-card bg-card"
        >
          <p className="text-xs tracking-widest uppercase text-muted-foreground mb-4">
            This Week
          </p>
          <WeekView days={weekDays} />
        </motion.div>
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setDrawerOpen(true)}
          className="bg-primary text-primary-foreground w-12 h-12 rounded-full shadow-card flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <AddHabitDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
};

export default Index;
