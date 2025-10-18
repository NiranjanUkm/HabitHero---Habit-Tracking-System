import { useState, useEffect } from 'react';
import { Habit, HabitCheckin, HabitWithCheckins } from '@/types/habit';
import { useAuth } from '@/contexts/AuthContext';

// Mock data - replace with API calls later
const mockHabits: Habit[] = [
  {
    id: "1",
    name: "Drink Water",
    frequency: "daily",
    category: "health",
    start_date: "2024-01-01",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user"
  },
  {
    id: "2",
    name: "Exercise",
    frequency: "daily",
    category: "health",
    start_date: "2024-01-01",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user"
  },
  {
    id: "3",
    name: "Read Books",
    frequency: "daily",
    category: "learning",
    start_date: "2024-01-01",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    user_id: "demo-user"
  }
];

const mockCheckins: HabitCheckin[] = [
  {
    id: "1",
    habit_id: "1",
    user_id: "demo-user",
    checkin_date: "2024-01-15",
    notes: "Drank 8 glasses",
    created_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "2",
    habit_id: "2",
    user_id: "demo-user",
    checkin_date: "2024-01-15",
    notes: "30 minutes workout",
    created_at: "2024-01-15T00:00:00Z"
  }
];

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [checkins, setCheckins] = useState<HabitCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // TODO: Replace with API calls
      // const fetchHabits = async () => {
      //   const response = await fetch('/api/habits');
      //   const data = await response.json();
      //   setHabits(data);
      // };
      // const fetchCheckins = async () => {
      //   const response = await fetch('/api/habits/checkins');
      //   const data = await response.json();
      //   setCheckins(data);
      // };

      // Simulate API calls
      setTimeout(() => {
        setHabits(mockHabits.filter(h => h.user_id === user.id));
        setCheckins(mockCheckins.filter(c => c.user_id === user.id));
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const addHabit = async (habitData: Omit<Habit, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    if (!user) return;

    // TODO: Replace with API call
    // const response = await fetch('/api/habits', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ...habitData, user_id: user.id })
    // });
    // const newHabit = await response.json();

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
      // TODO: Replace with API call
      // await fetch(`/api/habits/${habitId}/checkins/${existingCheckin.id}`, {
      //   method: 'DELETE'
      // });

      // Simulate API call
      setCheckins(prev => prev.filter(c => c.id !== existingCheckin.id));
    } else {
      // TODO: Replace with API call
      // const response = await fetch(`/api/habits/${habitId}/checkins`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ checkin_date: today })
      // });
      // const newCheckin = await response.json();

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
    // TODO: Replace with API call
    // await fetch(`/api/habits/${habitId}`, { method: 'DELETE' });

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
    getHabitsWithCheckins
  };
};
