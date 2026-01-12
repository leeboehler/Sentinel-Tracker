
import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import { supabase } from './lib/supabase';
import { Activity, ActivityLog, Goal, ThemeType, Section, Category } from './types';
import { INITIAL_SECTIONS, INITIAL_CATEGORIES } from './constants';
import { Loader2, Eye } from 'lucide-react';

// Mapper für DB -> App (snake_case zu camelCase)
const mapActivity = (a: any): Activity => ({
  id: a.id,
  title: a.title,
  description: a.description,
  emoji: a.emoji,
  type: a.type,
  category: a.category || 'Allgemein',
  section: a.section || 'Allgemein',
  orderIndex: a.order_index,
  goalId: a.goal_id,
  interval: a.interval,
  customDays: a.custom_days || [0,1,2,3,4,5,6],
  options: a.options || [],
  isMultiSelect: a.is_multi_select,
  unit: a.unit,
  isNumberData: a.is_number_data,
  // Fix: renamed protocol_items to protocolItems to match Activity interface
  protocolItems: a.protocol_items || []
});

const mapLog = (l: any): ActivityLog => ({
  id: l.id,
  activityId: l.activity_id,
  date: l.date,
  value: l.value,
  timestamp: l.timestamp ? Number(l.timestamp) : Date.now()
});

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [initLoading, setInitLoading] = useState(true);
  const [theme, setTheme] = useState<ThemeType>('dark');

  // App State
  const [activities, setActivities] = useState<Activity[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Auth Status check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setInitLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Daten laden
  useEffect(() => {
    if (!session?.user) return;

    const fetchData = async () => {
      setInitLoading(true);
      try {
        const [
          { data: act, error: actErr },
          { data: lg, error: lgErr },
          { data: gl, error: glErr },
          { data: sec, error: secErr },
          { data: cat, error: catErr }
        ] = await Promise.all([
          supabase.from('activities').select('*').order('order_index'),
          supabase.from('logs').select('*'),
          supabase.from('goals').select('*'),
          supabase.from('sections').select('*').order('order_index'),
          supabase.from('categories').select('*').order('order_index')
        ]);

        if (actErr || lgErr || glErr || secErr || catErr) {
          console.error("Daten-Ladefehler:", { actErr, lgErr, glErr, secErr, catErr });
        }

        const loadedActivities = (act as any[])?.map(mapActivity) || [];
        const loadedSections = (sec as any[]) || [];
        const loadedCategories = (cat as any[]) || [];

        if (loadedSections.length === 0 && loadedActivities.length === 0) {
           setSections(INITIAL_SECTIONS);
           setCategories(INITIAL_CATEGORIES);
        } else {
           setSections(loadedSections);
           setCategories(loadedCategories);
        }

        setActivities(loadedActivities);
        setLogs((lg as any[])?.map(mapLog) || []);
        setGoals((gl as any[]) || []);
        
      } catch (err) {
        console.error('Unerwarteter Fehler beim Laden:', err);
      } finally {
        setInitLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Theme Sync mit DOM
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  // DB-Operationen
  const addLog = async (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog = {
      activity_id: log.activityId,
      date: log.date,
      value: log.value,
      user_id: session.user.id,
      timestamp: Date.now(),
    };
    const { data, error } = await supabase.from('logs').insert(newLog).select().single();
    if (error) {
      console.error("Log Error:", error);
    }
    else if (data) setLogs(prev => [...prev, mapLog(data)]);
  };

  const updateLog = async (id: string, value: any) => {
    const { error } = await supabase.from('logs').update({ value, timestamp: Date.now() }).eq('id', id);
    if (!error) setLogs(prev => prev.map(l => String(l.id) === String(id) ? { ...l, value, timestamp: Date.now() } : l));
  };

  const deleteLog = async (id: string) => {
    const { error } = await supabase.from('logs').delete().eq('id', id);
    if (!error) setLogs(prev => prev.filter(l => String(l.id) !== String(id)));
  };

  const addActivity = async (activity: Activity) => {
    const nextOrder = activities.length > 0 ? Math.max(...activities.map(a => a.orderIndex || 0)) + 1 : 0;
    const dbPayload = {
      title: activity.title,
      description: activity.description,
      emoji: activity.emoji,
      type: activity.type,
      category: activity.category,
      section: activity.section,
      order_index: nextOrder,
      // Fix: changed activity.goal_id to activity.goalId because goal_id is not a property of the Activity type.
      goal_id: activity.goalId,
      interval: activity.interval,
      custom_days: activity.customDays,
      options: activity.options,
      is_multi_select: activity.isMultiSelect,
      unit: activity.unit,
      is_number_data: activity.isNumberData,
      protocol_items: activity.protocolItems,
      user_id: session.user.id
    };
    const { data, error } = await supabase.from('activities').insert(dbPayload).select().single();
    if (error) console.error("Activity insert error:", error);
    else if (data) setActivities(prev => [...prev, mapActivity(data)]);
  };

  const updateActivity = async (activity: Activity) => {
    const dbPayload = {
      title: activity.title,
      description: activity.description,
      emoji: activity.emoji,
      type: activity.type,
      category: activity.category,
      section: activity.section,
      order_index: activity.orderIndex,
      goal_id: activity.goalId,
      interval: activity.interval,
      custom_days: activity.customDays,
      options: activity.options,
      is_multi_select: activity.isMultiSelect,
      unit: activity.unit,
      is_number_data: activity.isNumberData,
      protocol_items: activity.protocolItems,
    };
    const { error } = await supabase.from('activities').update(dbPayload).eq('id', activity.id);
    if (!error) setActivities(prev => prev.map(a => String(a.id) === String(activity.id) ? activity : a));
  };

  const deleteActivity = async (id: string) => {
    // Optimistisches Update: Sofort aus der UI entfernen
    const backupActivities = [...activities];
    const backupLogs = [...logs];

    setActivities(prev => prev.filter(a => String(a.id) !== String(id)));
    setLogs(prev => prev.filter(l => String(l.activityId) !== String(id)));

    try {
      // 1. Zuerst verknüpfte Logs in der DB löschen
      await supabase.from('logs').delete().eq('activity_id', id);
      
      // 2. Dann die Aktivität löschen
      const { error } = await supabase.from('activities').delete().eq('id', id);
      
      if (error) {
        console.error("Datenbank-Fehler beim Löschen:", error);
        // Rollback bei Fehler
        setActivities(backupActivities);
        setLogs(backupLogs);
        alert("Löschen fehlgeschlagen: " + error.message);
      }
    } catch (err) {
      console.error("Unerwarteter Fehler beim Löschvorgang:", err);
      // Rollback bei Fehler
      setActivities(backupActivities);
      setLogs(backupLogs);
    }
  };

  const addGoal = async (goal: Goal) => {
    const { data, error } = await supabase.from('goals').insert({ 
      title: goal.title, 
      emoji: goal.emoji, 
      description: goal.description, 
      user_id: session.user.id 
    }).select().single();
    if (!error && data) setGoals(prev => [...prev, data as any]);
  };

  const updateGoal = async (goal: Goal) => {
    const { error } = await supabase.from('goals').update({ 
      title: goal.title, 
      emoji: goal.emoji, 
      description: goal.description 
    }).eq('id', goal.id);
    if (!error) setGoals(prev => prev.map(g => String(g.id) === String(goal.id) ? goal : g));
  };

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('goals').delete().eq('id', id);
    if (!error) {
      setGoals(prev => prev.filter(g => String(g.id) !== String(id)));
      setActivities(prev => prev.map(a => String(a.goalId) === String(id) ? { ...a, goalId: undefined } : a));
    }
  };

  const addSection = async (name: string) => {
    const { data, error } = await supabase.from('sections').insert({ 
      name, 
      user_id: session.user.id,
      order_index: sections.length
    }).select().single();
    if (!error && data) setSections(prev => [...prev, data as any]);
  };

  const deleteSection = async (id: string) => {
    if (id.startsWith('temp-')) {
       setSections(prev => prev.filter(s => String(s.id) !== String(id)));
       return;
    }
    const { error } = await supabase.from('sections').delete().eq('id', id);
    if (!error) setSections(prev => prev.filter(s => String(s.id) !== String(id)));
  };

  const addCategory = async (name: string) => {
    const { data, error } = await supabase.from('categories').insert({ 
      name, 
      user_id: session.user.id,
      order_index: categories.length
    }).select().single();
    if (!error && data) setCategories(prev => [...prev, data as any]);
  };

  const updateCategory = async (updated: Category) => {
    const { error } = await supabase.from('categories').update({ name: updated.name }).eq('id', updated.id);
    if (!error) setCategories(prev => prev.map(c => String(c.id) === String(updated.id) ? updated : c));
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) setCategories(prev => prev.filter(c => String(c.id) !== String(id)));
  };

  if (initLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712]">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Eye className="text-white" size={32} />
          </div>
          <p className="text-slate-500 font-serif italic animate-pulse text-center px-4">Sentinel stellt Verbindung her...</p>
        </div>
      </div>
    );
  }

  if (!session) return <Auth />;

  return (
    <Dashboard 
      activities={activities} 
      logs={logs} 
      goals={goals}
      sections={sections}
      categories={categories}
      theme={theme}
      onSetTheme={setTheme}
      onAddLog={addLog}
      onUpdateLog={updateLog}
      onDeleteLog={deleteLog}
      onAddActivity={addActivity}
      onUpdateActivity={updateActivity}
      onDeleteActivity={deleteActivity}
      onAddGoal={addGoal}
      onUpdateGoal={updateGoal}
      onDeleteGoal={deleteGoal}
      onAddSection={addSection}
      onDeleteSection={deleteSection}
      onUpdateSections={setSections}
      onAddCategory={addCategory}
      onUpdateCategory={updateCategory}
      onDeleteCategory={deleteCategory}
      onUpdateCategories={setCategories}
      onUpdateActivities={setActivities}
    />
  );
};

export default App;
