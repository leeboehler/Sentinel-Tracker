
import React, { useState } from 'react';
import { Activity, ActivityType, SelectionOption, ProtocolItem } from '../../types';
import { X, Check, Plus, Trash2, Search, GripVertical } from 'lucide-react';

interface NewActivityModalProps {
  activity?: Activity;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

const EMOJI_CATEGORIES = {
  "Popular": ["✨", "🧘", "💻", "💧", "💊", "🏃", "🥗", "📚", "😴", "🧠", "🍎", "🚶", "🚴", "🍳", "🪴", "🎨", "🎸", "✍️", "🧖", "🧹"],
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"],
  "Food & Drink": ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "バター", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘", "🫕", "🥣", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "☕️", "🫖", "🍵", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🥤", "🧋", "🧃", "🧊"],
  "Activities": ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "⛳️", "🏹", "🎣", "🥊", "🥋", "⛸", "🎿", "🛷", "🛹", "🏋️", "🧗", "🏂", "🏌️", "🏄", "🏊", "🚣", "🏇", "🚴", "🚵", "🧘", "🎮", "🕹", "🎯", "🧩", "🎤", "🎧", "🎬", "🎭"],
  "Objects": ["⌚️", "📱", "💻", "⌨️", "🖥", "🖨", "🖱", "📺", "📷", "📹", "📼", "🕯", "💡", "🔦", "🏮", "📔", "📕", "📖", "📗", "📘", "📙", "📚", "📓", "📒", "📃", "📜", "📄", "📰", "🗞", "📑", "🔖", "🏷", "💰", "💴", "💵", "💶", "💷", "💸", "💳", "🧾", "✉️", "📧", "📨", "📩", "📤", "📥", "📦", "📫", "📪", "📬", "📭", "📮", "🗳", "✏️", "✒️", "🖊", "🖋", "🖌", "🖍", "📝", "📁", "📂", "📅", "📆", "🗓", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇", "📏", "📐", "✂️", "🗃", "🗄", "🗑", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝", "🔨", "🪓", "⛏", "⚒", "🛠", "🗡", "⚔️", "🔫", "🛡", "🔧", "🔩", "⚙️", "🗜", "⚖️", "🦯", "🔗", "⛓", "🧰", "🧲", "🧪", "🧫", "🧬", "🔬", "🔭", "📡", "💉", "🩸", "💊", "🩹", "🩺", "🚪", "🛌", "🛌", "🛋", "🪑", "🚽", "🚿", "🛁", "🪒", "🧴", "🧼", "🧹", "🧺", "🧻", "🛀", "🧼", "🪣", "🪥", "🪑", "🪞", "🪟", "🏮", "🕯"],
  "Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦢", "🦉", "🦚", "🦜", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🦗", "🕷", "🕸", "蠍", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🕊", "🐇", "🐁", "🐀", "🐿", "🐾", "🐉", "🐲", "🌵", "🎄", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐️", "🌟", "✨", "⚡️", "☄️", "💥", "🔥", "🌪", "🌈", "☀️", "🌤", "⛅️", "🌥", "☁️", "🌦", "🌧", "⛈", "🌩", "🌨", "❄️", "☃️", "⛄️", "🌬", "💨", "💧", "💦", "☔️", "☂️", "🌊", "🌫"]
};

