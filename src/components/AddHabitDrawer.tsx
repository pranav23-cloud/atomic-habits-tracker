import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { CATEGORIES, type Category } from "@/hooks/useHabits";
import { useEffect } from "react";

interface AddHabitDrawerProps {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initial?: { name: string; type: "daily" | "weekly"; category: Category; goal?: string };
  onSubmit: (habit: { name: string; type: "daily" | "weekly"; category: Category; goal?: string }) => void | Promise<void>;
}

const AddHabitDrawer = ({ open, onClose, onSubmit, mode = "create", initial }: AddHabitDrawerProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"daily" | "weekly">("daily");
  const [category, setCategory] = useState<Category>("Mental");
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setName(initial.name ?? "");
      setType(initial.type ?? "daily");
      setCategory(initial.category ?? "Mental");
      setGoal(initial.goal ?? "");
      return;
    }
    setName("");
    setType("daily");
    setCategory("Mental");
    setGoal("");
  }, [open, mode, initial]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), type, category, goal: goal.trim() || undefined });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-foreground/10 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-card max-w-[640px] mx-auto"
          >
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {mode === "edit" ? "Edit Habit" : "New Habit"}
                </h2>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                    Habit Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Read for 20 minutes"
                    className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.key}
                        onClick={() => setCategory(c.key)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          category === c.key
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span>{c.emoji}</span>
                        <span className="truncate">{c.key}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                    Frequency
                  </label>
                  <div className="flex gap-2">
                    {(["daily", "weekly"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          type === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-widest mb-2 block">
                    Goal (optional)
                  </label>
                  <input
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g., Finish 24 books this year"
                    className="w-full bg-muted rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!name.trim()}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {mode === "edit" ? "Save changes" : "Commit to habit"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddHabitDrawer;
