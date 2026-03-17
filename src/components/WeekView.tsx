import { motion } from "framer-motion";

interface WeekViewProps {
  /** Array of 7 booleans, Mon-Sun, true = at least some habits completed */
  days: boolean[];
}

const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

const WeekView = ({ days }: WeekViewProps) => (
  <div className="flex items-center justify-between gap-2">
    {days.map((done, i) => (
      <div key={i} className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-[10px] text-muted-foreground uppercase">{dayLabels[i]}</span>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 400 }}
          className={`w-3 h-3 rounded-full ${done ? "bg-primary" : "bg-muted"}`}
        />
      </div>
    ))}
  </div>
);

export default WeekView;
