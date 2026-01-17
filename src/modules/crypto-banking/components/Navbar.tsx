import React, { useState } from 'react';
import { Tab, User, Language } from '../types';
import { t } from '../services/api';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Users, 
  Server, 
  LogOut,
  TrendingUp,
  Landmark,
  Wallet,
  Settings as SettingsIcon,
  Bell,
  Gift,
  Timer,
  Globe,
  Copy,
  Crown,
  ChevronDown,
  SidebarClose,
  SidebarOpen,
  Gamepad
} from './Icons';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onLogout: () => void;
  user: User;
  lang: Language;
  setLang: (l: Language) => void;
  onToggleGamification: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onLogout, user, lang, setLang, onToggleGamification }) => {
  const [notifications, setNotifications] = useState(3);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: Tab.DASHBOARD, label: t('nav.home', lang), icon: <LayoutDashboard /> },
    { id: Tab.WALLET, label: t('nav.wallet', lang), icon: <Wallet /> },
    { id: Tab.EXCHANGE, label: t('nav.market', lang), icon: <ArrowRightLeft /> },
    { id: Tab.BINARY, label: t('nav.binary', lang), icon: <Timer /> },
    { id: Tab.P2P, label: t('nav.p2p', lang), icon: <Users /> },
    { id: Tab.STAKING, label: t('nav.invest', lang), icon: <TrendingUp /> },
    { id: Tab.COPY_TRADING, label: t('nav.copy', lang), icon: <Copy /> },
  ];

  const secondaryItems = [
    { id: Tab.REFERRALS, label: t('nav.referrals', lang), icon: <Gift /> },
    { id: Tab.SETTINGS, label: t('nav.settings', lang), icon: <SettingsIcon /> },
    { id: Tab.ARCHITECTURE, label: t('nav.system', lang), icon: <Server /> },
  ];

  return (
    <>
      <nav className={`hidden md:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-nexus-900 border-r border-nexus-800 h-screen sticky top-0 z-50 transition-all duration-300`}>
        <div className="p-4 border-b border-nexus-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="min-w-[40px] w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
               <Landmark className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
                <div className="flex flex-col whitespace-nowrap animate-in fade-in duration-200">
                    <span className="text-xl font-bold text-white tracking-tight">WI Global</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest">Banking & Crypto</span>
                </div>
            )}
          </div>
          {!isCollapsed && (
             <button onClick={() => setIsCollapsed(true)} className="text-slate-500 hover:text-white transition"><SidebarClose className="w-5 h-5"/></button>
          )}
        </div>
        
        {isCollapsed && (
             <div className="flex justify-center py-2 border-b border-nexus-800 bg-nexus-800/50 cursor-pointer hover:bg-nexus-700" onClick={() => setIsCollapsed(false)}>
                 <SidebarOpen className="w-5 h-5 text-slate-400"/>
             </div>
        )}

        <div className="flex-1 py-4 space-y-4 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <div className="space-y-1 px-3">
            {!isCollapsed && <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Principal</p>}
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'} rounded-lg transition-all duration-200 group relative ${
                  activeTab === item.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-nexus-800 hover:text-slate-200'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <span className="w-5 h-5 shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
                {isCollapsed && (
                    <div className="absolute left-14 bg-nexus-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition z-50 border border-nexus-700 whitespace-nowrap">
                        {item.label}
                    </div>
                )}
              </button>
            ))}
          </div>

          <div className="px-3">
              <button onClick={() => setActiveTab(Tab.PLANS)} className={`w-full bg-gradient-to-r from-yellow-600 to-orange-600 rounded-xl ${isCollapsed ? 'p-2 flex justify-center' : 'p-4 text-left'} group hover:scale-105 transition shadow-lg relative overflow-hidden`}>
                  {isCollapsed ? (
                      <Crown className="w-6 h-6 text-white"/>
                  ) : (
                      <>
                        <div className="relative z-10">
                            <div className="flex items-center text-white font-bold text-sm mb-1">
                                <Crown className="w-4 h-4 mr-2"/>
                                {t('nav.plans', lang)}
                            </div>
                            <div className="text-[10px] text-orange-100 opacity-90">
                                {user.tier === 'STANDARD' ? 'Upgrade to Pro' : 'Manage Pro'}
                            </div>
                        </div>
                        <Crown className="absolute -bottom-4 -right-4 w-16 h-16 text-white opacity-20 rotate-12 group-hover:rotate-45 transition duration-500"/>
                      </>
                  )}
              </button>
          </div>

          <div className="space-y-1 px-3">
            {!isCollapsed && <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuenta</p>}
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center py-3' : 'space-x-3 px-4 py-3'} rounded-lg transition-all duration-200 group relative ${
                  activeTab === item.id
                    ? 'bg-nexus-800 text-white'
                    : 'text-slate-400 hover:bg-nexus-800 hover:text-slate-200'
                }`}
              >
                <span className="w-5 h-5 shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={`p-4 border-t border-nexus-800 bg-nexus-900/50 space-y-4 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          <div className="relative w-full">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} bg-nexus-800 p-2 rounded-lg text-xs text-slate-300 border border-nexus-700 hover:border-nexus-500`}>
                  <div className="flex items-center"><Globe className="w-4 h-4"/> {!isCollapsed && <span className="ml-2">{lang === 'ES' ? 'ES' : lang}</span>}</div>
                  {!isCollapsed && <span className="text-[10px]">▼</span>}
              </button>
              {showLangMenu && (
                  <div className={`absolute bottom-10 ${isCollapsed ? 'left-10 w-32' : 'left-0 right-0'} bg-nexus-800 border border-nexus-700 rounded-lg shadow-xl overflow-hidden z-50`}>
                      <button onClick={() => {setLang('ES'); setShowLangMenu(false)}} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-nexus-700">Español</button>
                      <button onClick={() => {setLang('EN'); setShowLangMenu(false)}} className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-nexus-700">English</button>
                  </div>
              )}
          </div>

          <div className="relative w-full">
            <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center w-full hover:bg-nexus-800 rounded-lg py-2 transition ${isCollapsed ? 'justify-center' : 'px-2'}`}
            >
                <div className={`w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-white font-bold text-xs ${!isCollapsed && 'mr-3'}`}>
                {user.name.charAt(0).toUpperCase()}
                </div>
                {!isCollapsed && (
                    <>
                        <div className="overflow-hidden text-left flex-1">
                            <div className="text-sm font-bold text-white truncate">{user.name}</div>
                            <div className="text-xs text-green-400 truncate">{user.tier} User</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>
            
            {showUserMenu && (
                <div className={`absolute bottom-14 ${isCollapsed ? 'left-10 w-48' : 'left-0 right-0'} bg-nexus-800 border border-nexus-700 rounded-lg shadow-xl overflow-hidden z-50`}>
                    <button onClick={() => {setActiveTab(Tab.SETTINGS); setShowUserMenu(false);}} className="w-full text-left px-4 py-3 text-xs text-white hover:bg-nexus-700 flex items-center border-b border-nexus-700">
                        <SettingsIcon className="w-3 h-3 mr-2"/> {t('nav.settings', lang)}
                    </button>
                    <button onClick={onLogout} className="w-full text-left px-4 py-3 text-xs text-red-400 hover:bg-red-900/20 flex items-center">
                        <LogOut className="w-3 h-3 mr-2" /> {t('nav.logout', lang)}
                    </button>
                </div>
            )}
          </div>
        </div>
      </nav>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-nexus-900 border-b border-nexus-800 z-50 flex justify-between items-center px-4 shadow-lg">
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><Landmark className="w-4 h-4 text-white"/></div>
             <span className="font-bold text-white">WI Global</span>
          </div>
          
          <div className="flex items-center space-x-4">
             <button onClick={onToggleGamification} className="text-purple-400"><Gamepad className="w-6 h-6"/></button>
             <button className="relative text-slate-400" onClick={() => setShowNotifMenu(!showNotifMenu)}>
                <Bell className="w-6 h-6" />
                {notifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{notifications}</span>}
             </button>
          </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-nexus-900 border-t border-nexus-800 z-50 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.5)]">
        <div className="flex justify-around items-center p-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg w-1/5 ${
                activeTab === item.id ? 'text-blue-500' : 'text-slate-400'
              }`}
            >
              <span className="w-5 h-5">{item.icon}</span>
              <span className="text-[10px] mt-1 whitespace-nowrap font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};