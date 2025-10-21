import { useState, useMemo } from "react"; // Import useMemo
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HabitCheckin, HabitWithCheckins } from "@/types/habit"; 
import * as React from 'react'; // Import React
import { useHabits } from '@/hooks/useHabits';

interface CalendarViewProps {
  checkins: HabitCheckin[];
  habits: HabitWithCheckins[]; 
}

const CalendarViewComponent = ({ checkins: _propCheckins, habits }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use global checkins state for instant updates
  const { checkins } = useHabits();

  // FIX: Memoize the filtered habits for efficiency, though the key prop forces the re-render.
  const habitsWithCheckins = useMemo(() => habits, [habits]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCheckinsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return checkins.filter(checkin => {
      const checkinDate = checkin.checkin_date;
      // Handle both date strings and datetime strings for comparison
      if (checkinDate.includes('T')) {
        return checkinDate.split('T')[0] === dateStr;
      }
      return checkinDate === dateStr;
    });
  };

  const getHabitsCompletedOnDate = (date: Date) => {
    const dateCheckins = getCheckinsForDate(date);
    const habitIds = dateCheckins.map(c => c.habit_id);
    return habitsWithCheckins.filter(habit => habitIds.includes(habit.id));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(current =>
      direction === 'next' ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Habit Calendar</h2>
        <p className="text-muted-foreground">
          View your habit completion history
        </p>
      </div>

      {/* Calendar Header */}
      <Card className="p-6 mb-6 bg-gradient-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
              className="border-border"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const dayCheckins = getCheckinsForDate(day);
            const completedHabits = getHabitsCompletedOnDate(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <div
                key={index}
                className={`
                  min-h-[80px] p-2 border border-border rounded-md
                  ${isCurrentMonth ? 'bg-card' : 'bg-muted/20'}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                  hover:bg-accent/10 transition-colors
                `}
              >
                <div className="text-sm font-medium mb-1 text-foreground">
                  {format(day, 'd')}
                </div>

                {completedHabits.length > 0 && (
                  <div className="space-y-1">
                    {completedHabits.slice(0, 3).map(habit => (
                      <div
                        key={habit.id}
                        className="text-xs px-1 py-0.5 rounded bg-success/20 text-success border border-success/30"
                        title={habit.name}
                      >
                        {habit.name.length > 8 ? `${habit.name.substring(0, 8)}...` : habit.name}
                      </div>
                    ))}
                    {completedHabits.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{completedHabits.length - 3} more
                      </div>
                    )}
                  </div>
                )}

                {dayCheckins.length === 0 && isCurrentMonth && (
                  <div className="text-xs text-muted-foreground mt-1">
                    No check-ins
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-gradient-card border-border">
        <h4 className="font-medium text-foreground mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success/20 border border-success/30 rounded"></div>
            <span className="text-muted-foreground">Habit completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 ring-2 ring-primary rounded"></div>
            <span className="text-muted-foreground">Today</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const CalendarView = React.memo(CalendarViewComponent);