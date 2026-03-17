import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Flame, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { categoryColor, type Category } from "@/hooks/useHabits";
import { useYouTubeRecommendations } from "@/hooks/useYouTubeRecommendations";
import VideoCard from "./VideoCard";

interface HabitCardProps {
  id: string;
  name: string;
  category: Category;
  streak: number;
  completed: boolean;
  goal?: string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  index: number;
}

const HabitCard = ({ name, category, streak, completed, goal, onToggle, onEdit, onDelete, index }: HabitCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const color = categoryColor[category];
  const recs = useYouTubeRecommendations(name, expanded);
  const accent = `hsl(var(--${color}))`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`group relative rounded-xl shadow-card transition-colors duration-200 ${
        completed ? "bg-muted/60" : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onToggle}
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200"
            style={
              completed
                ? { backgroundColor: accent, borderColor: accent }
                : { borderColor: "hsl(var(--muted-foreground) / 0.35)" }
            }
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
            {goal && (
              <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{goal}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-destructive" />
              <span className="font-mono text-xs tabular-nums text-foreground/70">{streak}</span>
            </div>
          )}
          <button
            onClick={onEdit}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Edit habit"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this habit?")) onDelete();
            }}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            aria-label="Delete habit"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-border/50">
              <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2">
                Recommended for you
              </p>
              <div className="space-y-1">
                {recs.isLoading && (
                  <div className="text-sm text-muted-foreground py-2">Loading videos…</div>
                )}
                {!recs.isLoading && recs.data?.length === 0 && (
                  <div className="text-sm text-muted-foreground py-2">
                    No videos yet. Add `VITE_YOUTUBE_API_KEY` to your `.env` to enable recommendations.
                  </div>
                )}
                {recs.isError && (
                  <div className="text-sm text-destructive py-2">Couldn’t load recommendations.</div>
                )}
                {recs.data?.map((v, i) => (
                  <VideoCard key={v.id} video={v} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HabitCard;
