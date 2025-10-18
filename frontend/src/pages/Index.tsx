import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import { Header } from "@/components/layout/Header";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { CalendarView } from "@/components/calendar/CalendarView";
import { Analytics } from "@/components/analytics/Analytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, LayoutDashboard } from "lucide-react";

const Index = () => {
  // ... existing code ...

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onOpenAddHabit={() => setShowAddHabit(true)} />

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
            {/* ... existing dashboard content ... */}
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>
        </Tabs>
      </main>

      <HabitForm
        open={showAddHabit}
        onOpenChange={setShowAddHabit}
        onSuccess={() => {
          // Habits will be refreshed automatically via the hook
        }}
      />
    </div>
  );
};

export default Index;
