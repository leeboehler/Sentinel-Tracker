
import React, { useState } from 'react';
import { Activity, ActivityLog, ProtocolItem } from '../../types';
import { X, Clock, Plus, Minus, Check, Trash2, AlertTriangle } from 'lucide-react';

interface ActivityDetailModalProps {
  activity: Activity;
  log: ActivityLog | undefined;
  date: string;
  onClose: () => void;
  onAddLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onUpdateLog: (id: string, value: any) => void;
  onDeleteLog: (id: string) => void;
  onDeleteActivity?: (id: string) => void; // Optionaler Callback zum Löschen der Aktivität
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({ 
  activity, log, date, onClose, onAddLog, onUpdateLog, onDeleteLog, onDeleteActivity 
}) => {
  const [temporalH, setTemporalH] = useState(() => log && activity.type === 'zeit' ? Math.floor(log.value / 60) : 0);
  const [temporalM, setTemporalM] = useState(() => log && activity.type === 'zeit' ? log.value % 60 : 0);
  const [numericVal, setNumericVal] = useState(() => log && activity.type === 'zahlen' ? log.value : 0);
  const [dataVal, setDataVal] = useState(() => log && activity.type === 'daten' ? log.value : '');
  const [selectionVal, setSelectionVal] = useState<string[]>(() => log && activity.type === 'auswahl' ? log.value : []);
  const [protocolItems, setProtocolItems] = useState<ProtocolItem[]>(() => {
    if (log && activity.type === 'protokoll') return log.value;
    return activity.protocolItems || [];
  });
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    let finalValue: any;
    if (activity.type === 'zeit') finalValue = (temporalH * 60) + temporalM;
    else if (activity.type === 'zahlen') finalValue = numericVal;
    else if (activity.type === 'daten') finalValue = dataVal;
    else if (activity.type === 'auswahl') finalValue = selectionVal;
    else if (activity.type === 'protokoll') finalValue = protocolItems;
    else if (activity.type === 'binär') finalValue = true;

    if (log) onUpdateLog(log.id, finalValue);
    else onAddLog({ activityId: activity.id, date, value: finalValue });
    onClose();
  };

  const handleDeleteActivity = () => {
    if (onDeleteActivity) {
      onDeleteActivity(activity.id);
      onClose();
    }
  };

  const toggleSelection = (optId: string) => {
    if (activity.isMultiSelect) {
      setSelectionVal(prev => prev.includes(optId) ? prev.filter(i => i !== optId) : [...prev, optId]);
    } else {
      setSelectionVal([optId]);
    }
  };

