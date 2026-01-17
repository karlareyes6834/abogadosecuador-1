
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Timer, TrendingUp, Zap, Activity, Clock, Layers, Briefcase, DollarSign, Anchor, ChevronDown, Lock, Check, X, Plus, Trash2 } from './Icons';
import { WalletService, fetchLivePrices, PRICES, getChartData, AuthService } from '../services/api';
import { BinaryPosition } from '../types';
import { Plans } from './Plans';

interface BinaryOptionsProps {
  onTransaction: () => void;
}

type BinaryMode = 'TURBO' | 'INTRADAY';
type AssetCategory = 'CRYPTO' | 'FOREX' | 'STOCKS' | 'COMMODITY';

export const BinaryOptions: React.FC<BinaryOptionsProps> = ({ onTransaction }) => {
  const [symbol, setSymbol] = useState('BTC');
  const [duration, setDuration] = useState(60); // Seconds
  const [amount, setAmount] = useState('100');
  const [payout] = useState(0.88); // 88%
  const [chartData, setChartData] = useState<any[]>([]);
  const [activePositions, setActivePositions] = useState<BinaryPosition[]>([]);
  const [historyPositions, setHistoryPositions] = useState<BinaryPosition[]>([]);
  const [pendingOrders, setPendingOrders] = useState<BinaryPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  
  // Pro / UI State
  const [mode, setMode] = useState<BinaryMode>('TURBO');
  const [assetCategory, setAssetCategory] = useState<AssetCategory>('CRYPTO');
  const [chartTimeframe, setChartTimeframe] = useState('1s');
  const [tab, setTab] = useState<'POSITIONS' | 'PENDING' | 'HISTORY'>('POSITIONS');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [userTier, setUserTier] = useState('STANDARD');
  
  // Asset Selector
  const [showAssetSelector, setShowAssetSelector] = useState(false);

  // Pending Order Input
  const [pendingPrice, setPendingPrice] = useState('');
  const [isPendingMode, setIsPendingMode] = useState(false);

  // Confirmation
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<'CALL' | 'PUT' | null>(null);

  useEffect(() => {
    refresh();
    const u = AuthService.getCurrentUser();
    if(u) setUserTier(u.tier);

    const interval = setInterval(() => {
        refresh();
    }, 1000);
    return () => clearInterval(interval);
  }, [symbol, chartTimeframe]);

  const refresh = async () => {
    await fetchLivePrices();
    setCurrentPrice(PRICES[symbol]);
    
    // Update active positions from local storage
    const all = WalletService.getBinaryPositions();
    setActivePositions(all.filter(p => p.status === 'ACTIVE').reverse());
    setPendingOrders(all.filter(p => p.status === 'PENDING').reverse());
    setHistoryPositions(all.filter(p => p.status === 'WON' || p.status === 'LOST').reverse());
    
    // Chart Data Logic (Respecting selected timeframe)
    const data = getChartData(symbol, chartTimeframe);
    // Keep last 60 points for smoothness
    setChartData(data.slice(-60));
  };

  const initiateTrade = (direction: 'CALL' | 'PUT') => {
      if(!amount || parseFloat(amount) <= 0) { alert("Invalid Amount"); return; }
      setPendingAction(direction);
      setShowConfirm(true);
  };

  const confirmTrade = async () => {
      if(!pendingAction) return;
      setLoading(true);
      setShowConfirm(false);
      try {
          if (isPendingMode) {
              if(!pendingPrice) throw new Error("Enter a target price for pending order");
              await WalletService.placePendingBinary(symbol, parseFloat(amount), pendingAction, duration, parseFloat(pendingPrice));
              alert("Pending Order Scheduled");
              setTab('PENDING');
          } else {
              await WalletService.openBinaryOption(symbol, parseFloat(amount), pendingAction, duration);
          }
          onTransaction(); 
      } catch (e: any) {
          alert(e.message);
      } finally {
          setLoading(false);
          setPendingAction(null);
      }
  };
  
  const handleTimeframeChange = (tf: string) => {
      if((['1s', '3s', '5s'].includes(tf)) && userTier === 'STANDARD') {
           if(window.confirm("Unlock High Frequency (1s-5s) Charts?")) setShowPlanModal(true);
           return;
      }
      setChartTimeframe(tf);
  }

  const potentialProfit = (parseFloat(amount || '0') * payout).toFixed(2);
  const isUp = chartData.length > 1 && chartData[chartData.length-1].value > chartData[chartData.length-2].value;

  // Filter Assets for Selector
  const getAssetsByCategory = () => {
      const all = Object.keys(PRICES).filter(k => k !== 'USD');
      if(assetCategory === 'CRYPTO') return all.filter(k => !k.includes('/') && !['AAPL','TSLA','XAU','XAG'].includes(k));
      if(assetCategory === 'FOREX') return all.filter(k => k.includes('/') || ['EUR','JPY'].includes(k));
      if(assetCategory === 'COMMODITY') return ['XAU','XAG','OIL','NG','PLAT','PAL'];
      return ['AAPL','TSLA','NVDA','MSFT','GOOGL','META','AMZN']; // Stocks
  }

  if(showPlanModal) {
      return (
          <div className="fixed inset-0 z-50 bg-nexus-900 overflow-y-auto">
              <div className="p-4">
                  <button onClick={() => setShowPlanModal(false)} className="mb-4 text-white">← Back</button>
                  <Plans user={AuthService.getCurrentUser()!} onUpdate={() => { 
                      onTransaction();
                      const u = AuthService.getCurrentUser();
                      if(u) setUserTier(u.tier);
                      setShowPlanModal(false); 
                  }} />
              </div>
          </div>
      )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] min-h-[600px] relative">
        {/* Main Chart Area */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
            <div className="bg-nexus-800 flex-1 rounded-2xl border border-nexus-700 p-4 relative overflow-hidden flex flex-col">
                {/* Top Toolbar */}
                <div className="flex justify-between items-center z-10 mb-2">
                    <div className="flex items-center space-x-2">
                         {/* IQ OPTION STYLE ASSET SELECTOR */}
                         <button onClick={() => setShowAssetSelector(!showAssetSelector)} className="bg-nexus-900 hover:bg-nexus-700 text-white px-3 py-1.5 rounded-t-lg border-t border-x border-nexus-600 font-bold flex items-center space-x-2 transition">
                             <Plus className="w-4 h-4 text-nexus-accent"/>
                             <span>{symbol}</span>
                             <span className={`ml-2 text-xs ${isUp ? 'text-green-400' : 'text-red-400'}`}>{currentPrice.toFixed(2)}</span>
                         </button>

                         {/* Dropdown */}
                         {showAssetSelector && (
                             <div className="absolute top-12 left-4 bg-nexus-800 border border-nexus-600 shadow-2xl rounded-xl z-50 w-96 p-4 animate-in fade-in zoom-in duration-100">
                                 <div className="flex space-x-2 mb-4 border-b border-nexus-700 pb-2 overflow-x-auto">
                                     {['CRYPTO','FOREX','STOCKS','COMMODITY'].map(c => (
                                         <button key={c} onClick={()=>setAssetCategory(c as any)} className={`text-xs font-bold px-2 py-1 rounded ${assetCategory===c ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>{c}</button>
                                     ))}
                                 </div>
                                 <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                                     {getAssetsByCategory().map(a => (
                                         <button key={a} onClick={() => {setSymbol(a); setShowAssetSelector(false);}} className="text-left p-2 hover:bg-nexus-700 rounded flex justify-between group">
                                             <span className="text-white font-bold text-sm">{a}</span>
                                             <span className="text-green-400 text-xs font-bold">88%</span>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         )}
                    </div>

                    {/* Chart Timeframes */}
                    <div className="flex items-center space-x-1 bg-nexus-900 p-1 rounded border border-nexus-700">
                        {['1s','5s','1m','5m','15m','1h','4h'].map(tf => {
                            const locked = ['1s','5s'].includes(tf) && userTier === 'STANDARD';
                            return (
                                <button 
                                    key={tf} 
                                    onClick={()=>handleTimeframeChange(tf)} 
                                    className={`px-2 py-1 text-[10px] font-bold rounded flex items-center ${chartTimeframe === tf ? 'bg-nexus-700 text-white' : 'text-slate-500'}`}
                                >
                                    {locked && <Lock className="w-2 h-2 mr-1"/>}
                                    {tf}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                      <XAxis dataKey="time" hide />
                      <YAxis domain={['auto', 'auto']} orientation="right" stroke="#64748b" tick={{fontSize: 10}} />
                      <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', color: '#fff'}} itemStyle={{color: '#fff'}} />
                      <Area 
                        type="step" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fill="url(#colorVal)" 
                        isAnimationActive={false}
                      />
                      {activePositions.filter(p => p.asset === symbol).map(p => (
                          <ReferenceLine key={p.id} y={p.strikePrice} stroke={p.direction === 'CALL' ? '#22c55e' : '#ef4444'} strokeDasharray="3 3" label={{ position: 'right', value: p.direction, fill: 'white', fontSize: 10 }} />
                      ))}
                      {pendingOrders.filter(p => p.asset === symbol).map(p => (
                          <ReferenceLine key={p.id} y={p.targetPrice} stroke="#fbbf24" strokeDasharray="5 5" label={{ position: 'right', value: `PENDING ${p.direction}`, fill: '#fbbf24', fontSize: 10 }} />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </div>

            {/* Active/Pending Positions Table */}
            <div className="h-48 bg-nexus-800 rounded-2xl border border-nexus-700 overflow-hidden flex flex-col">
                <div className="flex border-b border-nexus-700 bg-nexus-900/50">
                    <button onClick={() => setTab('POSITIONS')} className={`flex-1 py-2 text-xs font-bold transition ${tab==='POSITIONS'?'text-blue-500 border-b-2 border-blue-500 bg-white/5':'text-slate-500 hover:text-white'}`}>POSITIONS ({activePositions.length})</button>
                    <button onClick={() => setTab('PENDING')} className={`flex-1 py-2 text-xs font-bold transition ${tab==='PENDING'?'text-blue-500 border-b-2 border-blue-500 bg-white/5':'text-slate-500 hover:text-white'}`}>PENDING ({pendingOrders.length})</button>
                    <button onClick={() => setTab('HISTORY')} className={`flex-1 py-2 text-xs font-bold transition ${tab==='HISTORY'?'text-blue-500 border-b-2 border-blue-500 bg-white/5':'text-slate-500 hover:text-white'}`}>HISTORY ({historyPositions.length})</button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-xs">
                        <thead className="text-slate-500 bg-nexus-900/20 text-left sticky top-0 backdrop-blur">
                            <tr>
                                <th className="p-2">Asset</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">{tab === 'PENDING' ? 'Target Price' : 'Strike'}</th>
                                <th className="p-2">{tab === 'PENDING' ? 'Current' : 'End Price'}</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2 text-right">{tab === 'POSITIONS' ? 'Time Left' : tab === 'PENDING' ? 'Action' : 'Result'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(tab === 'POSITIONS' ? activePositions : tab === 'PENDING' ? pendingOrders : historyPositions).map(p => {
                                const current = PRICES[p.asset] || 0;
                                const timeLeft = Math.max(0, Math.floor((new Date(p.expiryTime).getTime() - new Date().getTime()) / 1000));
                                
                                return (
                                    <tr key={p.id} className="border-b border-nexus-700/50 hover:bg-nexus-700/30">
                                        <td className="p-2 font-bold text-white">{p.asset}</td>
                                        <td className={`p-2 font-bold ${p.direction === 'CALL' ? 'text-green-500' : 'text-red-500'}`}>{p.direction}</td>
                                        <td className="p-2 text-slate-400">
                                            {tab === 'PENDING' ? p.targetPrice?.toFixed(2) : (p.strikePrice > 0 ? p.strikePrice.toFixed(2) : '-')}
                                        </td>
                                        <td className="p-2 text-white">{current.toFixed(2)}</td>
                                        <td className="p-2 text-white font-mono">${p.amount}</td>
                                        <td className="p-2 text-right font-mono text-yellow-500">
                                            {tab === 'POSITIONS' ? timeLeft + 's' : tab === 'PENDING' ? (
                                                <button className="text-red-400 hover:text-red-300"><Trash2 className="w-3 h-3"/></button>
                                            ) : (
                                                <span className={p.status === 'WON' ? 'text-green-400 font-bold' : p.status === 'LOST' ? 'text-red-500 font-bold' : 'text-slate-400'}>
                                                    {p.status === 'WON' ? `+$${p.resultAmount.toFixed(2)}` : p.status === 'LOST' ? '-$'+p.amount : p.targetPrice}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {(tab === 'POSITIONS' ? activePositions : tab === 'PENDING' ? pendingOrders : historyPositions).length === 0 && (
                                <tr><td colSpan={6} className="p-8 text-center text-slate-500 italic">No orders found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Trade Control Panel - Premium Style */}
        <div className="col-span-1 bg-nexus-800 rounded-2xl border border-nexus-700 p-0 flex flex-col shadow-2xl overflow-hidden">
            {/* Header Tabs */}
            <div className="grid grid-cols-2 bg-nexus-900 border-b border-nexus-700">
                 <button onClick={() => setMode('TURBO')} className={`py-3 text-xs font-bold transition ${mode === 'TURBO' ? 'text-blue-400 border-b-2 border-blue-400 bg-nexus-800' : 'text-slate-500 hover:text-white'}`}>TURBO</button>
                 <button onClick={() => setMode('INTRADAY')} className={`py-3 text-xs font-bold transition ${mode === 'INTRADAY' ? 'text-blue-400 border-b-2 border-blue-400 bg-nexus-800' : 'text-slate-500 hover:text-white'}`}>INTRADAY</button>
            </div>

            <div className="p-4 flex-1 flex flex-col space-y-5">
                 {/* Duration Selector */}
                 <div>
                     <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block flex justify-between">
                         <span>Expiration</span>
                         <span className="text-white"><Clock className="w-3 h-3 inline mr-1"/>{duration < 60 ? duration+'s' : (duration/60)+'m'}</span>
                     </label>
                     <div className="grid grid-cols-3 gap-2">
                         {(mode === 'TURBO' ? [5, 10, 15, 30, 60, 120] : [300, 900, 1800, 3600, 14400, 86400]).map(s => (
                             <button 
                                key={s} 
                                onClick={() => setDuration(s)}
                                className={`py-2 rounded border font-bold text-xs transition ${duration === s ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-nexus-900 text-slate-400 border-nexus-600 hover:border-slate-500'}`}
                             >
                                 {s < 60 ? s + 's' : (s >= 3600 ? (s/3600) + 'h' : (s/60) + 'm')}
                             </button>
                         ))}
                     </div>
                 </div>

                 {/* Order Type Toggle */}
                 <div className="bg-nexus-900 p-1 rounded-lg border border-nexus-600 flex">
                     <button onClick={() => setIsPendingMode(false)} className={`flex-1 py-1.5 rounded text-[10px] font-bold transition ${!isPendingMode ? 'bg-nexus-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}>MARKET</button>
                     <button onClick={() => setIsPendingMode(true)} className={`flex-1 py-1.5 rounded text-[10px] font-bold transition ${isPendingMode ? 'bg-nexus-700 text-white shadow' : 'text-slate-500 hover:text-white'}`}>PENDING</button>
                 </div>

                 {isPendingMode && (
                     <div>
                         <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Trigger Price</label>
                         <div className="relative group">
                             <input 
                                type="number" 
                                value={pendingPrice} 
                                onChange={e=>setPendingPrice(e.target.value)} 
                                className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 pl-3 text-white font-mono font-bold text-sm outline-none focus:border-blue-500 transition group-hover:border-slate-500" 
                                placeholder="Target..." 
                             />
                             <span className="absolute right-3 top-3 text-xs text-slate-500 font-bold">USD</span>
                         </div>
                     </div>
                 )}

                 {/* Amount Input */}
                 <div>
                     <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Amount</label>
                     <div className="relative group">
                         <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white font-bold text-xl outline-none focus:border-blue-500 transition group-hover:border-slate-500"
                         />
                         <span className="absolute right-3 top-4 text-xs text-slate-500 font-bold">USD</span>
                     </div>
                 </div>

                 {/* Profitometer */}
                 <div className="bg-nexus-900/50 p-4 rounded-xl border border-nexus-700 flex justify-between items-center">
                     <div>
                         <div className="text-[10px] text-slate-500 uppercase font-bold">Profit (+{payout*100}%)</div>
                         <div className="text-2xl font-bold text-green-400 font-mono">+${(parseFloat(amount||'0') * payout).toFixed(2)}</div>
                     </div>
                     <div className="text-right">
                         <div className="text-[10px] text-slate-500 uppercase font-bold">Total</div>
                         <div className="text-sm font-bold text-white">${(parseFloat(amount||'0') * (1+payout)).toFixed(2)}</div>
                     </div>
                 </div>
            </div>

            <div className="mt-auto p-4 space-y-3 bg-nexus-900/30 border-t border-nexus-700">
                <button 
                    onClick={() => initiateTrade('CALL')}
                    disabled={loading}
                    className="w-full py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 flex justify-between px-6 transition transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 group"
                >
                    <span className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition"/> HIGHER</span>
                    <span className="opacity-80 text-xs self-center bg-black/20 px-2 py-0.5 rounded">{isPendingMode ? '@ ' + (pendingPrice || 'Target') : 'NOW'}</span>
                </button>
                <button 
                    onClick={() => initiateTrade('PUT')}
                    disabled={loading}
                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/20 flex justify-between px-6 transition transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100 group"
                >
                    <span className="flex items-center"><TrendingUp className="w-5 h-5 mr-2 rotate-180 group-hover:translate-y-1 transition"/> LOWER</span>
                    <span className="opacity-80 text-xs self-center bg-black/20 px-2 py-0.5 rounded">{isPendingMode ? '@ ' + (pendingPrice || 'Target') : 'NOW'}</span>
                </button>
            </div>
        </div>

        {/* CONFIRMATION MODAL */}
        {showConfirm && pendingAction && (
             <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                 <div className="bg-nexus-800 rounded-2xl border border-nexus-600 shadow-2xl max-w-xs w-full animate-in zoom-in duration-200 overflow-hidden">
                     <div className={`h-2 w-full ${pendingAction === 'CALL' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                     <div className="p-6 text-center space-y-4">
                         <h3 className="font-bold text-white text-lg">Confirm Trade</h3>
                         <div className="py-2">
                             <div className={`text-3xl font-black ${pendingAction === 'CALL' ? 'text-green-500' : 'text-red-500'} mb-1`}>
                                 {pendingAction}
                             </div>
                             <div className="text-slate-400 font-bold">{symbol}</div>
                         </div>
                         
                         <div className="bg-nexus-900/50 rounded-lg p-3 text-sm space-y-2">
                             <div className="flex justify-between"><span className="text-slate-500">Amount</span> <span className="text-white font-mono">${amount}</span></div>
                             <div className="flex justify-between"><span className="text-slate-500">Duration</span> <span className="text-white">{duration}s</span></div>
                             {isPendingMode && <div className="flex justify-between"><span className="text-slate-500">Trigger</span> <span className="text-yellow-500 font-bold">${pendingPrice}</span></div>}
                         </div>

                         <div className="flex space-x-3 pt-2">
                             <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-nexus-700 hover:bg-nexus-600 rounded-lg text-slate-300 font-bold transition">Cancel</button>
                             <button onClick={confirmTrade} className={`flex-1 py-3 rounded-lg text-white font-bold shadow-lg transition flex justify-center items-center ${pendingAction === 'CALL' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
                                 {loading ? '...' : 'Confirm'}
                             </button>
                         </div>
                     </div>
                 </div>
             </div>
        )}
    </div>
  );
};
