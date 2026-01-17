
import React, { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { User, Tab, NewsItem } from '../types';
import { WalletService, fetchLivePrices, PRICES } from '../services/api';
import { TrendingUp, Globe, Zap, ArrowRight, Newspaper, Lightbulb } from './Icons';

interface DashboardProps {
  user: User;
  onNavigate?: (tab: Tab, params?: any) => void;
}

const chartData = [
  { name: 'Ene', value: 12000 },
  { name: 'Feb', value: 12500 },
  { name: 'Mar', value: 11800 },
  { name: 'Abr', value: 13200 },
  { name: 'May', value: 14500 },
  { name: 'Jun', value: 13800 },
  { name: 'Jul', value: 15450 },
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [breakdown, setBreakdown] = useState({ fiat: 0, crypto: 0, stock: 0, total: 0 });
  const [marketMovers, setMarketMovers] = useState<any[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [trivia, setTrivia] = useState<any>(null);

  useEffect(() => {
    updateData();
    setNews(WalletService.getNews());
    setTrivia(WalletService.getTrivia());
    const interval = setInterval(() => {
        fetchLivePrices().then(() => updateData());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    const data = WalletService.getBalances();
    const fiat = data.filter(a => a.type === 'FIAT').reduce((acc, curr) => acc + curr.balance, 0);
    const crypto = data.filter(a => a.type === 'CRYPTO').reduce((acc, curr) => acc + (curr.balance * curr.valueUsd), 0);
    const stock = data.filter(a => a.type === 'STOCK').reduce((acc, curr) => acc + (curr.balance * curr.valueUsd), 0);
    setBreakdown({ fiat, crypto, stock, total: fiat + crypto + stock });

    const movers = Object.keys(PRICES).filter(k => k!=='USD').map(k => ({
        symbol: k,
        price: PRICES[k],
        change: (Math.random() * 5) - 2.5,
        vol: Math.floor(Math.random() * 1000)
    })).sort((a,b) => Math.abs(b.change) - Math.abs(a.change)).slice(0,6);
    setMarketMovers(movers);
  };

  const handleAssetClick = (symbol: string) => {
      if (onNavigate) onNavigate(Tab.EXCHANGE, { symbol });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">Executive Dashboard</h2>
            <p className="text-[var(--text-muted)] text-sm">Welcome back, {user.name} • <span className="text-[var(--accent)] font-bold">{user.tier} Account</span></p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Main Net Worth Card */}
        <div className="md:col-span-3 bg-gradient-to-r from-[var(--bg-secondary)] to-[var(--bg-primary)] rounded-2xl p-8 border border-[var(--border-color)] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-[var(--accent)]/5 group-hover:bg-[var(--accent)]/10 transition"></div>
          <div className="flex flex-col md:flex-row justify-between relative z-10">
            <div>
              <h2 className="text-[var(--text-muted)] font-medium mb-1 uppercase text-xs tracking-wider">Total Net Worth</h2>
              <div className="flex items-baseline space-x-4">
                 <span className="text-5xl font-bold text-[var(--text-main)] tracking-tight">
                   ${breakdown.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                 </span>
                 <span className="px-2 py-1 bg-green-500/10 text-green-400 text-sm font-bold rounded-lg border border-green-500/20 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" /> +1.2%
                 </span>
              </div>
            </div>
          </div>
          {/* ... existing portfolio bars ... */}
          <div className="mt-8 grid grid-cols-3 gap-4">
             {/* Retain structure but use CSS variables */}
             <div className="p-4 bg-[var(--bg-primary)]/50 rounded-xl border border-[var(--border-color)] backdrop-blur-sm hover:bg-[var(--bg-secondary)] transition cursor-pointer" onClick={() => onNavigate && onNavigate(Tab.WALLET)}>
                 <div className="text-[10px] text-[var(--text-muted)] uppercase font-bold mb-1">Cash</div>
                 <div className="text-xl font-bold text-[var(--text-main)]">${breakdown.fiat.toLocaleString()}</div>
             </div>
             {/* ... more stats ... */}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="md:col-span-1 space-y-4">
            <button onClick={() => onNavigate && onNavigate(Tab.WALLET, { action: 'transfer' })} className="w-full h-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] flex flex-col items-center justify-center transition group text-center shadow-lg">
                 <div className="p-3 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full mb-3 group-hover:scale-110 transition group-hover:bg-[var(--accent)] group-hover:text-white"><Zap className="w-6 h-6"/></div>
                 <span className="font-bold text-[var(--text-main)]">Quick Transfer</span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Market */}
          <div className="lg:col-span-2 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-lg">
              <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]/30">
                  <h3 className="font-bold text-[var(--text-main)] text-sm">Live Market</h3>
                  <span className="flex items-center text-[10px] text-green-400"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div> Connected</span>
              </div>
              <table className="w-full text-sm">
                  <thead className="bg-[var(--bg-primary)] text-[var(--text-muted)] text-xs uppercase">
                      <tr><th className="p-3 text-left">Asset</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">24h %</th><th className="p-3 text-right hidden md:table-cell">Vol</th></tr>
                  </thead>
                  <tbody>
                      {marketMovers.map((m) => (
                          <tr key={m.symbol} onClick={() => handleAssetClick(m.symbol)} className="border-t border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition cursor-pointer group">
                              <td className="p-3 font-bold text-[var(--text-main)] flex items-center">
                                  <div className={`w-8 h-8 rounded-lg mr-3 flex items-center justify-center text-xs ${m.change > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{m.symbol[0]}</div>
                                  {m.symbol}
                              </td>
                              <td className="p-3 text-right font-mono text-[var(--text-main)]">${m.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                              <td className={`p-3 text-right font-bold ${m.change > 0 ? 'text-green-400' : 'text-red-400'}`}>{m.change > 0 ? '+' : ''}{m.change.toFixed(2)}%</td>
                              <td className="p-3 text-right hidden md:table-cell text-[var(--text-muted)] text-xs">{m.vol}M</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          <div className="space-y-6">
              {/* Daily Trivia */}
              {trivia && (
                  <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-5 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-10"><Lightbulb className="w-16 h-16 text-[var(--accent)]"/></div>
                      <h3 className="font-bold text-[var(--text-main)] text-sm mb-3 flex items-center"><Lightbulb className="w-4 h-4 mr-2 text-yellow-500"/> Daily Trivia</h3>
                      <p className="text-xs text-[var(--text-muted)] mb-4">{trivia.question}</p>
                      <div className="space-y-2">
                          {trivia.options.map((opt: string, i: number) => (
                              <button key={i} className="w-full text-left text-xs p-2 rounded border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--accent)] hover:text-white transition">
                                  {opt}
                              </button>
                          ))}
                      </div>
                  </div>
              )}

              {/* News Feed */}
              <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] p-4 shadow-lg h-64 overflow-hidden flex flex-col">
                  <h3 className="font-bold text-[var(--text-main)] text-sm mb-4 flex items-center"><Newspaper className="w-4 h-4 mr-2"/> Market News</h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                      {news.map(n => (
                          <div key={n.id} className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent)] transition">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded">{n.category}</span>
                                  <span className="text-[10px] text-[var(--text-muted)]">{n.time}</span>
                              </div>
                              <h4 className="text-xs font-bold text-[var(--text-main)] line-clamp-2">{n.title}</h4>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
