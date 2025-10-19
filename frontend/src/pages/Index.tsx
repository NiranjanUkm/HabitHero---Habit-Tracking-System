import { motion } from "framer-motion";
import { AuthPage } from "@/components/auth/AuthPage";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Analytics } from "@/components/analytics/Analytics";
import { CalendarView } from "@/components/calendar/CalendarView";
import { HabitForm } from "@/components/habits/HabitForm";
// FIX: Import the new AI Suggestions Modal
import { AISuggestionsModal } from "@/components/habits/AISuggestionsModal"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext"; 
// FIX: Import useState and useMemo from 'react'
import { useState, useMemo } from "react"; 
import { useHabits } from "@/hooks/useHabits";   

const Index = () => {
  // 1. ALL HOOKS MUST RUN UNCONDITIONALLY AT THE TOP LEVEL
  const { user, loading: authLoading } = useAuth(); 
  const { 
    habits, // Dependency for useMemo
    checkins, // Dependency for useMemo and key
    loading: habitsLoading, 
    refreshData: refreshHabitData, 
    getHabitsWithCheckins 
  } = useHabits();
  
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false); // FIX: State for AI Modal

  // FIX: MOVED useMemo to the top level so it runs unconditionally (Rules of Hooks fix)
  const habitsWithCheckins = useMemo(() => {
    return getHabitsWithCheckins();
  }, [habits, checkins, getHabitsWithCheckins]); 
  
  
  const isLoading = authLoading || habitsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-bold text-primary"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Conditional early return is now safely below all hook calls
  if (!user) {
    return <AuthPage />;
  }
  
  const handleHabitSuccess = () => {
      setShowAddHabit(false);
      // Trigger data refresh to update the habits list
      refreshHabitData(); 
  };

  // FIX: checkins.length is used as a key to force re-render for responsiveness
  const dataUpdateKey = checkins.length;


  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header 
        onOpenAddHabit={() => setShowAddHabit(true)} 
        onOpenAISuggestions={() => setShowAISuggestions(true)} // FIX: Pass open handler to Header
      />

      <main className="pb-8">
        <Tabs defaultValue="dashboard" className="container mx-auto px-4 pt-6">
          <TabsList className="mb-6 bg-secondary/50 p-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
                key={dataUpdateKey} // Force re-render on data change
                habits={habitsWithCheckins} 
                checkins={checkins} 
                onUpdate={refreshHabitData} 
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView 
                key={dataUpdateKey} // Force re-render on data change
                checkins={checkins} 
                habits={habitsWithCheckins}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics 
                key={dataUpdateKey} // Force re-render on data change
                habits={habitsWithCheckins} 
                checkins={checkins} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <HabitForm
        open={showAddHabit}
        onOpenChange={setShowAddHabit}
        onSuccess={handleHabitSuccess} 
      />
      
      {/* FIX: Render the AI Suggestions Modal */}
      <AISuggestionsModal
        open={showAISuggestions}
        onOpenChange={setShowAISuggestions}
        onHabitAdded={() => {
          // Close modal and trigger data refresh after habit is added from AI
          setShowAISuggestions(false);
          refreshHabitData();
        }}
      />
    </div>
  );
};

export default Index;