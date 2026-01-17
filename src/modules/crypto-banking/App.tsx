import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Exchange } from './components/Exchange';
import { Wallet } from './components/Wallet';
import { P2P } from './components/P2P';
import { ArchitectureView } from './components/ArchitectureView';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Staking } from './components/Staking';
import { Settings } from './components/Settings';
import { Referrals } from './components/Referrals';
import { BinaryOptions } from './components/BinaryOptions';
import { Toaster } from './components/Toaster';
import { CopyTrading } from './components/CopyTrading';
import { Plans } from './components/Plans';
import { Landing } from './components/Landing';
import { Gamification } from './components/Gamification';
import { Support } from './components/Support';
import { AuthService } from './services/api';
import { User, Tab, Language, Theme } from './types';
import { Gamepad } from './components/Icons';

const THEMES: Record<Theme, React.CSSProperties> = {
    NEXUS: {
        '--bg-primary': '#0f172a', // Slate 900
        '--bg-secondary': '#1e293b', // Slate 800
        '--text-main': '#f8fafc',
        '--text-muted': '#94a3b8',
        '--accent': '#3b82f6', // Blue 500
        '--border-color': 'rgba(255,255,255,0.1)'
    } as any,
    LUXURY: {
        '--bg-primary': '#0a0a0a', // Neutral 950
        '--bg-secondary': '#171717', // Neutral 900
        '--text-main': '#fbbf24', // Amber 400
        '--text-muted': '#a3a3a3',
        '--accent': '#d97706', // Amber 600
        '--border-color': 'rgba(251, 191, 36, 0.2)'
    } as any,
    CYBER: {
        '--bg-primary': '#000000',
        '--bg-secondary': '#111111',
        '--text-main': '#84cc16', // Lime
        '--text-muted': '#525252',
        '--accent': '#65a30d',
        '--border-color': 'rgba(132, 204, 22, 0.3)'
    } as any,
    ROYAL: {
        '--bg-primary': '#f8fafc', // Slate 50
        '--bg-secondary': '#ffffff',
        '--text-main': '#1e293b',
        '--text-muted': '#64748b',
        '--accent': '#2563eb',
        '--border-color': '#e2e8f0'
    } as any,
    MIDNIGHT: {
        '--bg-primary': '#2e1065', // Violet 950
        '--bg-secondary': '#4c1d95',
        '--text-main': '#fbcfe8', // Pink 200
        '--text-muted': '#a78bfa',
        '--accent': '#db2777', // Pink 600
        '--border-color': 'rgba(219, 39, 119, 0.3)'
    } as any
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'LANDING' | 'AUTH' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 
  const [language, setLanguage] = useState<Language>('ES');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC');
  const [walletParams, setWalletParams] = useState<any>({});
  const [showGamification, setShowGamification] = useState(false);

  useEffect(() => {
    // Try to get user from localStorage (synced from main app)
    const wiUser = localStorage.getItem('wi_user');
    let currentUser: User | null = null;
    
    if (wiUser) {
      try {
        const userData = JSON.parse(wiUser);
        currentUser = {
          id: userData.id || 'user-' + Date.now(),
          email: userData.email || '',
          name: userData.name || 'Usuario',
          tier: userData.tier || 'STANDARD',
          isVerified: userData.isVerified !== undefined ? userData.isVerified : true,
          joinedAt: userData.joinedAt || new Date().toISOString(),
          language: (userData.language || 'ES') as Language,
          theme: (userData.theme || 'NEXUS') as Theme
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Fallback to AuthService
    if (!currentUser) {
      currentUser = AuthService.getCurrentUser();
    }
    
    if (currentUser) {
      setUser(currentUser);
      if(currentUser.language) setLanguage(currentUser.language);
      if(currentUser.theme) applyTheme(currentUser.theme);
      else applyTheme('NEXUS');
      setView('APP');
    } else {
        applyTheme('NEXUS');
    }
  }, []);

  const applyTheme = (theme: Theme) => {
      const vars = THEMES[theme];
      const root = document.documentElement;
      Object.entries(vars).forEach(([key, val]) => {
          root.style.setProperty(key, val as string);
      });
  };

  const handleLogin = (u: User) => {
    setUser(u);
    setLanguage(u.language || 'ES');
    applyTheme(u.theme || 'NEXUS');
    setView('APP');
    if (selectedSymbol !== 'BTC') {
        setActiveTab(Tab.EXCHANGE);
    } else {
        setActiveTab(Tab.DASHBOARD);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    setUser(null);
    setView('LANDING');
    setActiveTab(Tab.DASHBOARD);
    applyTheme('NEXUS');
  };

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    const u = AuthService.getCurrentUser(); 
    if(u) {
        setUser(u);
        if(u.theme) applyTheme(u.theme);
    }
  };

  const handleNavigate = (tab: Tab, params?: any) => {
      if(params) {
          if(params.symbol) setSelectedSymbol(params.symbol);
          if(params.action) setWalletParams(params); 
      }
      setActiveTab(tab);
  }

  const handleLandingTrade = (symbol: string) => {
      setSelectedSymbol(symbol);
      setView('AUTH');
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.DASHBOARD:
        return <Dashboard key={refreshTrigger} user={user!} onNavigate={handleNavigate} />;
      case Tab.EXCHANGE:
        return <Exchange onTransaction={triggerRefresh} lang={language} selectedSymbol={selectedSymbol} />;
      case Tab.BINARY:
        return <BinaryOptions onTransaction={triggerRefresh} />;
      case Tab.WALLET:
        return <Wallet onTransaction={triggerRefresh} key={refreshTrigger + JSON.stringify(walletParams)} initialParams={walletParams} />;
      case Tab.P2P:
        return <P2P onTransaction={triggerRefresh} />;
      case Tab.STAKING:
        return <Staking onTransaction={triggerRefresh} />;
      case Tab.REFERRALS:
        return <Referrals user={user!} />;
      case Tab.SETTINGS:
        return <Settings user={user!} onUpdate={() => triggerRefresh()} lang={language} setLang={setLanguage} />;
      case Tab.ARCHITECTURE:
        return <ArchitectureView />;
      case Tab.COPY_TRADING:
        return <CopyTrading onTransaction={triggerRefresh} />;
      case Tab.PLANS:
        return <Plans user={user!} onUpdate={() => { triggerRefresh(); const u = AuthService.getCurrentUser(); if(u) setUser(u); }} />;
      default:
        return <Dashboard user={user!} />;
    }
  };

  if (view === 'LANDING') {
      return <Landing onLoginClick={() => setView('AUTH')} onTradeClick={handleLandingTrade} />;
  }

  if (view === 'AUTH') {
      return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-main)] font-sans selection:bg-[var(--accent)] selection:text-white pb-20 md:pb-0 transition-colors duration-500">
      <div className="flex">
        <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onLogout={handleLogout} 
            user={user!} 
            lang={language} 
            setLang={setLanguage}
            onToggleGamification={() => setShowGamification(!showGamification)}
        />
        <main className="flex-1 p-4 md:p-6 overflow-hidden max-h-screen overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      
      {showGamification && <Gamification user={user!} onClose={() => setShowGamification(false)} />}
      <Support />
      <Toaster />
    </div>
  );
};

export default App;