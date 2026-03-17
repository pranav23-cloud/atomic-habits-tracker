import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface HabitCardProps {
  name: string;
  category?: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
  index: number;
}

const HabitCard = ({ name, category, streak, completed, onToggle, index }: HabitCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    whileHover={{ y: -1 }}
    className={`group relative flex items-center justify-between p-4 rounded-xl shadow-card transition-colors duration-200 ${
      completed ? "bg-muted" : "bg-card"
    }`}
  >
    <div className="flex items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          completed
            ? "bg-primary border-primary"
            : "border-muted-foreground/30 hover:border-primary/50"
        }`}
      >
        {completed && <Check className="w-3 h-3 text-primary-foreground" />}
      </motion.button>
      <div className="flex flex-col">
        <span
          className={`text-sm font-medium transition-all duration-200 ${
            completed ? "text-muted-foreground line-through opacity-50" : "text-foreground"
          }`}
        >
          {name}
        </span>
        {category && (
          <span className="text-xs text-muted-foreground mt-0.5">{category}</span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[11px] tracking-tighter text-muted-foreground uppercase">
        Streak
      </span>
      <span className="font-mono text-sm tabular-nums text-foreground/70 bg-muted px-2 py-0.5 rounded-md">
        {streak}
      </span>
    </div>
  </motion.div>
);

export default HabitCard;
