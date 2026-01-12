
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Activity, ActivityLog, Category } from '../../types';
import { 
  User, Key, Download, Upload, FileText, Check, AlertCircle, 
  LogOut, Printer, X, Calendar as CalendarIcon, FileSpreadsheet, Info
} from 'lucide-react';

interface SettingsViewProps {
  activities: Activity[];
  logs: ActivityLog[];
  categories: Category[];
  onAddActivity: (activity: Activity) => void;
  onUpdateActivities: (activities: Activity[]) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ activities, logs, categories, onAddActivity, onUpdateActivities }) => {
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [selectedForReport, setSelectedForReport] = useState<string[]>([]);
  
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7); 
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  useEffect(() => {
    if (activities.length > 0 && selectedForReport.length === 0) {
      setSelectedForReport(activities.map(a => a.id));
    }
  }, [activities]);

  const setLastMonthRange = () => {
    const now = new Date();
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    setStartDate(firstDayLastMonth.toISOString().split('T')[0]);
    setEndDate(lastDayLastMonth.toISOString().split('T')[0]);
  };

  // --- PDF ENGINE (WEEK VIEW CLONE) ---
  const generatePDFReport = () => {
    try {
      const { jsPDF } = (window as any).jspdf;
      if (!jsPDF) throw new Error("Bibliothek nicht bereit.");

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const reportActivities = activities
        .filter(a => selectedForReport.includes(a.id))
        .sort((a, b) => a.orderIndex - b.orderIndex);

      if (reportActivities.length === 0) return;

      const dateArray: string[] = [];
      const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
      let curr = new Date(startDate + 'T00:00:00');
      const last = new Date(endDate + 'T00:00:00');
      while (curr <= last) {
        dateArray.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("SENTINEL WOCHEN-BERICHT", 14, 15);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Zeitraum: ${startDate} bis ${endDate} | User: ${user?.email}`, 14, 22);

      const tableHead = [['AKTIVITAET', ...dateArray.map(d => {
        const dt = new Date(d + 'T00:00:00');
        return `${dt.getDate()}.${dt.getMonth()+1}.\n${dayNames[dt.getDay()]}`;
      })]];

      const tableBody = reportActivities.map(act => {
        const safeTitle = act.title.replace(/[^\x00-\x7F]/g, "").trim() || "Aktivitaet";
        const row: any[] = [safeTitle];
        dateArray.forEach(date => {
          const log = logs.find(l => l.activityId === act.id && l.date === date);
          if (!log) row.push("");
          else {
            switch (act.type) {
              case 'binär': row.push("X"); break;
              case 'zeit': row.push(`${Math.floor(log.value/60)}h${log.value%60}m`); break;
              case 'zahlen':
              case 'daten': row.push(String(log.value)); break;
              case 'auswahl': row.push(String(Array.isArray(log.value) ? log.value.length : 1)); break;
              case 'protokoll': row.push(`${(log.value as any[]).filter(i => i.completed).length}/${(log.value as any[]).length}`); break;
              default: row.push("OK");
            }
          }
        });
        return row;
      });

      (doc as any).autoTable({
        startY: 30,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        styles: { fontSize: dateArray.length > 15 ? 5 : 7, cellPadding: 1, halign: 'center', valign: 'middle' },
        headStyles: { fillColor: [51, 65, 85] },
        columnStyles: { 0: { halign: 'left', cellWidth: 40, fontStyle: 'bold' } },
        didParseCell: (data: any) => {
          if (data.section === 'head' && data.column.index > 0) {
            const d = new Date(dateArray[data.column.index-1] + 'T00:00:00').getDay();
            if (d === 0 || d === 6) data.cell.styles.fillColor = [30, 41, 59];
          }
        }
      });

      doc.save(`Sentinel_Bericht_${startDate}.pdf`);
      setMessage({ text: "PDF wurde erstellt!", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "PDF Fehler: " + err.message, type: 'error' });
    }
  };

  // --- CSV ENGINE ---
  const downloadCSVTemplate = () => {
    const headers = ["Title", "Emoji", "Type", "Category", "Section", "Description", "Unit"];
    const example = ["Morgen Yoga", "🧘", "binär", "Gesundheit", "Morgen", "15 Min Stretching", ""];
    const csvContent = [headers.join(","), example.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sentinel_aktivitaeten_template.csv");
    link.click();
  };

  const exportLogsCSV = () => {
    const headers = ["Aktivität", "Datum", "Wert", "Typ"];
    const rows = logs.map(l => {
      const act = activities.find(a => a.id === l.activityId);
      return [
        act?.title || "Gelöscht",
        l.date,
        JSON.stringify(l.value).replace(/,/g, ";"),
        act?.type || "unknown"
      ].join(",");
    });
    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `sentinel_backup_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const importActivitiesCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim().length > 0);
      const headers = lines[0].split(",");
      
      let count = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        if (cols.length < 5) continue;
        
        onAddActivity({
          id: Math.random().toString(36).substr(2, 9),
          title: cols[0].trim(),
          emoji: cols[1].trim() || "✨",
          type: (cols[2].trim() as any) || "binär",
          category: cols[3].trim() || "Allgemein",
          section: cols[4].trim() || "Morgen",
          description: cols[5]?.trim() || "",
          unit: cols[6]?.trim() || "",
          orderIndex: activities.length + count,
          interval: 'daily',
          customDays: [0,1,2,3,4,5,6]
        });
        count++;
      }
      setMessage({ text: `${count} Aktivitäten importiert!`, type: 'success' });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Einstellungen</h2>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Grid Engine v3.0</span>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
          <span className="text-sm font-medium flex-1">{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-50 hover:opacity-100"><X size={14} /></button>
        </div>
      )}

      {/* PDF REPORT SECTION */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-2">PDF Wochen-Export</h3>
        <div className="glass rounded-[2rem] p-6 space-y-6 border border-white/10 shadow-xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-slate-600 ml-1">Startdatum</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-slate-200" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase text-slate-600 ml-1">Enddatum</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none text-xs text-slate-200" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-slate-600 ml-1">Aktivitäten wählen ({selectedForReport.length})</p>
            <div className="max-h-40 overflow-y-auto space-y-1 bg-black/20 rounded-2xl p-2 border border-white/5 custom-scrollbar">
              {activities.map(a => (
                <button key={a.id} onClick={() => setSelectedForReport(prev => prev.includes(a.id) ? prev.filter(x => x !== a.id) : [...prev, a.id])} className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${selectedForReport.includes(a.id) ? 'bg-slate-600/20 border-slate-500/30 shadow-inner' : 'opacity-40'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{a.emoji}</span>
                    <span className="text-xs font-bold truncate">{a.title}</span>
                  </div>
                  {selectedForReport.includes(a.id) && <Check size={12} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>

          <button onClick={generatePDFReport} className="w-full py-4 bg-slate-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">
            <Printer size={20} /> PDF-BERICHT GENERIEREN
          </button>
        </div>
      </section>

      {/* CSV BACKUP & IMPORT */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-2">CSV Datensicherung</h3>
        <div className="glass rounded-[2rem] p-6 space-y-4 border border-white/10">
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={exportLogsCSV} className="flex flex-col items-center gap-2 p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group">
              <Download className="text-slate-500 group-hover:text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Logs (CSV)</span>
            </button>
            <label className="flex flex-col items-center gap-2 p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-pointer group">
              <Upload className="text-slate-500 group-hover:text-white" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Aktivitäten Import</span>
              <input type="file" accept=".csv" onChange={importActivitiesCSV} className="hidden" />
            </label>
          </div>

          <div className="border-t border-white/5 pt-4">
            <button onClick={downloadCSVTemplate} className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white flex items-center justify-center gap-2">
              <FileSpreadsheet size={14} /> CSV-VORLAGE LADEN (TEMPLATE)
            </button>
            <p className="text-[9px] text-slate-600 mt-3 flex items-start gap-2 px-2">
              <Info size={12} className="shrink-0" />
              <span>Verwende die Vorlage, um deine Aktivitäten in Excel zu bearbeiten. Beim Import werden sie deiner Liste hinzugefügt.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Account */}
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 px-2">Account</h3>
        <div className="glass rounded-[2rem] p-6 space-y-4 border border-white/10">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold">{user?.email?.[0].toUpperCase()}</div>
            <p className="font-semibold text-sm truncate">{user?.email}</p>
          </div>
          <button onClick={async () => await supabase.auth.signOut()} className="w-full py-4 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-2xl transition-all border border-red-500/10 font-bold text-xs uppercase tracking-widest">Abmelden</button>
        </div>
      </section>
    </div>
  );
};

export default SettingsView;
