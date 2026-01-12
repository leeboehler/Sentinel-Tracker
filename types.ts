
export type ActivityType = 'binär' | 'zeit' | 'zahlen' | 'auswahl' | 'daten' | 'protokoll';

export type IntervalType = 'daily' | 'weekdays' | 'custom';

export interface SelectionOption {
  id: string;
  label: string;
}

export interface ProtocolItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Section {
  id: string;
  name: string;
  orderIndex: number;
}

export interface Category {
  id: string;
  name: string;
  orderIndex: number;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  type: ActivityType;
  category: string; 
  section: string; 
  orderIndex: number; 
  goalId?: string;
  interval: IntervalType;
  customDays: number[]; 
  options?: SelectionOption[]; 
  isMultiSelect?: boolean; 
  unit?: string; 
  isNumberData?: boolean; 
  protocolItems?: ProtocolItem[]; 
}

export interface ActivityLog {
  id: string;
  activityId: string;
  date: string; 
  value: any; 
  timestamp: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export type TabType = 'today' | 'journal' | 'stats' | 'all' | 'goals' | 'settings';
export type ThemeType = 'dark' | 'light';
