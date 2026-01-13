
import React, { useState } from 'react';
import { Activity, ActivityLog, Goal, TabType, ThemeType, Section, Category } from '../types';
import TodayView from './dashboard/TodayView';
import JournalView from './dashboard/JournalView';
import StatsView from './dashboard/StatsView';
import AllActivitiesView from './dashboard/AllActivitiesView';
import GoalsView from './dashboard/GoalsView';
import SettingsView from './dashboard/SettingsView';
import { LayoutGrid, Calendar, BarChart3, List, Target, Sun, Moon } from 'lucide-react';

interface DashboardProps {
  activities: Activity[];
  logs: ActivityLog[];
  goals: Goal[];
  sections: Section[];
  categories: Category[];
  theme: ThemeType;
  onSetTheme: (theme: ThemeType) => void;
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onUpdateLog: (id: string, value: any) => void;
  onDeleteLog: (id: string) => void;
  onAddActivity: (activity: Activity) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onAddSection: (name: string) => void;
  onDeleteSection: (id: string) => void;
  onUpdateSections: (sections: Section[]) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdateActivities: (activities: Activity[]) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<TabType>('today');

  const renderContent = () => {
    switch (activeTab) {
      case 'today': return <TodayView {...props} />;
      case 'journal': return <JournalView {...props} />;
      case 'stats': return <StatsView {...props} />;
      case 'all': return <AllActivitiesView {...props} setActiveTab={setActiveTab} />;
      case 'goals': return <GoalsView {...props} />;
      case 'settings': return <SettingsView {...props} />;
      default: return <TodayView {...props} />;
    }
  };

  const navItems = [
    { id: 'today', label: 'Heute', icon: LayoutGrid },
    { id: 'journal', label: 'Tagebuch', icon: Calendar },
    { id: 'stats', label: 'Woche', icon: BarChart3 },
    { id: 'all', label: 'Liste', icon: List },
    { id: 'goals', label: 'Ziele', icon: Target },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-24 md:pb-12">
      <div className="min-h-[60vh]">
        {renderContent()}
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 pointer-events-none flex justify-center">
        <nav className={`glass rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl pointer-events-auto border border-white/5 max-w-fit overflow-x-auto scrollbar-hide`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-slate-600 text-white font-semibold scale-105 shadow-inner' 
                : props.theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-black hover:bg-black/5'
              }`}
            >
              <item.icon size={18} />
              <span className="hidden sm:inline text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="w-px h-6 bg-slate-500/20 mx-1"></div>
          
          <button
            onClick={() => props.onSetTheme(props.theme === 'dark' ? 'light' : 'dark')}
            className={`p-3 rounded-full transition-all ${props.theme === 'dark' ? 'text-slate-400 hover:text-yellow-400' : 'text-slate-500 hover:text-slate-600'}`}
          >
            {props.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
