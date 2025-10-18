import { motion } from "framer-motion";
import { HabitCard } from "../habits/HabitCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Habit {
  id: string;
  name: string;
  frequency: string;
  category: string;
  start_date: string;
}

interface DashboardProps {
  habits: Habit[];
  checkins: any[];
  onUpdate: () => void;
}

export const Dashboard = ({ habits, checkins, onUpdate }: DashboardProps) => {
  const today = new Date().toISOString().split("T")[0];

  const isCheckedToday = (habitId: string) => {
    return checkins.some(
      (checkin) => checkin.habit_id === habitId && checkin.checkin_date === today
    );
  };

  const filterHabitsByCategory = (category?: string) => {
    if (!category) return habits;
    return habits.filter((h) => h.category === category);
  };

  const HabitList = ({ filteredHabits }: { filteredHabits: Habit[] }) => (
    <div className="space-y-3">
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-muted-foreground"
        >
          <p className="text-lg">No habits yet. Create your first one!</p>
        </motion.div>
      ) : (
        filteredHabits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <HabitCard
              habit={habit}
              isCheckedToday={isCheckedToday(habit.id)}
              onUpdate={onUpdate}
            />
          </motion.div>
        ))
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">Your Habits</h2>
        <p className="text-muted-foreground">
          Track your progress and build consistency
        </p>
      </motion.div>

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
          <HabitList filteredHabits={habits} />
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
  );
};
