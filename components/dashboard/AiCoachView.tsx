
import React, { useState, useEffect } from 'react';
import { Activity, ActivityLog, Goal } from '../../types';
import { GoogleGenAI } from "@google/genai";
import { Brain, Zap, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface AiCoachViewProps {
  activities: Activity[];
  logs: ActivityLog[];
  goals: Goal[];
}

const AiCoachView: React.FC<AiCoachViewProps> = ({ activities, logs, goals }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAiAnalysis = async () => {
    // Sicherstellen, dass process und env existieren bevor darauf zugegriffen wird
    const env = (window as any).process?.env || {};
    const apiKey = env.API_KEY || "";
    
    if (!apiKey || apiKey === "") {
      setError("Gemini API Key fehlt. Bitte füge 'API_KEY' in den Vercel Umgebungsvariablen hinzu.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Client erst hier initialisieren
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Du bist der "Sentinel Coach", ein futuristischer KI-Begleiter für einen Habit Tracker.
        Der Nutzer trackt aktuell ${activities.length} Aktivitäten.
        Gib einen ultrakurzen (max. 2 Sätze) motivierenden Tipp im Sci-Fi Stil.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || "Analyse abgeschlossen.");
    } catch (err: any) {
      console.error("AI Error:", err);
      setError("Sentinel-Kern offline. Bitte API Key prüfen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activities.length > 0) {
      getAiAnalysis();
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 px-2">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 ai-pulse bg-slate-500/20 rounded-full"></div>
           <Brain className="text-slate-200 relative z-10" size={40} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Sentinel Coach</h2>
        <p className="text-slate-500 font-serif italic text-sm">Synchronisation mit dem Kern läuft...</p>
      </div>

      <div className="glass rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-slate-400" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Scanning data streams...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
            <AlertCircle className="text-red-500" size={40} />
            <p className="text-red-400 text-xs px-4">{error}</p>
            <button 
              onClick={getAiAnalysis}
              className="px-6 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-all"
            >
              System-Reboot
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-slate-400 mb-2">
              <Zap size={18} className="text-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Temporal Insight</span>
            </div>
            
            <p className="text-slate-300 leading-relaxed font-medium">
              {insight || "Bereit für die Analyse."}
            </p>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <button 
                onClick={getAiAnalysis}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
              >
                Data Sync <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiCoachView;
