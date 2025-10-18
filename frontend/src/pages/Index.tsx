import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AuthPage } from "@/components/auth/AuthPage";
import { Header } from "@/components/layout/Header";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { Analytics } from "@/components/analytics/Analytics";
import { CalendarView } from "@/components/calendar/CalendarView";
import { HabitForm } from "@/components/habits/HabitForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Calendar, LayoutDashboard } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddHabit, setShowAddHabit] = useState(false);

  useEffect(() => {
    // Simulate authentication check
    const checkAuth = async () => {
      // Simulate checking if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (isLoggedIn) {
        setUser({ id: 'demo-user', email: 'demo@example.com' });
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const fetchData = async () => {
    if (!user) return;

    // Simulate API calls - replace with actual backend calls later
    // For now, use mock data
    const mockHabits = [
      {
        id: "1",
        name: "Drink Water",
        frequency: "daily",
        category: "health",
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        user_id: user.id
      },
      {
        id: "2",
        name: "Exercise",
        frequency: "daily",
        category: "health",
        start_date: "2024-01-01",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        user_id: user.id
      }
    ];

    const mockCheckins = [
      {
        id: "1",
        habit_id: "1",
        user_id: user.id,
        checkin_date: "2024-01-15",
        notes: "Drank 8 glasses",
        created_at: "2024-01-15T00:00:00Z"
      },
      {
        id: "2",
        habit_id: "2",
        user_id: user.id,
        checkin_date: "2024-01-15",
        notes: "30 minutes workout",
        created_at: "2024-01-15T00:00:00Z"
      }
    ];

    setHabits(mockHabits);
    setCheckins(mockCheckins);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
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

  if (!user) {
    return <AuthPage />;
  }

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
            <Dashboard habits={habits} checkins={checkins} onUpdate={() => {}} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView checkins={checkins} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics habits={habits} checkins={checkins} />
          </TabsContent>
        </Tabs>
      </main>

      <HabitForm
        open={showAddHabit}
        onOpenChange={setShowAddHabit}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default Index;
