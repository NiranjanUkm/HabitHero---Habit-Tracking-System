export interface Habit {
  id: number;
  name: string;
  description?: string | null;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'health' | 'work' | 'learning' | 'other';
  start_date: string;
  user_id: number;
}

export interface HabitCheckin {
  id: number;
  habit_id: number;
  checkin_date: string;
  notes?: string | null;
  status: string;
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