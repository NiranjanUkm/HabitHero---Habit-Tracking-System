import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitCheckin, HabitWithCheckins } from '@/types/habit';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { format, isSameDay, parseISO } from 'date-fns';

// A client-side streak calculation for immediate UI feedback.
// Note: The backend has a more robust calculation in the analytics endpoint.
const calculateStreak = (checkins: HabitCheckin[]): number => {
  if (!checkins || checkins.length === 0) {
    return 0;
  }

  // Sort dates descending
  const sortedDates = checkins.map(c => parseISO(c.checkin_date)).sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let today = new Date();

  // Check if today or yesterday is the last check-in to start the streak
  if (!isSameDay(sortedDates[0], today) && !isSameDay(sortedDates[0], new Date().setDate(today.getDate() - 1))) {
    return 0;
  }

  let expectedDate = today;
  for (const date of sortedDates) {
    if (isSameDay(date, expectedDate)) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (isSameDay(date, new Date(expectedDate.getTime() - 1))) {
      // handles the case where there are multiple check-ins on the same day
      continue;
    }
    else {
      break;
    }
  }

  return streak;
};

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHabitsAndCheckins = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    };
    try {
      setLoading(true);
      const [habitsResponse, checkinsResponse] = await Promise.all([
        api.habits.getAll(),
        api.checkins.getAllForUser(),
      ]);
      setHabits(habitsResponse);
      setCheckins(checkinsResponse);
    } catch (error) {
      console.error('Failed to load habits and check-ins:', error);
      // You might want to show a toast message to the user here
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadHabitsAndCheckins();
  }, [loadHabitsAndCheckins]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'user_id' | 'description' | 'frequency'> & { frequency: string }) => {
    if (!user) return;
    const newHabit = await api.habits.create(habitData);
    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const deleteHabit = async (habitId: number) => {
    if (!user) return;
    await api.habits.delete(habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    // Also remove check-ins associated with the deleted habit from local state
    setCheckins(prev => prev.filter(c => c.habit_id !== habitId));
  };

  const toggleCheckin = async (habitId: number) => {
    if (!user) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingCheckin = checkins.find(
      c => c.habit_id === habitId && c.checkin_date === todayStr
    );

    if (existingCheckin) {
      // If a check-in exists for today, remove it
      await api.checkins.removeCheckin(habitId, existingCheckin.id);
      setCheckins(prev => prev.filter(c => c.id !== existingCheckin.id));
    } else {
      // If it doesn't exist, add a new one for today
      const newCheckin = await api.checkins.addCheckin(habitId, { checkin_date: todayStr });
      setCheckins(prev => [...prev, newCheckin]);
    }
  };

  const getHabitsWithCheckins = (): HabitWithCheckins[] => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    return habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habit_id === habit.id);
      const completedToday = habitCheckins.some(c => c.checkin_date === todayStr);
      const streak = calculateStreak(habitCheckins);

      return {
        ...habit,
        checkins: habitCheckins,
        streak,
        completedToday,
      };
    });
  };

  return {
    habits,
    checkins,
    loading,
    addHabit,
    toggleCheckin,
    deleteHabit,
    getHabitsWithCheckins,
    refreshData: loadHabitsAndCheckins,
  };
};