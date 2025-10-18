import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { habits, loading: habitsLoading } = useHabits();
  const [showAddHabit, setShowAddHabit] = useState(false);

  if (authLoading || habitsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onOpenAddHabit={() => setShowAddHabit(true)} />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Habit Hero</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Build better habits, one day at a time
          </p>
          <div className="text-sm text-muted-foreground mb-4">
            You have {habits.length} habit{habits.length !== 1 ? 's' : ''} configured
          </div>
          <div className="text-sm text-muted-foreground">
            Dashboard coming soon...
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
