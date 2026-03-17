import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import ProgressGauge from "@/components/ProgressGauge";
import CategorySection from "@/components/CategorySection";
import AddHabitDrawer from "@/components/AddHabitDrawer";
import WeekView from "@/components/WeekView";
import { useHabits, CATEGORIES } from "@/hooks/useHabits";

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
  const { habits, habitsByCategory, toggleHabit, addHabit, percentage, completedCount } = useHabits();

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
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{getFormattedDate()}</p>
        </motion.div>

        {/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8 p-4 rounded-xl bg-card shadow-card"
        >
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground">Daily Progress</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              {completedCount}
              <span className="text-muted-foreground text-base font-normal"> / {habits.length}</span>
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15" fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 0.9425} 94.25`}
                initial={{ strokeDasharray: "0 94.25" }}
                animate={{ strokeDasharray: `${percentage * 0.9425} 94.25` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs tabular-nums text-foreground">
              {percentage}%
            </span>
          </div>
        </motion.div>

        {/* Category Sections */}
        <div className="space-y-8">
          {CATEGORIES.map((cat) => {
            const items = habitsByCategory[cat.key];
            if (!items) return null;
            return (
              <CategorySection
                key={cat.key}
                category={cat.key}
                habits={items}
                onToggle={toggleHabit}
              />
            );
          })}
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
