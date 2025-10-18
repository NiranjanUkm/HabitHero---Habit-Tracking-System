import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { HabitWithCheckins } from "@/types/habit";

interface HabitCardProps {
  habit: HabitWithCheckins;
}

const categoryEmojis: Record<string, string> = {
  health: "🏃",
  work: "💼",
  learning: "📚",
  other: "✨",
};

const categoryColors: Record<string, string> = {
  health: "bg-success-light border-success",
  work: "bg-accent-light/20 border-accent",
  learning: "bg-primary-light/20 border-primary",
  other: "bg-secondary border-border",
};

export const HabitCard = ({ habit }: HabitCardProps) => {
  const { toggleCheckin, deleteHabit } = useHabits();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleToggleCheckin = async () => {
    setLoading(true);
    try {
      await toggleCheckin(habit.id);
      toast({
        title: "Success!",
        description: habit.completedToday ? "Check-in removed" : "Check-in added",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update check-in",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    setDeleting(true);
    try {
      await deleteHabit(habit.id);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete habit",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`p-4 border-l-4 ${categoryColors[habit.category]} bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-200`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <motion.button
              onClick={handleToggleCheckin}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-1 hover:scale-110 transition-transform"
            >
              {habit.completedToday ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
              )}
            </motion.button>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{categoryEmojis[habit.category]}</span>
                <h3 className="font-semibold text-foreground text-lg">{habit.name}</h3>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="capitalize">{habit.frequency}</span>
                <span>•</span>
                <span className="capitalize">{habit.category}</span>
                <span>•</span>
                <span>Streak: {habit.streak}</span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            className="hover:bg-destructive hover:text-destructive-foreground border-border transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
