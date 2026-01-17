import React, { useState, useEffect } from 'react';
import { TraderProfile, CopyPosition, Challenge, CopySettings, SocialPost } from '../types';
import { WalletService } from '../services/api';
import { Users, TrendingUp, ShieldCheck, Copy, Trophy, Medal, Target, Zap, BookOpen, ShieldAlert, CheckCircle, Info, Briefcase, MessageCircle, Heart, Share2, UserPlus, Send } from './Icons';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface CopyTradingProps {
    onTransaction?: () => void;
}

export const CopyTrading: React.FC<CopyTradingProps> = ({ onTransaction }) => {
    const [traders, setTraders] = useState<TraderProfile[]>([]);
    const [myCopies, setMyCopies] = useState<CopyPosition[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [feed, setFeed] = useState<SocialPost[]>([]);
    const [activeTab, setActiveTab] = useState<'ELITE' | 'TRENDING' | 'SAFE' | 'FEED'>('ELITE');
    const [postInput, setPostInput] = useState('');
    
    // Modal State
    const [selectedTrader, setSelectedTrader] = useState<TraderProfile | null>(null);
    const [amount, setAmount] = useState('');
    const [copySettings, setCopySettings] = useState<CopySettings>({ mode: 'PROPORTIONAL', stopLossPercent: 20, takeProfitPercent: 50 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTraders(WalletService.getTraders());
        setMyCopies(WalletService.getCopyPositions());
        setChallenges(WalletService.getChallenges());
        setFeed(WalletService.getSocialFeed());
    }, []);

    const handleCopy = async () => {
        if(!selectedTrader || !amount) return;
        setLoading(true);
        try {
            await WalletService.copyTrader(selectedTrader.id, parseFloat(amount), copySettings);
            setMyCopies(WalletService.getCopyPositions());
            setSelectedTrader(null);
            setAmount('');
            if(onTransaction) onTransaction();
            alert(`Success! You are now copying ${selectedTrader.name}.`);
        } catch(e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = () => {
        if(!postInput) return;
        WalletService.postSocialUpdate(postInput);
        setFeed(WalletService.getSocialFeed());
        setPostInput('');
    };

    const getBadgeColor = (badge: string) => {
        if(badge === 'Whale' || badge === 'Elite') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
        if(badge === 'Safe Haven' || badge === 'Verified') return 'bg-green-500/20 text-green-400 border-green-500/30';
        if(badge === 'High Risk' || badge === 'Degen') return 'bg-red-500/20 text-red-400 border-red-500/30';
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* HERO SECTION */}
            <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90 z-0"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0"></div>
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-center">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 rounded-full px-4 py-1 text-xs font-bold text-indigo-200 mb-4 backdrop-blur-md">
                            <Zap className="w-3 h-3 text-yellow-400"/> <span>New Season Live</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            Copy Trading <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Arena</span>
                        </h1>
                        <p className="text-indigo-200 text-lg mb-8 max-w-lg">
                            Mirror top institutional traders automatically. Join challenges, earn badges, and multiply your portfolio.
                        </p>
                        <div className="flex space-x-4">
                            <button className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg flex items-center">
                                <Trophy className="w-5 h-5 mr-2 text-yellow-600"/> Leaderboards
                            </button>
                            <button className="bg-indigo-800/50 text-white border border-indigo-400/30 px-6 py-3 rounded-xl font-bold hover:bg-indigo-800 transition flex items-center backdrop-blur-sm">
                                <BookOpen className="w-5 h-5 mr-2"/> How it works
                            </button>
                        </div>
                    </div>
                    
                    {/* CHALLENGES CARD */}
                    <div className="w-full md:w-80 mt-8 md:mt-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                        <h3 className="text-white font-bold flex items-center mb-4"><Target className="w-5 h-5 mr-2 text-red-400"/> Active Challenges</h3>
                        <div className="space-y-3">
                            {challenges.map(ch => (
                                <div key={ch.id} className="bg-black/20 p-3 rounded-xl border border-white/5 hover:border-white/20 transition cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition">{ch.title}</span>
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded border border-green-500/30">{ch.reward}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 line-clamp-1 mb-2">{ch.description}</p>
                                    <div className="flex justify-between text-[10px] text-slate-500">
                                        <span><Users className="w-3 h-3 inline mr-1"/>{ch.participants} joined</span>
                                        <span className="text-yellow-500">{ch.timeLeft} left</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* MY PORTFOLIO */}
            {myCopies.length > 0 && (
                <div className="bg-nexus-800/50 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                    <h3 className="font-bold text-white mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-blue-400"/> My Copy Portfolio</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myCopies.map(cp => (
                            <div key={cp.id} className="bg-nexus-900 rounded-xl p-4 border border-white/5 hover:border-white/20 transition group">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="font-bold text-white">{cp.traderName}</div>
                                    <div className="text-green-400 font-mono font-bold bg-green-900/20 px-2 py-1 rounded text-xs">+12.5%</div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-400 mb-4">
                                    <div>
                                        <span className="block text-[10px] uppercase">Invested</span>
                                        <span className="text-white font-mono text-sm">${cp.allocatedAmount}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[10px] uppercase">Current</span>
                                        <span className="text-white font-mono text-sm">${cp.currentValue}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-1.5 bg-nexus-800 text-xs font-bold text-slate-300 rounded hover:bg-nexus-700 transition">Add Funds</button>
                                    <button className="flex-1 py-1.5 bg-red-900/20 text-xs font-bold text-red-400 rounded hover:bg-red-900/40 border border-red-900/30 transition">Stop</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* NAVIGATION TABS */}
            <div className="flex space-x-2 bg-nexus-800 p-1 rounded-xl border border-white/5 w-fit">
                <button onClick={() => setActiveTab('ELITE')} className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center ${activeTab==='ELITE'?'bg-blue-600 text-white shadow':'text-slate-400 hover:text-white'}`}><Medal className="w-4 h-4 mr-2"/> Elite</button>
                <button onClick={() => setActiveTab('TRENDING')} className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center ${activeTab==='TRENDING'?'bg-blue-600 text-white shadow':'text-slate-400 hover:text-white'}`}><TrendingUp className="w-4 h-4 mr-2"/> Trending</button>
                <button onClick={() => setActiveTab('SAFE')} className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center ${activeTab==='SAFE'?'bg-blue-600 text-white shadow':'text-slate-400 hover:text-white'}`}><ShieldCheck className="w-4 h-4 mr-2"/> Safe Haven</button>
                <button onClick={() => setActiveTab('FEED')} className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center ${activeTab==='FEED'?'bg-purple-600 text-white shadow':'text-slate-400 hover:text-white'}`}><MessageCircle className="w-4 h-4 mr-2"/> Social Feed</button>
            </div>

            {/* TRADER GRID */}
            {activeTab !== 'FEED' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {traders.map(t => (
                        <div key={t.id} className="bg-nexus-800/80 backdrop-blur rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition duration-300 group flex flex-col">
                            {/* Card Header */}
                            <div className="p-5 border-b border-white/5 relative">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {t.name[0]}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 bg-nexus-900 rounded-full p-0.5">
                                            <div className={`w-4 h-4 rounded-full border-2 border-nexus-900 ${t.riskScore < 5 ? 'bg-green-500' : t.riskScore < 8 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <div className="text-2xl font-bold text-green-400">+{t.roi}%</div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">30d Return</div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition">{t.name}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col space-y-4">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {t.badges.map(b => (
                                        <span key={b} className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getBadgeColor(b)}`}>{b}</span>
                                    ))}
                                </div>

                                {/* Simulated Sparkline */}
                                <div className="h-16 w-full opacity-50 grayscale group-hover:grayscale-0 transition duration-500">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={t.chartHistory.map((v, i) => ({ v, i }))}>
                                            <defs>
                                                <linearGradient id={`grad-${t.id}`} x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} fill={`url(#grad-${t.id})`} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="bg-white/5 rounded-lg p-2">
                                        <span className="text-slate-500 block">Win Rate</span>
                                        <span className="text-white font-bold text-sm">{t.winRate}%</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2">
                                        <span className="text-slate-500 block">Copiers</span>
                                        <span className="text-white font-bold text-sm">{t.followers}</span>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2 col-span-2 flex justify-between items-center">
                                        <span className="text-slate-500">AUM</span>
                                        <span className="text-white font-bold font-mono">${t.aum.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setSelectedTrader(t)}
                                    className="w-full py-3 mt-auto bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition transform active:scale-95 flex items-center justify-center"
                                >
                                    <Copy className="w-4 h-4 mr-2"/> Copy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* SOCIAL FEED */}
            {activeTab === 'FEED' && (
                <div className="max-w-2xl mx-auto space-y-6">
                    {/* Create Post */}
                    <div className="bg-nexus-800 p-4 rounded-2xl border border-white/10">
                        <textarea 
                            value={postInput}
                            onChange={e => setPostInput(e.target.value)}
                            placeholder="Share your trading insights..."
                            className="w-full bg-nexus-900 border border-white/10 rounded-xl p-3 text-white text-sm outline-none resize-none focus:border-blue-500 mb-3"
                            rows={3}
                        />
                        <div className="flex justify-end">
                            <button onClick={handlePost} disabled={!postInput} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-50 hover:bg-blue-500 transition">
                                Post Update
                            </button>
                        </div>
                    </div>

                    {/* Feed Stream */}
                    <div className="space-y-4">
                        {feed.map(post => (
                            <div key={post.id} className="bg-nexus-800 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white mr-3">
                                            {post.userName[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{post.userName}</h4>
                                            <span className="text-xs text-slate-500">{new Date(post.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <button className="text-blue-400 text-xs font-bold border border-blue-500/30 px-3 py-1 rounded-full hover:bg-blue-500/10 flex items-center"><UserPlus className="w-3 h-3 mr-1"/> Follow</button>
                                </div>
                                <p className="text-slate-300 text-sm mb-4 leading-relaxed">{post.content}</p>
                                <div className="flex space-x-6 text-slate-500 text-xs font-bold">
                                    <button className="flex items-center hover:text-red-400 transition"><Heart className="w-4 h-4 mr-1"/> {post.likes}</button>
                                    <button className="flex items-center hover:text-blue-400 transition"><MessageCircle className="w-4 h-4 mr-1"/> Comment</button>
                                    <button className="flex items-center hover:text-green-400 transition"><Share2 className="w-4 h-4 mr-1"/> Share</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ADVANCED COPY MODAL */}
            {selectedTrader && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-nexus-800 rounded-3xl max-w-md w-full border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-900 to-nexus-900 p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                Copy {selectedTrader.name}
                                {selectedTrader.badges.includes('Verified') && <CheckCircle className="w-5 h-5 ml-2 text-blue-400"/>}
                            </h3>
                            <div className="flex mt-2 space-x-4 text-sm text-blue-200">
                                <span>Risk: {selectedTrader.riskScore}/10</span>
                                <span>•</span>
                                <span>ROI: {selectedTrader.roi}%</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Amount Input */}
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Investment Amount (USDT)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)}
                                        className="w-full bg-nexus-900 border border-white/10 rounded-xl p-4 text-white font-bold text-lg outline-none focus:border-blue-500 transition"
                                        placeholder="Min 100.00"
                                    />
                                    <span className="absolute right-4 top-5 text-xs font-bold text-slate-500">USDT</span>
                                </div>
                            </div>

                            {/* Advanced Settings */}
                            <div className="bg-nexus-900/50 rounded-xl p-4 border border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-white flex items-center"><ShieldAlert className="w-4 h-4 mr-2 text-yellow-500"/> Risk Settings</h4>
                                    <span className="text-[10px] text-blue-400 cursor-pointer hover:underline">Reset Default</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Stop Loss %</label>
                                        <input 
                                            type="number" 
                                            value={copySettings.stopLossPercent} 
                                            onChange={e => setCopySettings({...copySettings, stopLossPercent: parseFloat(e.target.value)})}
                                            className="w-full bg-nexus-800 border border-white/10 rounded-lg p-2 text-white text-sm outline-none text-right"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Take Profit %</label>
                                        <input 
                                            type="number" 
                                            value={copySettings.takeProfitPercent} 
                                            onChange={e => setCopySettings({...copySettings, takeProfitPercent: parseFloat(e.target.value)})}
                                            className="w-full bg-nexus-800 border border-white/10 rounded-lg p-2 text-white text-sm outline-none text-right"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-bold block mb-2">Copy Mode</label>
                                    <div className="flex bg-nexus-800 p-1 rounded-lg">
                                        <button onClick={() => setCopySettings({...copySettings, mode: 'PROPORTIONAL'})} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition ${copySettings.mode==='PROPORTIONAL'?'bg-blue-600 text-white shadow':'text-slate-500 hover:text-white'}`}>Proportional</button>
                                        <button onClick={() => setCopySettings({...copySettings, mode: 'FIXED_AMOUNT'})} className={`flex-1 py-1.5 text-[10px] font-bold rounded transition ${copySettings.mode==='FIXED_AMOUNT'?'bg-blue-600 text-white shadow':'text-slate-500 hover:text-white'}`}>Fixed</button>
                                    </div>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="flex items-start p-3 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
                                <Info className="w-4 h-4 text-yellow-500 mr-2 shrink-0 mt-0.5"/>
                                <p className="text-[10px] text-yellow-200/80 leading-relaxed">
                                    Past performance is not indicative of future results. Copy trading involves high risk. Ensure your stop loss is set correctly.
                                </p>
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <button onClick={() => setSelectedTrader(null)} className="flex-1 py-3.5 bg-nexus-700 hover:bg-nexus-600 text-slate-200 rounded-xl font-bold transition">Cancel</button>
                                <button onClick={handleCopy} disabled={loading} className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition">
                                    {loading ? 'Processing...' : 'Confirm Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};