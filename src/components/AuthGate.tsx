import { LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl bg-card shadow-card p-6"
        >
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Self-Development Tracker</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to add habits, track daily completion, and get YouTube recommendations.
          </p>

          <button
            onClick={() => void loginWithGoogle()}
            className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-medium transition-all hover:opacity-90"
          >
            <span className="inline-flex items-center gap-2 justify-center">
              <LogIn className="w-4 h-4" />
              Continue with Google
            </span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-[640px] px-5 py-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">
              {user.displayName || user.email || "User"}
            </p>
          </div>
          <button
            onClick={() => void logout()}
            className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

