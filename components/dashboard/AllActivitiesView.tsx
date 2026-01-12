
import React, { useState } from 'react';
import { Activity, Category, TabType } from '../../types';
import { Plus, Edit2, Trash2, Search, Settings, GripVertical, Check, X, FolderPlus, AlertCircle } from 'lucide-react';
import NewActivityModal from '../Modals/NewActivityModal';

interface AllActivitiesViewProps {
  activities: Activity[];
  categories: Category[];
  onAddActivity: (activity: Activity) => void;
  onUpdateActivity: (activity: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onAddCategory: (name: string) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateActivities: (activities: Activity[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  setActiveTab: (tab: TabType) => void;
}

const AllActivitiesView: React.FC<AllActivitiesViewProps> = ({ 
  activities, categories, onAddActivity, onUpdateActivity, onDeleteActivity, onAddCategory, onUpdateCategory, onDeleteCategory, onUpdateActivities, onUpdateCategories, setActiveTab
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State für Inline-Löschbestätigung
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredActivities = activities.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCategories = [...categories].sort((a, b) => a.orderIndex - b.orderIndex);

  const uncategorizedActivities = filteredActivities.filter(a => 
    !categories.some(c => c.name === a.category)
  );

  const [draggedActivityId, setDraggedActivityId] = useState<string | null>(null);
  const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null);

  const handleActivityDragStart = (e: React.DragEvent, id: string) => {
    // Wenn wir gerade im Lösch-Modus sind, Drag verhindern
    if (deletingId) {
      e.preventDefault();
      return;
    }
    setDraggedActivityId(id);
    setDraggedCategoryId(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCategoryId(id);
    setDraggedActivityId(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleActivityDrop = (e: React.DragEvent, targetId: string, targetCategoryName: string) => {
    e.preventDefault();
    if (!draggedActivityId || draggedActivityId === targetId) return;
    const newActivities = [...activities];
    const dragIdx = newActivities.findIndex(a => a.id === draggedActivityId);
    const targetIdx = newActivities.findIndex(a => a.id === targetId);
    const [removed] = newActivities.splice(dragIdx, 1);
    removed.category = targetCategoryName;
    newActivities.splice(targetIdx, 0, removed);
    onUpdateActivities(newActivities.map((a, i) => ({ ...a, orderIndex: i })));
    setDraggedActivityId(null);
  };

  const handleCategoryDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault();
    if (draggedActivityId) {
      const targetCat = categories.find(c => c.id === targetCategoryId);
      const newActivities = [...activities];
      const activity = newActivities.find(a => a.id === draggedActivityId);
      if (activity) {
        activity.category = targetCat ? targetCat.name : 'Unkategorisiert';
        onUpdateActivities(newActivities.map((a, i) => ({ ...a, orderIndex: i })));
      }
      setDraggedActivityId(null);
    } 
    else if (draggedCategoryId && draggedCategoryId !== targetCategoryId) {
      const newCategories = [...categories];
      const dragIdx = newCategories.findIndex(c => c.id === draggedCategoryId);
      const targetIdx = newCategories.findIndex(c => c.id === targetCategoryId);
      if (dragIdx > -1 && targetIdx > -1) {
        const [removed] = newCategories.splice(dragIdx, 1);
        newCategories.splice(targetIdx, 0, removed);
        onUpdateCategories(newCategories.map((c, i) => ({ ...c, orderIndex: i })));
      }
      setDraggedCategoryId(null);
    }
  };

  const handleSaveCategory = () => {
    if (editingCategory) {
      onUpdateCategory({ ...editingCategory, name: newCategoryName });
      setEditingCategory(null);
    } else {
      onAddCategory(newCategoryName);
    }
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setNewCategoryName(cat.name);
    setIsAddingCategory(true);
  };

  const handleDeleteClick = (e: React.MouseEvent | React.PointerEvent, id: string) => {
    // Ganz wichtig: Propagation auf allen Ebenen stoppen, damit Drag&Drop oder der Karten-Klick nicht stören
    e.stopPropagation();
    e.preventDefault();

    if (deletingId === id) {
      // Zweiter Klick: Löschen ausführen
      onDeleteActivity(id);
      setDeletingId(null);
    } else {
      // Erster Klick: In Lösch-Modus wechseln
      setDeletingId(id);
      // Nach 3 Sekunden zurücksetzen, wenn nicht bestätigt wurde
      setTimeout(() => setDeletingId(prev => prev === id ? null : prev), 3000);
    }
  };

  const renderActivityList = (activityArray: Activity[], categoryName: string) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {activityArray.map(activity => {
        const isConfirming = deletingId === activity.id;
        
        return (
          <div 
            key={activity.id} 
            draggable={!isConfirming}
            onDragStart={(e) => handleActivityDragStart(e, activity.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleActivityDrop(e, activity.id, categoryName)}
            className={`glass p-5 rounded-[1.5rem] flex items-center justify-between transition-all cursor-pointer group relative overflow-hidden ${
              isConfirming ? 'border-red-500/50 bg-red-500/5' : 'hover:border-white/20 active:bg-white/5'
            }`}
            onClick={() => { 
              if (!isConfirming) {
                setEditingActivity(activity); 
                setIsModalOpen(true); 
              }
            }}
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className={`text-3xl w-12 h-12 flex items-center justify-center glass rounded-xl shrink-0 transition-transform ${isConfirming ? 'scale-90 opacity-50' : ''}`}>
                {activity.emoji}
              </div>
              <div className="min-w-0">
                <h4 className={`font-semibold truncate transition-colors ${isConfirming ? 'text-red-400' : 'text-slate-200'}`}>
                  {isConfirming ? 'Löschen?' : activity.title}
                </h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{activity.type}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 relative z-20">
              <button
                type="button"
                // Wir nutzen mehrere Event-Handler, um sicherzugehen, dass es überall greift
                onClick={(e) => handleDeleteClick(e, activity.id)}
                onPointerDown={(e) => e.stopPropagation()} 
                onMouseDown={(e) => e.stopPropagation()}
                className={`p-3 rounded-full transition-all flex items-center justify-center ${
                  isConfirming 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/40 animate-pulse' 
                    : 'text-slate-600 hover:text-red-400 bg-white/5 sm:bg-transparent'
                }`}
                title={isConfirming ? "Bestätigen zum Löschen" : "Aktivität löschen"}
              >
                {isConfirming ? <Check size={20} strokeWidth={3} /> : <Trash2 size={20} />}
              </button>
              
              {!isConfirming && (
                <div className="p-3 text-slate-600 hover:text-white transition-colors cursor-grab active:cursor-grabbing hidden sm:block">
                  <GripVertical size={18} />
                </div>
              )}
            </div>
            
            {isConfirming && (
               <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-in fade-in"></div>
            )}
          </div>
        );
      })}
      {activityArray.length === 0 && (
        <div className="col-span-full py-4 text-center text-slate-600 italic text-xs border border-dashed border-white/5 rounded-2xl">
          Keine Aktivitäten in dieser Kategorie.
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Aktivitäten suchen..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-slate-500 transition-all text-slate-200"
          />
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('settings')}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Settings size={24} />
          </button>
          <button 
            onClick={() => { setEditingActivity(null); setIsModalOpen(true); }}
            className="p-4 bg-slate-600 rounded-2xl text-white shadow-lg shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus />
          </button>
        </div>
      </div>

      <div className="space-y-10">
        {sortedCategories.map(category => {
          const categoryActivities = filteredActivities.filter(a => a.category === category.name);

          return (
            <div 
              key={category.id} 
              className="space-y-4"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleCategoryDrop(e, category.id)}
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2 group">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-200">{category.name}</h3>
                  <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                    {categoryActivities.length}
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEditCategory(category)} className="p-1 text-slate-500 hover:text-white"><Edit2 size={14}/></button>
                  <button onClick={() => onDeleteCategory(category.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 size={14}/></button>
                  <div 
                    className="cursor-grab active:cursor-grabbing p-1"
                    draggable
                    onDragStart={(e) => handleCategoryDragStart(e, category.id)}
                  >
                    <GripVertical size={14} className="text-slate-600" />
                  </div>
                </div>
              </div>
              {renderActivityList(categoryActivities, category.name)}
            </div>
          );
        })}

        {uncategorizedActivities.length > 0 && (
            <div 
                className="space-y-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleCategoryDrop(e, 'uncategorized')}
            >
                <div className="flex items-center justify-between border-b border-white/5 pb-2 group">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-slate-400">Unkategorisiert</h3>
                        <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-md">
                            {uncategorizedActivities.length}
                        </span>
                    </div>
                </div>
                {renderActivityList(uncategorizedActivities, 'Unkategorisiert')}
            </div>
        )}
      </div>

      <div className="pt-4 flex justify-center">
        {isAddingCategory ? (
          <div className="glass p-4 rounded-2xl flex items-center gap-2 animate-in zoom-in-95">
            <input 
              autoFocus
              type="text" 
              value={newCategoryName} 
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategorie Name..."
              className="bg-transparent outline-none text-sm font-bold uppercase tracking-widest border-b border-slate-500 w-40 text-slate-200"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
            />
            <button onClick={handleSaveCategory} className="p-2 text-slate-400 hover:text-white"><Check size={18}/></button>
            <button onClick={() => { setIsAddingCategory(false); setEditingCategory(null); setNewCategoryName(''); }} className="p-2 text-red-400 hover:text-white"><X size={18}/></button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center gap-2 px-6 py-3 glass rounded-full text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-400 hover:border-slate-500/30 transition-all"
          >
            <FolderPlus size={16} />
            Kategorie hinzufügen
          </button>
        )}
      </div>

      {(isModalOpen || editingActivity) && (
        <NewActivityModal 
          activity={editingActivity || undefined}
          onClose={() => { setIsModalOpen(false); setEditingActivity(null); }}
          onDelete={onDeleteActivity}
          onSave={(a) => {
            if (editingActivity) onUpdateActivity(a);
            else onAddActivity(a);
            setIsModalOpen(false);
            setEditingActivity(null);
          }}
        />
      )}
    </div>
  );
};

export default AllActivitiesView;
