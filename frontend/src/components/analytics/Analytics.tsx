import { Card } from "@/components/ui/card";
import { useHabits } from "@/hooks/useHabits";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Calendar, TrendingUp } from "lucide-react";

export const Analytics = () => {
  const { getHabitsWithCheckins } = useHabits();
  const habitsWithCheckins = getHabitsWithCheckins();

  // Calculate completion rates
  const completionData = habitsWithCheckins.map(habit => ({
    name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
    completed: habit.checkins.length,
    streak: habit.streak,
    category: habit.category
  }));

  // Category distribution
  const categoryData = habitsWithCheckins.reduce((acc, habit) => {
    const existing = acc.find(item => item.name === habit.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({
        name: habit.category,
        value: 1,
        color: habit.category === 'health' ? '#10b981' :
               habit.category === 'work' ? '#3b82f6' :
               habit.category === 'learning' ? '#8b5cf6' : '#f59e0b'
      });
    }
    return acc;
  }, [] as { name: string; value: number; color: string }[]);

  // Weekly completion data (mock data for demo)
  const weeklyData = [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 5 },
    { day: 'Wed', completed: 2 },
    { day: 'Thu', completed: 4 },
    { day: 'Fri', completed: 6 },
    { day: 'Sat', completed: 3 },
    { day: 'Sun', completed: 4 },
  ];

  const totalHabits = habitsWithCheckins.length;
  const totalCheckins = habitsWithCheckins.reduce((sum, habit) => sum + habit.checkins.length, 0);
  const averageStreak = habitsWithCheckins.length > 0
    ? Math.round(habitsWithCheckins.reduce((sum, habit) => sum + habit.streak, 0) / habitsWithCheckins.length)
    : 0;
  const completionRate = totalHabits > 0 ? Math.round((totalCheckins / (totalHabits * 7)) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          Track your habit-building progress and insights
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
              <Target className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Habits</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{totalHabits}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-success/10 rounded-full">
              <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-success" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Check-ins</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{totalCheckins}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-accent/10 rounded-full">
              <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Avg Streak</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{averageStreak}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-secondary/10 rounded-full">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-secondary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Habit Completion Chart */}
        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Habit Completion</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card className="p-4 sm:p-6 bg-gradient-card border-border">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Habits by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="capitalize text-muted-foreground">
                  {item.name} ({item.value})
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="p-4 sm:p-6 bg-gradient-card border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="completed" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
