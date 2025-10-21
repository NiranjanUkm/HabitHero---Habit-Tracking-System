import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Trash2, Loader2 } from "lucide-react";
import { useHabits } from "@/hooks/useHabits";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { HabitWithCheckins } from "@/types/habit"; 
import { format } from "date-fns"; // Import format

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
  // Use global checkins for instant optimistic UI updates
  const { toggleCheckin, deleteHabit, checkins } = useHabits();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Recompute completedToday from latest global checkins (optimistic updates included)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const completedToday = checkins.some(c => {
    if (c.habit_id !== habit.id) return false;
    const d = c.checkin_date;
    return d.includes('T') ? d.split('T')[0] === todayStr : d === todayStr;
  });
  
  // This status is what the toast message should use
  const willBeCompleted = !completedToday; 

  const handleToggleCheckin = async () => {
    setLoading(true);
    try {
      // Await the toggle function (which updates the global checkins state optimistically)
      await toggleCheckin(habit.id);
      
      // Use pre-toggle intent for messaging
      toast({
        title: "Success!",
        description: willBeCompleted ? "Check-in added" : "Check-in removed", 
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update check-in",
        variant: "destructive",
      });
    } finally {
      // The UI will now update instantly because the 'checkins' state (a direct dependency) changed.
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
  
  // Conditionally render the button icon based on state
  const checkmarkIcon = loading ? (
    <Loader2 className="w-6 h-6 text-primary animate-spin" /> // Spinner while loading
  ) : completedToday ? ( 
    <CheckCircle2 className="w-6 h-6 text-success" />
  ) : (
    <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
  );


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
              disabled={loading || deleting}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-1 hover:scale-110 transition-transform"
            >
              {checkmarkIcon}
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
            disabled={deleting || loading}
            className="hover:bg-destructive hover:text-destructive-foreground border-border transition-colors"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};