  const toggleProtocol = (id: string) => {
    setProtocolItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const renderInputs = () => {
    switch (activity.type) {
      case 'zeit':
        return (
          <div className="flex items-center gap-4 justify-center py-6">
            <div className="text-center">
              <input type="number" inputMode="numeric" value={temporalH} onChange={(e) => setTemporalH(parseInt(e.target.value) || 0)} className="w-16 h-16 text-3xl font-bold bg-white/5 rounded-2xl text-center outline-none focus:ring-2 ring-indigo-500" />
              <div className="text-xs text-slate-500 mt-2 uppercase font-bold">Std</div>
            </div>
            <div className="text-3xl font-bold opacity-30">:</div>
            <div className="text-center">
              <input type="number" inputMode="numeric" value={temporalM} onChange={(e) => setTemporalM(parseInt(e.target.value) || 0)} className="w-16 h-16 text-3xl font-bold bg-white/5 rounded-2xl text-center outline-none focus:ring-2 ring-indigo-500" />
              <div className="text-xs text-slate-500 mt-2 uppercase font-bold">Min</div>
            </div>
          </div>
        );
      case 'zahlen':
        return (
          <div className="flex items-center gap-8 justify-center py-6">
            <button onClick={() => setNumericVal(v => Math.max(0, v - 1))} className="w-12 h-12 glass rounded-xl flex items-center justify-center border border-white/10"><Minus /></button>
            <div className="text-5xl font-bold">{numericVal}</div>
            <button onClick={() => setNumericVal(v => v + 1)} className="w-12 h-12 glass rounded-xl flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"><Plus /></button>
          </div>
        );
      case 'auswahl':
        return (
          <div className="grid grid-cols-1 gap-2 py-4 max-h-60 overflow-y-auto pr-2">
            {activity.options?.map(opt => (
              <button
                key={opt.id}
                onClick={() => toggleSelection(opt.id)}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  selectionVal.includes(opt.id) ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <span className="font-medium">{opt.label}</span>
                {selectionVal.includes(opt.id) && <Check size={18} />}
              </button>
            ))}
          </div>
        );
      case 'daten':
        return (
          <div className="py-4">
            <div className="relative">
              <input 
                type={activity.isNumberData ? 'number' : 'text'} 
                inputMode={activity.isNumberData ? 'decimal' : 'text'}
                autoFocus={true}
                value={dataVal}
                onChange={(e) => setDataVal(e.target.value)}
                placeholder={activity.isNumberData ? '0.00' : 'Text eingeben...'}
                className="w-full p-5 bg-white/5 rounded-2xl border border-white/10 outline-none focus:border-indigo-500 text-xl font-medium shadow-inner"
              />
              {activity.unit && <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold tracking-widest">{activity.unit}</div>}
            </div>
          </div>
        );
      case 'protokoll':
        return (
          <div className="space-y-2 py-4 max-h-64 overflow-y-auto pr-2">
            {protocolItems.map(item => (
              <button
                key={item.id}
                onClick={() => toggleProtocol(item.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  item.completed ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${item.completed ? 'bg-indigo-500 border-indigo-500 shadow-indigo-500/30 shadow-lg' : 'border-slate-700'}`}>
                  {item.completed && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <span className={`text-base font-medium ${item.completed ? 'line-through opacity-50' : ''}`}>{item.label}</span>
              </button>
            ))}
          </div>
        );
      case 'binär':
        return (
          <div className="py-12 flex items-center justify-center">
             <div className="text-center">
               <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${log ? 'bg-indigo-500 text-white shadow-2xl' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                 <Check size={48} strokeWidth={3} />
               </div>
               <p className="text-slate-400 font-medium">Diese Aktivität als erledigt markieren.</p>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-lg glass rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-8 duration-300 border border-white/10 shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-5">
              <div className="text-5xl drop-shadow-lg">{activity.emoji}</div>
              <div>
                <h3 className="text-2xl font-bold leading-tight">{activity.title}</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{activity.category || 'Allgemein'} • {new Date(date).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 glass rounded-full hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="border-t border-white/5 pt-6">
            {activity.description && <p className="text-slate-400 mb-6 italic opacity-80 text-sm leading-relaxed">{activity.description}</p>}
            {renderInputs()}
          </div>

          {showDeleteConfirm ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 text-red-400 mb-4">
                <AlertTriangle size={20} />
                <p className="text-sm font-bold">Gesamte Aktivität wirklich löschen?</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 glass rounded-xl text-xs font-bold uppercase"
                >
                  Abbrechen
                </button>
                <button 
                  onClick={handleDeleteActivity}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl text-xs font-bold uppercase"
                >
                  Ja, löschen
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4">
                {log && (
                  <button 
                    onClick={() => { onDeleteLog(log.id); onClose(); }}
                    className="flex-1 py-5 px-6 rounded-2xl glass text-red-400 font-bold hover:bg-red-500/10 transition-colors text-sm"
                  >
                    Eintrag löschen
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  className="flex-[2] py-5 px-6 rounded-2xl bg-indigo-500 text-white font-black hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 text-sm"
                >
                  Speichern
                </button>
              </div>
              
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-3 text-slate-600 hover:text-red-400 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <Trash2 size={12} />
                Gesamte Aktivität entfernen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailModal;
