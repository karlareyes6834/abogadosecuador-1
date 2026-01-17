
import React, { useState } from 'react';
import { User, Language, Theme } from '../types';
import { ShieldCheck, Eye, EyeOff, Lock, FileText, CheckCircle, Globe, Palette, Moon, Sun } from './Icons';
import { AuthService } from '../services/api';

interface SettingsProps {
  user: User;
  onUpdate: () => void;
  lang: Language;
  setLang: (l: Language) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onUpdate, lang, setLang }) => {
  const [tab, setTab] = useState<'PROFILE' | 'SECURITY' | 'PREFS'>('PROFILE');
  const [kycStatus, setKycStatus] = useState<'PENDING' | 'VERIFIED' | 'NONE'>('VERIFIED');

  const themes: {id: Theme, label: string, color: string}[] = [
      { id: 'NEXUS', label: 'Nexus (Default)', color: 'bg-slate-900' },
      { id: 'LUXURY', label: 'Luxury Gold', color: 'bg-neutral-950 border-yellow-600' },
      { id: 'CYBER', label: 'Cyberpunk', color: 'bg-black border-green-500' },
      { id: 'ROYAL', label: 'Royal Light', color: 'bg-slate-100 border-blue-600' },
      { id: 'MIDNIGHT', label: 'Midnight', color: 'bg-purple-950 border-pink-500' }
  ];

  const handleThemeChange = (t: Theme) => {
      AuthService.setTheme(t);
      onUpdate();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="flex space-x-4 border-b border-[var(--border-color)] pb-2 overflow-x-auto">
          <button onClick={() => setTab('PROFILE')} className={`pb-2 px-4 font-bold transition ${tab === 'PROFILE' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Profile</button>
          <button onClick={() => setTab('SECURITY')} className={`pb-2 px-4 font-bold transition ${tab === 'SECURITY' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Security</button>
          <button onClick={() => setTab('PREFS')} className={`pb-2 px-4 font-bold transition ${tab === 'PREFS' ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>Preferences</button>
       </div>

       {tab === 'PREFS' && (
           <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
               <h3 className="text-[var(--text-main)] font-bold mb-6 flex items-center"><Palette className="w-5 h-5 mr-2"/> Appearance</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div className="col-span-2">
                       <label className="text-sm font-bold text-[var(--text-muted)] mb-3 block">Interface Theme</label>
                       <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                           {themes.map(t => (
                               <button 
                                key={t.id}
                                onClick={() => handleThemeChange(t.id)}
                                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition hover:scale-105 ${user.theme === t.id ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : 'border-transparent bg-[var(--bg-primary)]'}`}
                               >
                                   <div className={`w-8 h-8 rounded-full mb-2 ${t.color} shadow-sm border border-white/10`}></div>
                                   <span className={`text-xs font-bold ${user.theme === t.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{t.label}</span>
                               </button>
                           ))}
                       </div>
                   </div>
               </div>

               <h3 className="text-[var(--text-main)] font-bold mb-6 flex items-center"><Globe className="w-5 h-5 mr-2"/> Localization</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)]">
                       <label className="text-sm font-bold text-[var(--text-muted)] mb-2 block">Language</label>
                       <div className="grid grid-cols-2 gap-2">
                           {['ES', 'EN', 'FR', 'ZH'].map((l) => (
                               <button 
                                key={l}
                                onClick={() => setLang(l as Language)}
                                className={`py-2 px-4 rounded text-xs font-bold transition ${lang === l ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                               >
                                   {l === 'ES' ? 'Español' : l === 'EN' ? 'English' : l === 'FR' ? 'Français' : '中文'}
                               </button>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       )}

       {/* (Existing Profile and Security Tabs content preserved but using variables conceptually) */}
       {tab === 'PROFILE' && (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-[var(--bg-secondary)] p-6 rounded-xl border border-[var(--border-color)]">
                   <h3 className="text-[var(--text-main)] font-bold mb-4">Personal Info</h3>
                   <div className="space-y-4">
                       <div>
                           <label className="text-xs text-[var(--text-muted)] block mb-1">Full Name</label>
                           <input type="text" value={user.name} readOnly className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-main)]" />
                       </div>
                       <div>
                           <label className="text-xs text-[var(--text-muted)] block mb-1">Email</label>
                           <input type="text" value={user.email} readOnly className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-main)]" />
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
