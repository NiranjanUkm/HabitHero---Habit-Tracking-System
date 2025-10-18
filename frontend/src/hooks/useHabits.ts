import { useState, useEffect } from 'react';
import { Habit, HabitCheckin, HabitWithCheckins } from '@/types/habit';
import { useAuth } from '@/contexts/AuthContext';
import { habitsAPI } from '@/lib/api';

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHabitsAndCheckins();
    }
  }, [user]);

  const loadHabitsAndCheckins = async () => {
    try {
      setLoading(true);

      // TODO: Uncomment when backend is ready
      // const [habitsResponse, checkinsResponse] = await Promise.all([
      //   habitsAPI.getAll(),
      //   habitsAPI.getCheckins()
      // ]);

      // setHabits(habitsResponse.habits);
      // setCheckins(checkinsResponse.checkins);

      // For now, use mock data
      const mockHabits: Habit[] = [
        {
          id: "1",
          name: "Drink Water",
          frequency: "daily",
          category: "health",
          start_date: "2024-01-01",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          user_id: user?.id || "demo-user"
        },
        {
          id: "2",
          name: "Exercise",
          frequency: "daily",
          category: "health",
          start_date: "2024-01-01",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          user_id: user?.id || "demo-user"
        },
        {
          id: "3",
          name: "Read Books",
          frequency: "daily",
          category: "learning",
          start_date: "2024-01-01",
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          user_id: user?.id || "demo-user"
        }
      ];

      const mockCheckins: HabitCheckin[] = [
        {
          id: "1",
          habit_id: "1",
          user_id: user?.id || "demo-user",
          checkin_date: "2024-01-15",
          notes: "Drank 8 glasses",
          created_at: "2024-01-15T00:00:00Z"
        },
        {
          id: "2",
          habit_id: "2",
          user_id: user?.id || "demo-user",
          checkin_date: "2024-01-15",
          notes: "30 minutes workout",
          created_at: "2024-01-15T00:00:00Z"
        }
      ];

      setHabits(mockHabits);
      setCheckins(mockCheckins);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    // TODO: Uncomment when backend is ready
    // const response = await habitsAPI.create(habitData);
    // const newHabit = response.habit;
    // setHabits(prev => [...prev, newHabit]);
    // return newHabit;

    // Simulate API call
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setHabits(prev => [...prev, newHabit]);
    return newHabit;
  };

  const toggleCheckin = async (habitId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const existingCheckin = checkins.find(
      c => c.habit_id === habitId && c.checkin_date === today
    );

    if (existingCheckin) {
      // TODO: Uncomment when backend is ready
      // await habitsAPI.removeCheckin(habitId, existingCheckin.id);
      // setCheckins(prev => prev.filter(c => c.id !== existingCheckin.id));

      // Simulate API call
      setCheckins(prev => prev.filter(c => c.id !== existingCheckin.id));
    } else {
      // TODO: Uncomment when backend is ready
      // const response = await habitsAPI.addCheckin(habitId, { checkin_date: today });
      // const newCheckin = response.checkin;
      // setCheckins(prev => [...prev, newCheckin]);

      // Simulate API call
      const newCheckin: HabitCheckin = {
        id: Date.now().toString(),
        habit_id: habitId,
        user_id: user.id,
        checkin_date: today,
        created_at: new Date().toISOString()
      };

      setCheckins(prev => [...prev, newCheckin]);
    }
  };

  const deleteHabit = async (habitId: string) => {
    // TODO: Uncomment when backend is ready
    // await habitsAPI.delete(habitId);
    // setHabits(prev => prev.filter(h => h.id !== habitId));
    // setCheckins(prev => prev.filter(c => c.habit_id !== habitId));

    // Simulate API call
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setCheckins(prev => prev.filter(c => c.habit_id !== habitId));
  };

  const getHabitsWithCheckins = (): HabitWithCheckins[] => {
    const today = new Date().toISOString().split('T')[0];

    return habits.map(habit => {
      const habitCheckins = checkins.filter(c => c.habit_id === habit.id);
      const completedToday = habitCheckins.some(c => c.checkin_date === today);

      // Calculate streak (simplified)
      const streak = habitCheckins.length;

      return {
        ...habit,
        checkins: habitCheckins,
        streak,
        completedToday
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
    refreshData: loadHabitsAndCheckins
  };
};
