import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, LayoutDashboard } from "lucide-react";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { habits, loading: habitsLoading, getHabitsWithCheckins } = useHabits();
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

  const habitsWithCheckins = getHabitsWithCheckins();

  const filterHabitsByCategory = (category?: string) => {
    if (!category) return habitsWithCheckins;
    return habitsWithCheckins.filter((h) => h.category === category);
  };

  const HabitList = ({ filteredHabits }: { filteredHabits: typeof habitsWithCheckins }) => (
    <div className="space-y-3">
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No habits yet. Create your first one!</p>
        </div>
      ) : (
        filteredHabits.map((habit) => (
          <div key={habit.id} className="text-sm">
            {habit.name} - {habit.category} - {habit.completedToday ? '✅' : '⏳'}
          </div>
        ))
      )}
    </div>
  );

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
            <div className="container mx-auto px-4 py-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Your Habits</h2>
                <p className="text-muted-foreground">
                  Track your progress and build consistency
                </p>
              </div>

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6 bg-secondary/50 p-1">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="health" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    🏃 Health
                  </TabsTrigger>
                  <TabsTrigger value="work" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    💼 Work
                  </TabsTrigger>
                  <TabsTrigger value="learning" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    📚 Learning
                  </TabsTrigger>
                  <TabsTrigger value="other" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                    ✨ Other
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <HabitList filteredHabits={habitsWithCheckins} />
                </TabsContent>
                <TabsContent value="health">
                  <HabitList filteredHabits={filterHabitsByCategory("health")} />
                </TabsContent>
                <TabsContent value="work">
                  <HabitList filteredHabits={filterHabitsByCategory("work")} />
                </TabsContent>
                <TabsContent value="learning">
                  <HabitList filteredHabits={filterHabitsByCategory("learning")} />
                </TabsContent>
                <TabsContent value="other">
                  <HabitList filteredHabits={filterHabitsByCategory("other")} />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Calendar view coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Analytics dashboard coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
