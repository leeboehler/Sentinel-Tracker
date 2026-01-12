
import { Activity, Goal, Section, Category } from './types';

export const INITIAL_GOALS: Goal[] = [
  { id: '1', title: 'Healthy Lifestyle', description: 'Focus on physical and mental well-being', emoji: '🥗' },
  { id: '2', title: 'Knowledge Peak', description: 'Constant learning and improvement', emoji: '📚' },
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Health', orderIndex: 0 },
  { id: 'c2', name: 'Productivity', orderIndex: 1 },
  { id: 'c3', name: 'Mind', orderIndex: 2 },
  { id: 'c4', name: 'General', orderIndex: 3 }
];

export const INITIAL_SECTIONS: Section[] = [
  { id: 's1', name: 'Morning', orderIndex: 0 },
  { id: 's2', name: 'Lunch', orderIndex: 1 },
  { id: 's3', name: 'Evening', orderIndex: 2 }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: 'Morning Yoga',
    emoji: '🧘',
    type: 'binär',
    category: 'Health',
    section: 'Morning',
    orderIndex: 0,
    goalId: '1',
    interval: 'daily',
    customDays: [0, 1, 2, 3, 4, 5, 6],
    description: '15 minutes of dynamic stretching'
  },
  {
    id: 'a3',
    title: 'Water Intake',
    emoji: '💧',
    type: 'zahlen',
    category: 'Health',
    section: 'Morning',
    orderIndex: 1,
    goalId: '1',
    interval: 'daily',
    customDays: [0, 1, 2, 3, 4, 5, 6],
    description: 'Glasses of water (250ml)'
  }
];
