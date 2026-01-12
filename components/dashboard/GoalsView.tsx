
import React, { useState } from 'react';
import { Activity, Goal } from '../../types';
import { Plus, Target, ChevronRight, Edit2, Trash2, X, Check, Link as LinkIcon, Search } from 'lucide-react';

interface GoalsViewProps {
  goals: Goal[];
  activities: Activity[];
  onAddGoal: (goal: Goal) => void;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateActivity: (activity: Activity) => void;
}

const GoalsView: React.FC<GoalsViewProps> = ({ goals, activities, onAddGoal, onUpdateGoal, onDeleteGoal, onUpdateActivity }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [assigningGoalId, setAssigningGoalId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎯');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    if (!newTitle) return;
    onAddGoal({
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      emoji: newEmoji,
      description: ''
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const handleUpdate = () => {
    if (!editingGoal || !newTitle) return;
    onUpdateGoal({
      ...editingGoal,
      title: newTitle,
      emoji: newEmoji
    });
    setEditingGoal(null);
    setNewTitle('');
  };

  const openAdd = () => {
    setEditingGoal(null);
    setNewTitle('');
    setNewEmoji('🎯');
    setIsAdding(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setNewTitle(goal.title);
    setNewEmoji(goal.emoji);
    setIsAdding(false);
  };

  const toggleActivityAssociation = (activity: Activity, goalId: string) => {
    const isAssociated = activity.goalId === goalId;
    onUpdateActivity({
      ...activity,
      goalId: isAssociated ? undefined : goalId
    });
  };

  const filteredActivitiesForAssignment = activities.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-bold">Deine Ziele</h2>
         <button 
           onClick={openAdd}
           className="glass p-3 rounded-2xl hover:bg-white/10 transition-all text-indigo-400 border border-white/10"
         >
           <Plus size={24} />
         </button>
      </div>

      {(isAdding || editingGoal) && (
        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-2 border-indigo-500/30 animate-in zoom-in-95 shadow-2xl">
          <div className="flex gap-4">
             <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} className="w-20 h-20 glass rounded-2xl text-center text-4xl outline-none border border-white/10" />
             <div className="flex-1 space-y-2">
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ziel-Name..." className="w-full glass px-6 py-4 rounded-2xl text-xl font-bold outline-none focus:ring-2 ring-indigo-500 border border-white/10" />
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black px-2">Was willst du erreichen?</p>
             </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => { setIsAdding(false); setEditingGoal(null); }} className="flex-1 py-4 glass rounded-2xl font-bold text-slate-400 hover:bg-white/5 transition-colors">Abbrechen</button>
            <button onClick={editingGoal ? handleUpdate : handleAdd} className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all">
                {editingGoal ? 'Aktualisieren' : 'Ziel erstellen'}
            </button>
          </div>
        </div>
      )}

      {/* Activity Assignment Modal */}
      {assigningGoalId && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setAssigningGoalId(null)}></div>
          <div className="relative w-full max-w-lg glass rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[80vh] flex flex-col border border-white/10 shadow-2xl">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-white/5">
              <div>
                <h3 className="text-xl font-bold">Aktivitäten zuordnen</h3>
                <p className="text-xs text-slate-500 mt-1">Wähle Aktivitäten für "{goals.find(g => g.id === assigningGoalId)?.title}"</p>
              </div>
              <button onClick={() => setAssigningGoalId(null)} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 pb-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Suchen..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {filteredActivitiesForAssignment.map(activity => {
                const isSelected = activity.goalId === assigningGoalId;
                const isTaken = activity.goalId && activity.goalId !== assigningGoalId;
                const otherGoal = isTaken ? goals.find(g => g.id === activity.goalId) : null;

                return (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivityAssociation(activity, assigningGoalId)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      isSelected ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-white/5 border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span className="text-2xl">{activity.emoji}</span>
                      <div>
                        <div className="font-semibold text-sm">{activity.title}</div>
                        {isTaken && (
                          <div className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                            Bereits in: {otherGoal?.title || 'Anderes Ziel'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                      isSelected ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
              {filteredActivitiesForAssignment.length === 0 && (
                <div className="py-10 text-center text-slate-500 italic text-sm">Keine Aktivitäten gefunden.</div>
              )}
            </div>

            <div className="p-8 bg-gradient-to-t from-black/50 to-transparent">
              <button 
                onClick={() => setAssigningGoalId(null)}
                className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold shadow-lg hover:bg-indigo-600 transition-all"
              >
                Fertig
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => {
          const goalActivities = activities.filter(a => a.goalId === goal.id);
          return (
            <div key={goal.id} className="glass p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group hover:border-white/20 transition-all border border-white/10">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-3xl glass flex items-center justify-center text-4xl group-hover:scale-110 transition-transform shadow-lg">
                      {goal.emoji}
                   </div>
                   <div>
                      <h3 className="text-2xl font-bold leading-tight">{goal.title}</h3>
                      <p className="text-slate-400 font-serif italic text-sm">{goalActivities.length} verknüpfte Aktivitäten</p>
                   </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(goal)} className="p-2 glass rounded-full hover:bg-white/10 text-slate-400 hover:text-white" title="Ziel bearbeiten">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDeleteGoal(goal.id)} className="p-2 glass rounded-full hover:bg-red-500/10 text-slate-400 hover:text-red-400" title="Ziel löschen">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 relative z-10">
                 <div className="flex items-center justify-between mb-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Aktivitäten</label>
                   <button 
                     onClick={() => setAssigningGoalId(goal.id)}
                     className="p-1.5 glass rounded-lg hover:text-indigo-400 transition-all border border-white/5"
                     title="Aktivitäten hinzufügen"
                   >
                     <Plus size={14} />
                   </button>
                 </div>
                 
                 {goalActivities.map(a => (
                   <div key={a.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors border border-white/5">
                      <div className="flex items-center gap-3">
                         <span className="text-lg">{a.emoji}</span>
                         <span className="font-semibold">{a.title}</span>
                      </div>
                      <button 
                        onClick={() => toggleActivityAssociation(a, goal.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors p-1"
                        title="Verknüpfung lösen"
                      >
                        <X size={14} />
                      </button>
                   </div>
                 ))}
                 {goalActivities.length === 0 && <p className="text-xs text-slate-600 italic px-2 py-2">Noch keine Aktivitäten verknüpft.</p>}
              </div>

              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/5 blur-[40px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>
            </div>
          );
        })}
        
        {goals.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 opacity-40">
             <Target className="mx-auto" size={64} strokeWidth={1} />
             <p className="italic font-serif text-xl">Setze dir dein erstes Ziel...</p>
             <button onClick={openAdd} className="text-indigo-400 font-bold uppercase tracking-widest text-xs hover:underline">Ziel hinzufügen</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsView;
