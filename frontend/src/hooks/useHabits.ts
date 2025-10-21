import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitCheckin, HabitWithCheckins } from '@/types/habit';
import { useAuth } from '@/contexts/AuthContext';
// FIX: Import the correct API structures
import api from '@/lib/api'; 
import { format, isSameDay, parseISO } from 'date-fns';

// A client-side streak calculation for immediate UI feedback.
const calculateStreak = (checkins: HabitCheckin[]): number => {
  if (!checkins || checkins.length === 0) {
    return 0;
  }

  // Sort dates descending - handle both date strings and full datetime strings
  const sortedDates = checkins.map(c => {
    // If it's already a date string (YYYY-MM-DD), parse it directly
    if (c.checkin_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return new Date(c.checkin_date + 'T00:00:00.000Z');
    }
    return parseISO(c.checkin_date);
  }).sort((a, b) => b.getTime() - a.getTime());

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

  // FIX: Converted to useCallback for dependency stability
  const loadHabitsAndCheckins = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    };
    try {
      setLoading(true);
      // FIX: Use the correct API calls from the integrated 'api' object
      const [habitsResponse, checkinsResponse] = await Promise.all([
        api.habits.getAll(),
        api.checkins.getAllForUser(),
      ]);
      // FIX: The backend returns a straight array, no need for .habits/checkins
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

  // FIX: Ensure habitData type is correctly defined as the input to the API
  const addHabit = async (habitData: { name: string; description?: string; frequency: string; category: string; start_date: string; }) => {
    if (!user) return;
    // FIX: API returns the new habit object directly (type is `Habit`)
    const newHabit = await api.habits.create(habitData);
    // FIX: Safely cast the returned object to the Habit type
    setHabits(prev => [...prev, newHabit as Habit]); 
    return newHabit as Habit;
  };

  const deleteHabit = async (habitId: number) => {
    if (!user) return;
    await api.habits.delete(habitId);
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCheckins(prev => prev.filter(c => c.habit_id !== habitId));
  };

  const toggleCheckin = async (habitId: number) => {
    if (!user) return;

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const existingCheckin = checkins.find(c => {
      const checkinDate = c.checkin_date;
      // Handle both date strings and datetime strings for comparison
      if (checkinDate.includes('T')) {
        return c.habit_id === habitId && checkinDate.split('T')[0] === todayStr;
      }
      return c.habit_id === habitId && checkinDate === todayStr;
    });

    if (existingCheckin) {
      // DELETE: Optimistically update by filtering out the removed check-in
      setCheckins(prev => prev.filter(c => c.id !== existingCheckin.id)); // Optimistic update
      try {
        await api.checkins.removeCheckin(habitId, existingCheckin.id);
      } catch (error) {
        // Handle rollback if API fails, though usually not strictly necessary for this task level
        console.error("Failed to remove check-in:", error);
        // On failure, re-add the existing check-in to local state
        setCheckins(prev => [...prev, existingCheckin]);
        throw error;
      }
    } else {
      // ADD: Optimistically update by using a placeholder/mocked ID before API returns
      const tempCheckin: HabitCheckin = { // Create temporary check-in object
        id: -1, // Use a placeholder ID
        habit_id: habitId,
        checkin_date: todayStr,
        notes: null,
        status: 'completed'
      };
      setCheckins(prev => [...prev, tempCheckin]); // Optimistic update
      
      try {
        // FIX: Use the correct API call from checkinsAPI
        const newCheckin = await api.checkins.addCheckin(habitId, { checkin_date: todayStr });
        // Replace temporary check-in with real one from API response
        setCheckins(prev => prev.filter(c => c.id !== -1).concat(newCheckin as HabitCheckin));
      } catch (error) {
        // Handle rollback: remove the temporary check-in on failure
        setCheckins(prev => prev.filter(c => c.id !== -1));
        throw error;
      }
    }
  };

  const getHabitsWithCheckins = (): HabitWithCheckins[] => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    return habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habit_id === habit.id);
      // NOTE: This includes the optimistic change from the setCheckins call above!
      // Handle both date strings and datetime strings for comparison
      const completedToday = habitCheckins.some(c => {
        const checkinDate = c.checkin_date;
        // If it's a full datetime string, extract just the date part
        if (checkinDate.includes('T')) {
          return checkinDate.split('T')[0] === todayStr;
        }
        return checkinDate === todayStr;
      });

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