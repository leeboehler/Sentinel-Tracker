
import React, { useState, useEffect, useRef } from 'react';
import { Activity, ActivityLog, Section } from '../../types';
import { Check, Clock, Plus, Minus, ChevronRight, Play, Square, GripVertical, Settings2, ListChecks, ChevronDown, ChevronUp, FolderPlus, X, Trash2 } from 'lucide-react';
import ActivityDetailModal from '../Modals/ActivityDetailModal';

interface TodayViewProps {
  activities: Activity[];
  logs: ActivityLog[];
  sections: Section[];
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onUpdateLog: (id: string, value: any) => void;
  onDeleteLog: (id: string) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateActivity: (activity: Activity) => void;
  onUpdateActivities: (activities: Activity[]) => void;
  onAddSection: (name: string) => void;
  onDeleteSection: (id: string) => void;
  onUpdateSections: (sections: Section[]) => void;
}

const TodayView: React.FC<TodayViewProps> = ({ 
  activities, logs, sections, onAddLog, onUpdateLog, onDeleteLog, onDeleteActivity, onUpdateActivity, onUpdateActivities, onAddSection, onDeleteSection, onUpdateSections 
}) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  
  const intervalRefs = useRef<Record<string, any>>({});
  
  const today = new Date().toISOString().split('T')[0];
  const formattedDate = new Date().toLocaleDateString('de-DE', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long' 
  });
  
  const sortedActivities = [...activities].sort((a, b) => a.orderIndex - b.orderIndex);
  const scheduledLogs = logs.filter(l => l.date === today);

  const getLogForActivity = (activityId: string) => scheduledLogs.find(l => l.activityId === activityId);

  const activitySectionNames = Array.from(new Set(sortedActivities.map(a => a.section)));
  const persistentSectionNames = sections.map(s => s.name);
  const allSectionNames = Array.from(new Set([...persistentSectionNames, ...activitySectionNames]));

  const displaySections = allSectionNames.map(name => {
    const persistent = sections.find(s => s.name === name);
    return {
      id: persistent?.id || `temp-${name}`,
      name: name,
      orderIndex: persistent?.orderIndex ?? 999,
      isPersistent: !!persistent
    };
  }).sort((a, b) => a.orderIndex - b.orderIndex);

  const toggleBinary = (activity: Activity) => {
    const existing = getLogForActivity(activity.id);
    if (existing) {
      onDeleteLog(existing.id);
    } else {
      onAddLog({ activityId: activity.id, date: today, value: true });
    }
  };

  const updateNumeric = (activity: Activity, delta: number) => {
    const existing = getLogForActivity(activity.id);
    const current = existing ? (existing.value as number) : 0;
    const newVal = Math.max(0, current + delta);
    if (existing) onUpdateLog(existing.id, newVal);
    else onAddLog({ activityId: activity.id, date: today, value: newVal });
  };

  const handleTimerToggle = (activity: Activity) => {
    if (activeTimers[activity.id]) {
      clearInterval(intervalRefs.current[activity.id]);
      const elapsedMinutes = Math.floor(activeTimers[activity.id] / 60);
      const existing = getLogForActivity(activity.id);
      if (existing) {
        onUpdateLog(existing.id, (existing.value as number) + elapsedMinutes);
      } else {
        onAddLog({ activityId: activity.id, date: today, value: elapsedMinutes });
      }
      const newTimers = { ...activeTimers };
      delete newTimers[activity.id];
      setActiveTimers(newTimers);
    } else {
      setActiveTimers(prev => ({ ...prev, [activity.id]: 1 }));
      intervalRefs.current[activity.id] = setInterval(() => {
        setActiveTimers(prev => ({ ...prev, [activity.id]: (prev[activity.id] || 0) + 1 }));
      }, 1000);
    }
  };

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const addNewSection = () => {
    if (!newSectionName.trim()) return;
    onAddSection(newSectionName);
    setIsAddingSection(false);
    setNewSectionName('');
  };

  const renderActivityAction = (activity: Activity) => {
    const log = getLogForActivity(activity.id);
    
    switch (activity.type) {
      case 'binär':
        return (
          <button 
            onClick={() => toggleBinary(activity)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              log ? 'bg-indigo-500 text-white shadow-lg' : 'bg-white/5 border border-slate-700 text-slate-500 hover:bg-white/10'
            }`}
          >
            {log ? <Check size={24} /> : null}
          </button>
        );
      case 'zahlen':
        return (
          <div className="flex items-center gap-3">
            <button onClick={() => updateNumeric(activity, -1)} className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Minus size={16} /></button>
            <span className="text-xl font-bold min-w-[2ch] text-center">{log ? log.value : 0}</span>
            <button onClick={() => updateNumeric(activity, 1)} className="p-2 bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 rounded-lg"><Plus size={16} /></button>
          </div>
        );
      case 'zeit':
        const minutes = (log ? (log.value as number) : 0) + (activeTimers[activity.id] ? Math.floor(activeTimers[activity.id] / 60) : 0);
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        const isRunning = !!activeTimers[activity.id];
        return (
          <div className="flex items-center gap-3">
             <div className="text-right">
                <div className={`text-sm font-bold ${isRunning ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`}>
                  {h}h {m}m
                </div>
             </div>
             <button 
               onClick={() => handleTimerToggle(activity)}
               className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRunning ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}
             >
               {isRunning ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
             </button>
          </div>
        );
      case 'daten':
      case 'auswahl':
      case 'protokoll':
        let label = '';
        let isSuccess = false;
        
        if (log) {
          if (activity.type === 'daten') {
            label = `${log.value} ${activity.unit || ''}`;
            isSuccess = true;
          }
          else if (activity.type === 'auswahl') {
            const selections = Array.isArray(log.value) ? log.value : [log.value];
            const names = selections.map(sId => activity.options?.find(o => o.id === sId)?.label).filter(Boolean);
            label = names.length > 0 ? names.join(', ') : 'Keine';
            isSuccess = names.length > 0;
          }
          else if (activity.type === 'protokoll') {
            const done = (log.value as any[]).filter(i => i.completed).length;
            const total = (log.value as any[]).length;
            label = `${done}/${total}`;
            isSuccess = (done === total && total > 0);
          }
        }

        const colorClass = log 
          ? (isSuccess 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_-2px_rgba(52,211,153,0.1)]' 
              : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_10px_-2px_rgba(99,102,241,0.1)]')
          : 'bg-white/5 border-slate-700 text-slate-500';

        return (
          <button 
            onClick={() => setSelectedActivity(activity)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all max-w-[240px] ${colorClass}`}
          >
            {label && <span className="text-[10px] font-black uppercase tracking-widest truncate">{label}</span>}
            <ChevronRight size={14} className="shrink-0" />
          </button>
        );
      default:
        return null;
    }
  };

  const trackedCount = scheduledLogs.length;
  const totalCount = sortedActivities.length;
  const progress = totalCount > 0 ? (trackedCount / totalCount) * 100 : 0;

  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [draggedSectionId, setDraggedSectionId] = useState<string | null>(null);

  const handleActivityDragStart = (e: React.DragEvent, id: string) => {
    setDraggedActivityId(id);
    setDraggedSectionId(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSectionDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSectionId(id);
    setDraggedActivityId(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleActivityDrop = (e: React.DragEvent, targetId: string, targetSectionName: string) => {
    e.preventDefault();
    if (!draggedActivityId) return;
    
    const draggedActivity = activities.find(a => a.id === draggedActivityId);
    if (!draggedActivity) return;
    
    const newActivities = [...activities];
    const dragIdx = newActivities.findIndex(a => a.id === draggedActivityId);
    const targetIdx = newActivities.findIndex(a => a.id === targetId);
    
    if (dragIdx === -1 || targetIdx === -1) {
      setDraggedActivityId(null);
      return;
    }
    
    // Wenn die Aktivität in einen anderen Abschnitt verschoben wird
    if (draggedActivity.section !== targetSectionName) {
      const updatedActivity = { ...draggedActivity, section: targetSectionName };
      onUpdateActivity(updatedActivity);
      setDraggedActivityId(null);
      return;
    }
    
    // Wenn die Aktivität innerhalb des gleichen Abschnitts verschoben wird (Reihenfolge ändern)
    if (draggedActivityId !== targetId && newActivities[dragIdx].section === newActivities[targetIdx].section) {
      const [removed] = newActivities.splice(dragIdx, 1);
      newActivities.splice(targetIdx, 0, removed);
      
      // Aktualisiere orderIndex für alle Aktivitäten im Abschnitt
      const sectionName = newActivities[targetIdx].section;
      const sectionActivities = newActivities
        .filter(a => a.section === sectionName)
        .map((activity, index) => ({ ...activity, orderIndex: index }));
      
      // Aktualisiere alle Aktivitäten im Abschnitt in der Datenbank
      sectionActivities.forEach(activity => {
        onUpdateActivity(activity);
      });
    }
    
    setDraggedActivityId(null);
  };

  const handleSectionDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    if (draggedActivityId) {
      const targetSec = displaySections.find(s => s.id === targetSectionId);
      if (!targetSec) return;
      const activity = activities.find(a => a.id === draggedActivityId);
      if (activity && activity.section !== targetSec.name) {
        // Aktualisiere die Aktivität permanent in der Datenbank
        const updatedActivity = { ...activity, section: targetSec.name };
        onUpdateActivity(updatedActivity);
      }
      setDraggedActivityId(null);
    } 
    else if (draggedSectionId && draggedSectionId !== targetSectionId) {
      const newSections = [...sections];
      const dragIdx = newSections.findIndex(s => s.id === draggedSectionId);
      const targetIdx = newSections.findIndex(s => s.id === targetSectionId);
      if (dragIdx > -1 && targetIdx > -1) {
        const [removed] = newSections.splice(dragIdx, 1);
        newSections.splice(targetIdx, 0, removed);
        onUpdateSections(newSections.map((s, i) => ({ ...s, orderIndex: i })));
      }
      setDraggedSectionId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="glass rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative border border-white/10 overflow-visible text-slate-200">
        <div className="relative z-10 text-center md:text-left">
           <h2 className="text-2xl font-bold mb-1">{formattedDate}</h2>
           <p className="text-slate-400 font-serif italic">Du hast {trackedCount} von {totalCount} Aktivitäten erledigt.</p>
        </div>
        
        <div className="relative w-36 h-36 flex items-center justify-center p-2">
            <svg viewBox="0 0 144 144" className="w-full h-full transform -rotate-90 overflow-visible">
                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800/20" />
                <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="10" fill="transparent" 
                        strokeDasharray={402.1} strokeDashoffset={402.1 - (402.1 * progress / 100)}
                        strokeLinecap="round"
                        className="text-indigo-500 transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold tracking-tight">{Math.round(progress)}%</span>
            </div>
        </div>
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-[60px]"></div>
      </div>

      {displaySections.map(section => {
        const sectionActivities = sortedActivities.filter(a => a.section === section.name);
        const isCollapsed = collapsedSections[section.id];

        return (
          <div 
            key={section.id} 
            className="space-y-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleSectionDrop(e, section.id)}
          >
            <div className="flex items-center justify-between px-2 group">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSectionCollapse(section.id)}
              >
                {isCollapsed ? <ChevronRight size={16} className="text-indigo-400" /> : <ChevronDown size={16} className="text-indigo-400" />}
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">{section.name}</h3>
                {sectionActivities.length === 0 && <span className="text-[10px] text-slate-700 font-bold uppercase">(Leer)</span>}
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => onDeleteSection(section.id)}
                  className="p-1 hover:text-red-400 transition-colors"
                  title="Abschnitt löschen"
                >
                  <Trash2 size={14} />
                </button>
                <div 
                  className="cursor-grab active:cursor-grabbing p-1"
                  draggable
                  onDragStart={(e) => handleSectionDragStart(e, section.id)}
                >
                  <GripVertical size={14} className="text-slate-600" />
                </div>
              </div>
            </div>
            
            {!isCollapsed && (
              <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {sectionActivities.map(activity => (
                  <div 
                    key={activity.id}
                    draggable
                    onDragStart={(e) => handleActivityDragStart(e, activity.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleActivityDrop(e, activity.id, section.name)}
                    onClick={() => setSelectedActivity(activity)}
                    className={`group relative flex items-center justify-between p-5 rounded-[1.5rem] transition-all cursor-pointer ${
                      getLogForActivity(activity.id) ? 'bg-indigo-500/5 border border-indigo-500/20' : 'bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {activity.emoji}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-lg leading-tight truncate">{activity.title}</h4>
                        {activity.description && <p className="text-sm text-slate-500 line-clamp-1 italic font-serif opacity-70">{activity.description}</p>}
                      </div>
                    </div>
                    <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                      {renderActivityAction(activity)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="pt-4 flex justify-center">
        {isAddingSection ? (
          <div className="glass p-4 rounded-2xl flex items-center gap-2 animate-in zoom-in-95">
            <input 
              autoFocus
              type="text" 
              value={newSectionName} 
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="Name..."
              className="bg-transparent outline-none text-sm font-bold uppercase tracking-widest border-b border-indigo-500 w-40 text-slate-200"
              onKeyDown={(e) => e.key === 'Enter' && addNewSection()}
            />
            <button onClick={addNewSection} className="p-2 text-indigo-400 hover:text-white"><Check size={18}/></button>
            <button onClick={() => setIsAddingSection(false)} className="p-2 text-red-400 hover:text-white"><X size={18}/></button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingSection(true)}
            className="flex items-center gap-2 px-6 py-3 glass rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all"
          >
            <FolderPlus size={16} />
            Abschnitt hinzufügen
          </button>
        )}
      </div>

      {selectedActivity && (
        <ActivityDetailModal 
          activity={selectedActivity} 
          log={getLogForActivity(selectedActivity.id)}
          date={today}
          onClose={() => setSelectedActivity(null)}
          onAddLog={onAddLog}
          onUpdateLog={onUpdateLog}
          onDeleteLog={onDeleteLog}
          onDeleteActivity={onDeleteActivity}
        />
      )}
    </div>
  );
};

export default TodayView;
