export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  category: 'health' | 'work' | 'learning' | 'other';
  start_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface HabitCheckin {
  id: string;
  habit_id: string;
  user_id: string;
  checkin_date: string;
  notes?: string;
  created_at: string;
}

export interface HabitWithCheckins extends Habit {
  checkins: HabitCheckin[];
  streak: number;
  completedToday: boolean;
}

export type HabitCategory = 'health' | 'work' | 'learning' | 'other';
export type HabitFrequency = 'daily' | 'weekly';

export const HABIT_CATEGORIES: { value: HabitCategory; label: string; emoji: string }[] = [
  { value: 'health', label: 'Health', emoji: '🏃' },
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'learning', label: 'Learning', emoji: '📚' },
  { value: 'other', label: 'Other', emoji: '✨' },
];

export const HABIT_FREQUENCIES: { value: HabitFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];
