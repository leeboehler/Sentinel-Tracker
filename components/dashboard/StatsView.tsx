
import React, { useState } from 'react';
import { Activity, ActivityLog } from '../../types';
import { Check, ChevronLeft, ChevronRight, ListChecks } from 'lucide-react';
import ActivityDetailModal from '../Modals/ActivityDetailModal';

interface StatsViewProps {
  activities: Activity[];
  logs: ActivityLog[];
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onUpdateLog: (id: string, value: any) => void;
  onDeleteLog: (id: string) => void;
}

const StatsView: React.FC<StatsViewProps> = ({ activities, logs, onAddLog, onUpdateLog, onDeleteLog }) => {
  const [editingCell, setEditingCell] = useState<{ activity: Activity, date: string } | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  
  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date();
  
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    // Find Monday of the current/offset week
    const diff = today.getDay() === 0 ? 6 : today.getDay() - 1;
    d.setDate(today.getDate() - diff + (weekOffset * 7) + i);
    return d.toISOString().split('T')[0];
  });

  const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const sortedActivities = [...activities].sort((a, b) => a.orderIndex - b.orderIndex);

  const renderCellContent = (activity: Activity, log: ActivityLog | undefined) => {
    if (!log) return <div className="w-1.5 h-1.5 rounded-full bg-slate-700 opacity-20"></div>;

    // Fix: Updated comparison to match ActivityType union
    if (activity.type === 'binär') return <Check size={18} strokeWidth={3} className="text-indigo-400" />;
    
    // Fix: Updated comparison to match ActivityType union
    if (activity.type === 'zeit') {
      return (
        <div className="flex flex-col text-[10px] font-black leading-none uppercase">
          <span>{Math.floor(log.value / 60)}h</span>
          <span className="opacity-60">{log.value % 60}m</span>
        </div>
      );
    }
    
    // Fix: Updated comparisons to match ActivityType union
    if (activity.type === 'zahlen' || activity.type === 'daten') {
      return <span className="text-[11px] font-black">{log.value}</span>;
    }

    // Fix: Updated comparison to match ActivityType union
    if (activity.type === 'auswahl') {
      const selections = Array.isArray(log.value) ? log.value : [log.value];
      return (
        <div className="flex flex-col gap-0.5 items-center max-w-[50px]">
          {selections.slice(0, 2).map((sId: string) => {
            const opt = activity.options?.find(o => o.id === sId);
            return <div key={sId} className="text-[8px] truncate w-full text-indigo-400 font-bold uppercase">{opt?.label || '...'}</div>;
          })}
          {selections.length > 2 && <div className="text-[7px] text-slate-500">+{selections.length - 2}</div>}
        </div>
      );
    }

    // Fix: Updated comparison to match ActivityType union
    if (activity.type === 'protokoll') {
      const items = (log.value as any[]);
      const completedItems = items.filter(i => i.completed);
      return (
        <div className="flex flex-col gap-0.5 items-center">
          <div className="text-[10px] font-black text-emerald-400">{completedItems.length}/{items.length}</div>
          <div className="flex flex-wrap gap-0.5 justify-center max-w-[40px]">
            {items.map((item, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full ${item.completed ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
            ))}
          </div>
        </div>
      );
    }

    return <Check size={16} />;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between glass px-6 py-4 rounded-[2rem] border border-white/10">
        <button onClick={() => setWeekOffset(v => v - 1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft /></button>
        <div className="text-center">
           <h2 className="text-sm font-black uppercase tracking-[0.2em]">Woche vom {new Date(weekDays[0]).toLocaleDateString()}</h2>
           {weekOffset === 0 && <p className="text-[10px] text-indigo-400 font-bold uppercase mt-1">Aktuell</p>}
        </div>
        <button onClick={() => setWeekOffset(v => v + 1)} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight /></button>
      </div>

      <div className="glass rounded-[2rem] overflow-hidden border border-white/10">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6 text-left font-bold text-slate-500 uppercase tracking-widest text-xs min-w-[180px]">Aktivität</th>
                {dayNames.map((name, i) => (
                  <th key={name} className="p-4 text-center">
                    <div className="text-xs font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{name}</div>
                    <div className={`text-sm ${weekDays[i] === todayStr ? 'text-indigo-400 font-bold underline decoration-2 underline-offset-4' : 'opacity-60'}`}>
                      {new Date(weekDays[i]).getDate()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedActivities.map(activity => (
                <tr key={activity.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl drop-shadow-md">{activity.emoji}</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm leading-tight">{activity.title}</span>
                        <span className="text-[10px] uppercase text-slate-600 tracking-wider font-bold">{activity.section}</span>
                      </div>
                    </div>
                  </td>
                  {weekDays.map(date => {
                    const log = logs.find(l => l.activityId === activity.id && l.date === date);
                    return (
                      <td 
                        key={date} 
                        className="p-2 text-center"
                        onClick={() => setEditingCell({ activity, date })}
                      >
                        <div className={`mx-auto min-w-[40px] min-h-[40px] p-1 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${
                          log ? 'bg-indigo-500/10 border-indigo-500/20 shadow-inner' : 'bg-transparent border-transparent hover:bg-white/5'
                        }`}>
                          {renderCellContent(activity, log)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingCell && (
        <ActivityDetailModal
          activity={editingCell.activity}
          log={logs.find(l => l.activityId === editingCell.activity.id && l.date === editingCell.date)}
          date={editingCell.date}
          onClose={() => setEditingCell(null)}
          onAddLog={onAddLog}
          onUpdateLog={onUpdateLog}
          onDeleteLog={onDeleteLog}
        />
      )}
    </div>
  );
};

export default StatsView;