const NewActivityModal: React.FC<NewActivityModalProps> = ({ activity, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(activity?.title || '');
  const [emoji, setEmoji] = useState(activity?.emoji || '✨');
  const [type, setType] = useState<ActivityType>(activity?.type || 'binär');
  const [description, setDescription] = useState(activity?.description || '');
  const [unit, setUnit] = useState(activity?.unit || '');
  const [isNumberData, setIsNumberData] = useState(activity?.isNumberData ?? true);
  const [isMultiSelect, setIsMultiSelect] = useState(activity?.isMultiSelect ?? false);
  const [customDays, setCustomDays] = useState<number[]>(activity?.customDays || [0, 1, 2, 3, 4, 5, 6]);
  const [options, setOptions] = useState<SelectionOption[]>(activity?.options || []);
  const [protocolItems, setProtocolItems] = useState<ProtocolItem[]>(activity?.protocolItems || []);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newProtocolLabel, setNewProtocolLabel] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const handleSave = () => {
    if (!title) return;
    const newActivity: Activity = {
      id: activity?.id || Math.random().toString(36).substr(2, 9),
      title, emoji, type,
      category: activity?.category || 'General',
      section: activity?.section || 'Allgemein',
      orderIndex: activity?.orderIndex ?? 0,
      interval: 'custom',
      customDays, description, unit, isNumberData, isMultiSelect,
      options, protocolItems,
    };
    onSave(newActivity);
  };

  const handleDelete = () => {
    if (activity && onDelete) {
      if (confirm('Möchtest du diese Aktivität wirklich löschen? Alle Logs gehen verloren.')) {
        onDelete(activity.id);
        onClose();
      }
    }
  };

  const toggleDay = (day: number) => {
    setCustomDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  const addOption = () => {
    if (!newOptionLabel) return;
    setOptions([...options, { id: Math.random().toString(36).substr(2, 7), label: newOptionLabel }]);
    setNewOptionLabel('');
  };

  const addProtocolItem = () => {
    if (!newProtocolLabel) return;
    setProtocolItems([...protocolItems, { id: Math.random().toString(36).substr(2, 7), label: newProtocolLabel, completed: false }]);
    setNewProtocolLabel('');
  };

  const updateItemLabel = (list: any[], setList: any, id: string, newLabel: string) => {
    setList(list.map(item => item.id === id ? { ...item, label: newLabel } : item));
  };

  const reorder = (list: any[], setList: any, dragId: string, targetId: string) => {
    const newList = [...list];
    const dragIdx = newList.findIndex(i => i.id === dragId);
    const targetIdx = newList.findIndex(i => i.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) return;
    const [removed] = newList.splice(dragIdx, 1);
    newList.splice(targetIdx, 0, removed);
    setList(newList);
  };

  const dayLabels = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const types: {key: ActivityType, label: string}[] = [
    {key: 'binär', label: 'Binär'},
    {key: 'zeit', label: 'Zeit'},
    {key: 'zahlen', label: 'Zahlen'},
    {key: 'auswahl', label: 'Auswahl'},
    {key: 'daten', label: 'Daten'},
    {key: 'protokoll', label: 'Protokoll'}
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl glass rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        
        <div className="p-8 pb-4 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
          <h3 className="text-3xl font-bold">{activity ? 'Aktivität bearbeiten' : 'Neue Aktivität'}</h3>
          <button onClick={onClose} className="p-2 glass rounded-full hover:bg-white/10 transition-colors"><X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8 pb-32">
          <div className="space-y-6">
            <div className="flex gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Emoji</label>
                <button 
                  onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                  className="w-20 h-20 text-4xl flex items-center justify-center glass rounded-3xl hover:ring-2 ring-indigo-500 transition-all active:scale-95"
                >
                  {emoji}
                </button>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Name</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-20 px-6 text-2xl font-semibold glass rounded-3xl outline-none focus:ring-2 ring-indigo-500"
                />
              </div>
            </div>

            {isEmojiPickerOpen && (
              <div className="glass p-6 rounded-3xl space-y-4 animate-in fade-in slide-in-from-top-2 max-h-96 overflow-y-auto border border-indigo-500/20 shadow-2xl">
                <div className="relative sticky top-0 bg-transparent z-10 py-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" placeholder="Emoji suchen..." autoFocus
                    className="w-full pl-10 pr-4 py-3 bg-white/10 rounded-xl outline-none focus:ring-1 ring-indigo-500"
                    onChange={(e) => setEmojiSearch(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                   {Object.entries(EMOJI_CATEGORIES).map(([cat, icons]) => (
                     icons.filter(i => emojiSearch ? i.includes(emojiSearch) : true).map(e => (
                        <button key={e} onClick={() => { setEmoji(e); setIsEmojiPickerOpen(false); }} className="text-3xl p-2 hover:bg-indigo-500/20 rounded-xl transition-all hover:scale-125">{e}</button>
                     ))
                   ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Tracking Art</label>
                <div className="grid grid-cols-3 gap-2">
                  {types.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setType(t.key)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        type === t.key ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
            </div>

            {type === 'daten' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex gap-2">
                   <button onClick={() => setIsNumberData(true)} className={`flex-1 p-3 rounded-xl border transition-all ${isNumberData ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-slate-500'}`}>Zahl</button>
                   <button onClick={() => setIsNumberData(false)} className={`flex-1 p-3 rounded-xl border transition-all ${!isNumberData ? 'bg-indigo-500 text-white shadow-lg' : 'glass text-slate-500'}`}>Text</button>
                </div>
                <input 
                  type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Einheit (z.B. kg)"
                  className="w-full p-4 glass rounded-2xl outline-none border border-white/5 focus:border-indigo-500/50"
                />
              </div>
            )}

            {type === 'auswahl' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center gap-4 py-2">
                  <label className="text-sm font-medium text-slate-300">Mehrfachauswahl?</label>
                  <button onClick={() => setIsMultiSelect(!isMultiSelect)} className={`w-12 h-6 rounded-full relative transition-colors ${isMultiSelect ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isMultiSelect ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newOptionLabel} onChange={(e) => setNewOptionLabel(e.target.value)} placeholder="Option hinzufügen..." className="flex-1 p-3 glass rounded-xl outline-none" onKeyDown={e => e.key === 'Enter' && addOption()} />
                  <button onClick={addOption} className="px-4 bg-indigo-500 text-white rounded-xl shadow-lg"><Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div 
                      key={opt.id} draggable onDragStart={() => setDraggedItemId(opt.id)} onDragOver={e => e.preventDefault()} onDrop={() => draggedItemId && reorder(options, setOptions, draggedItemId, opt.id)}
                      className="flex items-center gap-2 p-1 glass rounded-xl border border-white/5"
                    >
                      <div className="cursor-grab p-2 text-slate-600"><GripVertical size={16}/></div>
                      <input 
                        className="flex-1 bg-transparent border-none outline-none text-sm p-2" 
                        value={opt.label} 
                        onChange={(e) => updateItemLabel(options, setOptions, opt.id, e.target.value)} 
                      />
                      <button onClick={() => setOptions(options.filter(o => o.id !== opt.id))} className="p-2 text-red-400/60 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {type === 'protokoll' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex gap-2">
                  <input type="text" value={newProtocolLabel} onChange={(e) => setNewProtocolLabel(e.target.value)} placeholder="Schritt hinzufügen..." className="flex-1 p-3 glass rounded-xl outline-none" onKeyDown={e => e.key === 'Enter' && addProtocolItem()} />
                  <button onClick={addProtocolItem} className="px-4 bg-indigo-500 text-white rounded-xl shadow-lg"><Plus size={20}/></button>
                </div>
                <div className="space-y-2">
                  {protocolItems.map((item) => (
                    <div 
                      key={item.id} draggable onDragStart={() => setDraggedItemId(item.id)} onDragOver={e => e.preventDefault()} onDrop={() => draggedItemId && reorder(protocolItems, setProtocolItems, draggedItemId, item.id)}
                      className="flex items-center gap-2 p-1 glass rounded-xl border border-white/5"
                    >
                      <div className="cursor-grab p-2 text-slate-600"><GripVertical size={16}/></div>
                      <input 
                        className="flex-1 bg-transparent border-none outline-none text-sm p-2" 
                        value={item.label} 
                        onChange={(e) => updateItemLabel(protocolItems, setProtocolItems, item.id, e.target.value)} 
                      />
                      <button onClick={() => setProtocolItems(protocolItems.filter(i => i.id !== item.id))} className="p-2 text-red-400/60 hover:text-red-400"><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Wiederholung</label>
              <div className="grid grid-cols-7 gap-2">
                {dayLabels.map((label, idx) => (
                  <button
                    key={label} onClick={() => toggleDay(idx)}
                    className={`p-3 rounded-2xl border transition-all text-[10px] font-black ${
                      customDays.includes(idx) ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg' : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Beschreibung</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Zusätzliche Infos..."
                className="w-full p-4 glass rounded-2xl outline-none min-h-[80px] resize-none border border-white/5"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
          <div className="flex gap-3 pointer-events-auto">
            {activity && (
              <button 
                onClick={handleDelete}
                className="flex-1 py-6 rounded-3xl bg-red-500/10 text-red-400 text-xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button 
              onClick={handleSave}
              className={`${activity ? 'flex-[3]' : 'w-full'} py-6 rounded-3xl bg-indigo-500 text-white text-xl font-bold shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-3`}
            >
              Speichern
              <Check size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewActivityModal;
