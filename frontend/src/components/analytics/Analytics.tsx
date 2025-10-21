import * as React from 'react'; 
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Target, Calendar, TrendingUp, FileText, Loader2 } from "lucide-react"; 
import type { HabitWithCheckins, HabitCheckin } from "@/types/habit"; 
import { format, subDays } from 'date-fns';
import api from '@/lib/api'; 
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useHabits } from '@/hooks/useHabits';

interface AnalyticsProps {
  habits: HabitWithCheckins[];
  checkins: HabitCheckin[];
}

// Function to calculate weekly completion rate for the last 7 days
const calculateWeeklyProgress = (checkins: HabitCheckin[]) => {
  const today = new Date();
  const data: { day: string, completed: number }[] = [];

  // Get the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Count unique habits checked off on this specific date
    const uniqueHabitIdsChecked = new Set(
      checkins
        .filter(c => {
          const checkinDate = c.checkin_date;
          // Handle both date strings and datetime strings for comparison
          if (checkinDate.includes('T')) {
            return checkinDate.split('T')[0] === dateStr;
          }
          return checkinDate === dateStr;
        })
        .map(c => c.habit_id)
    ).size;

    data.push({
      day: format(date, 'E'), // 'E' gives Mon, Tue, etc.
      completed: uniqueHabitIdsChecked,
    });
  }
  return data;
};


const AnalyticsComponent = ({ habits: habitsWithCheckins, checkins: _propCheckins }: AnalyticsProps) => {
  const { toast } = useToast();
  const [exporting, setExporting] = React.useState(false);
  
  // Use global checkins state for instant updates
  const { checkins } = useHabits(); 

  // --- STATS Calculation ---
  const totalHabits = habitsWithCheckins.length;
  const totalCheckins = habitsWithCheckins.reduce((sum, habit) => sum + habit.checkins.length, 0);
  
  const averageStreak = totalHabits > 0
    ? Math.round(habitsWithCheckins.reduce((sum, habit) => sum + (habit.streak || 0), 0) / totalHabits)
    : 0;
    
  const habitsCompletedToday = habitsWithCheckins.filter(h => h.completedToday).length;
  const completionRate = totalHabits > 0 
    ? Math.round((habitsCompletedToday / totalHabits) * 100) 
    : 0;

  // --- CHARTS Data ---
  const completionData = habitsWithCheckins.map(habit => ({
    name: habit.name.length > 15 ? `${habit.name.substring(0, 15)}...` : habit.name,
    completed: habit.checkins.length,
    streak: habit.streak,
    category: habit.category
  }));

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

  const weeklyData = calculateWeeklyProgress(checkins);


  // --- PDF Export Handler ---
  const handleExportPdf = async () => {
      setExporting(true);
      try {
          await api.report.exportPdf();
          toast({
              title: "Export Successful",
              description: "Your progress report has been downloaded as a PDF.",
          });
      } catch (error) {
          toast({
              title: "Export Failed",
              description: "Could not generate or download the PDF report.",
              variant: "destructive",
          });
      } finally {
          setExporting(false);
      }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track your habit-building progress and insights
          </p>
        </div>
        {/* Export PDF Button */}
        <Button onClick={handleExportPdf} disabled={exporting || totalHabits === 0} className="bg-primary/80 hover:bg-primary shadow-md">
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Export PDF
        </Button>
      </div>

      {/* Stats Cards - LIVE DATA */}
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
              <p className="text-xs sm:text-sm text-muted-foreground">Today's Success</p>
              <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{completionRate}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts - Stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Habit Completion Chart (Total Check-ins) */}
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
                formatter={(value: number, name: string, props) => [
                    `${value} Check-ins`,
                    `Streak: ${props.payload.streak || 0} days`
                ]}
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

      {/* Weekly Progress - LIVE DATA */}
      <Card className="p-4 sm:p-6 bg-gradient-card border-border">
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">Daily Check-in Count (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
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

export const Analytics = React.memo(AnalyticsComponent);