
import React, { useState } from 'react';
import { Activity, ActivityLog } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Edit3, Check, ListChecks } from 'lucide-react';
import ActivityDetailModal from '../Modals/ActivityDetailModal';

interface JournalViewProps {
  activities: Activity[];
  logs: ActivityLog[];
  onUpdateLog: (id: string, value: any) => void;
  onDeleteLog: (id: string) => void;
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
}

const JournalView: React.FC<JournalViewProps> = ({ activities, logs, onUpdateLog, onDeleteLog, onAddLog }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const changeDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const selectedDay = new Date(selectedDate).getDay();
  const sortedActivities = [...activities].sort((a, b) => a.orderIndex - b.orderIndex);
  
  const dayLogs = logs.filter(l => l.date === selectedDate);
  
  const formattedDate = new Date(selectedDate).toLocaleDateString('de-DE', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  const renderJournalAction = (activity: Activity, log: ActivityLog | undefined) => {
    let label = '';
    let isSuccess = false;

    if (!log) {
      return (
        <button className="p-3 bg-white/5 border border-slate-700 text-slate-600 rounded-xl">
          <Edit3 size={18} />
        </button>
      );
    }

    if (activity.type === 'binär') {
      return <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20"><Check size={20} /></div>;
    }
    
    if (activity.type === 'zeit') {
      label = `${Math.floor(log.value / 60)}h ${log.value % 60}m`;
      isSuccess = log.value > 0;
    } else if (activity.type === 'zahlen') {
      label = `${log.value} ${activity.unit || ''}`;
      isSuccess = log.value > 0;
    } else if (activity.type === 'daten') {
      label = String(log.value);
      isSuccess = !!log.value;
    } else if (activity.type === 'auswahl') {
      const selections = Array.isArray(log.value) ? log.value : [log.value];
      const names = selections.map(sId => activity.options?.find(o => o.id === sId)?.label).filter(Boolean);
      label = names.length > 0 ? names.join(', ') : 'Keine';
      isSuccess = names.length > 0;
    } else if (activity.type === 'protokoll') {
      const done = (log.value as any[]).filter(i => i.completed).length;
      const total = (log.value as any[]).length;
      label = `${done}/${total}`;
      isSuccess = (done === total && total > 0);
    }

    const colorClass = isSuccess 
      ? (activity.type === 'protokoll' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20')
      : 'bg-white/5 border-slate-700 text-slate-500';

    return (
      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all max-w-[200px] ${colorClass}`}>
        <span className="text-[10px] font-black uppercase tracking-widest truncate">{label}</span>
        <Edit3 size={14} className="shrink-0" />
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
      <div className="flex items-center justify-between glass p-4 rounded-[2rem] border border-white/10">
        <button onClick={() => changeDate(-1)} className="p-3 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft /></button>
        <div className="text-center">
           <h2 className="text-lg font-bold">{formattedDate}</h2>
           {selectedDate === new Date().toISOString().split('T')[0] && <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-0.5">Heute</p>}
        </div>
        <button onClick={() => changeDate(1)} className="p-3 hover:bg-white/5 rounded-full transition-colors"><ChevronRight /></button>
      </div>

      <div className="space-y-3">
        {sortedActivities.map(activity => {
          const log = dayLogs.find(l => l.activityId === activity.id);
          const isScheduled = activity.customDays.includes(selectedDay);
          
          return (
            <div 
              key={activity.id} 
              onClick={() => setEditingActivity(activity)}
              className={`glass p-5 rounded-[1.5rem] flex items-center justify-between cursor-pointer transition-all hover:border-white/20 ${log ? 'border-l-4 border-indigo-500' : isScheduled ? 'opacity-100' : 'opacity-40 grayscale-[50%]'}`}
            >
              <div className="flex items-center gap-5 min-w-0">
                <div className="text-3xl w-12 h-12 flex items-center justify-center glass rounded-2xl shrink-0">{activity.emoji}</div>
                <div className="min-w-0">
                  <h4 className="font-bold text-lg leading-tight truncate">{activity.title}</h4>
                  <p className="text-xs text-slate-500 font-serif italic truncate">{activity.section}</p>
                </div>
              </div>
              <div onClick={(e) => { e.stopPropagation(); setEditingActivity(activity); }} className="shrink-0 ml-4">
                {renderJournalAction(activity, log)}
              </div>
            </div>
          );
        })}
        {sortedActivities.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-40">
             <CalendarIcon className="mx-auto" size={48} strokeWidth={1} />
             <p className="italic font-serif">Keine Aktivitäten vorhanden.</p>
          </div>
        )}
      </div>

      {editingActivity && (
        <ActivityDetailModal
          activity={editingActivity}
          log={dayLogs.find(l => l.activityId === editingActivity.id)}
          date={selectedDate}
          onClose={() => setEditingActivity(null)}
          onAddLog={onAddLog}
          onUpdateLog={onUpdateLog}
          onDeleteLog={onDeleteLog}
        />
      )}
    </div>
  );
};

export default JournalView;
