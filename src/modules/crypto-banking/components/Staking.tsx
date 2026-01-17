
import React, { useState, useEffect } from 'react';
import { WalletService } from '../services/api';
import { StakingPosition, FixedTermPlan, FixedInvestment } from '../types';
import { TrendingUp, Layers, Briefcase, Award, CheckCircle, Clock, Info, Shield, Lock } from './Icons';

interface StakingProps {
  onTransaction: () => void;
}

export const Staking: React.FC<StakingProps> = ({ onTransaction }) => {
  const [activeTab, setActiveTab] = useState<'PROJECTS' | 'VAULTS'>('PROJECTS');
  const [projectPlans, setProjectPlans] = useState<FixedTermPlan[]>([]);
  const [myInvestments, setMyInvestments] = useState<FixedInvestment[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<FixedTermPlan | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    setProjectPlans(WalletService.getFixedTermPlans());
    setMyInvestments(WalletService.getFixedInvestments());
  };

  const handleInvest = async () => {
      if(!selectedPlan) return;
      setLoading(true);
      try {
          await WalletService.investFixedTerm(selectedPlan.id, parseFloat(investAmount), 'USDT');
          setInvestAmount('');
          setSelectedPlan(null);
          refresh();
          onTransaction();
          alert("Successfully subscribed to " + selectedPlan.name);
      } catch (e: any) { alert(e.message); }
      finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-end mb-6">
           <div>
               <h2 className="text-3xl font-bold text-white mb-2">Institutional Earn</h2>
               <p className="text-slate-400">Fixed-term vaults and high-yield launchpad projects.</p>
           </div>
           <div className="flex bg-nexus-800 p-1 rounded-lg border border-nexus-700">
               <button onClick={()=>setActiveTab('PROJECTS')} className={`px-4 py-2 rounded text-sm font-bold transition ${activeTab==='PROJECTS'?'bg-blue-600 text-white shadow':'text-slate-400 hover:text-white'}`}>Launchpad</button>
               <button onClick={()=>setActiveTab('VAULTS')} className={`px-4 py-2 rounded text-sm font-bold transition ${activeTab==='VAULTS'?'bg-blue-600 text-white shadow':'text-slate-400 hover:text-white'}`}>My Vaults</button>
           </div>
       </div>

       {activeTab === 'VAULTS' && (
           <div className="grid gap-4">
               {myInvestments.map(inv => {
                   const accrued = WalletService.calculateAccruedInterest(inv);
                   const isMatured = inv.status === 'MATURED';
                   const timeLeft = new Date(inv.maturityDate).getTime() - Date.now();
                   const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

                   return (
                       <div key={inv.id} className="bg-nexus-800 p-6 rounded-xl border border-white/10 flex justify-between items-center shadow-lg relative overflow-hidden group">
                           {isMatured && <div className="absolute inset-0 bg-green-900/20 z-0"/>}
                           <div className="relative z-10">
                               <div className="flex items-center mb-2">
                                   <Lock className="w-4 h-4 text-slate-400 mr-2"/>
                                   <h3 className="font-bold text-white text-lg">{inv.planName}</h3>
                                   {isMatured && <span className="ml-3 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">MATURED - PAID</span>}
                               </div>
                               <div className="flex space-x-6 text-sm text-slate-400">
                                   <span>Principal: <span className="text-white font-mono">${inv.amount}</span></span>
                                   <span>Maturity: <span className="text-white">{new Date(inv.maturityDate).toLocaleDateString()}</span></span>
                               </div>
                           </div>
                           <div className="text-right relative z-10">
                               <div className="text-xs text-slate-500 uppercase font-bold mb-1">Accrued Interest</div>
                               <div className={`text-2xl font-mono font-bold ${isMatured ? 'text-green-400' : 'text-blue-400'}`}>
                                   +${accrued.toFixed(2)}
                               </div>
                               {!isMatured && <div className="text-xs text-yellow-500 mt-1">{daysLeft} days remaining</div>}
                           </div>
                       </div>
                   )
               })}
               {myInvestments.length === 0 && (
                   <div className="text-center p-12 bg-nexus-800/50 rounded-xl border border-white/5 text-slate-500">
                       <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-20"/>
                       No active vaults found.
                   </div>
               )}
           </div>
       )}

       {activeTab === 'PROJECTS' && (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {projectPlans.map(plan => {
                   const filledPct = (plan.poolFilled / plan.poolTotal) * 100;
                   return (
                       <div key={plan.id} className="bg-nexus-800 rounded-2xl border border-white/10 overflow-hidden hover:border-blue-500/50 transition group flex flex-col">
                           <div className={`h-2 ${plan.color} w-full`}></div>
                           <div className="p-6 flex-1 flex flex-col">
                               <div className="flex justify-between items-start mb-4">
                                   <div>
                                       <h3 className="font-bold text-white text-lg">{plan.name}</h3>
                                       <div className="flex items-center mt-1 space-x-2">
                                           <span className={`text-[10px] px-2 py-0.5 rounded border ${plan.risk==='Low'?'text-green-400 border-green-500/20 bg-green-500/10':'text-yellow-400 border-yellow-500/20 bg-yellow-500/10'}`}>{plan.risk} Risk</span>
                                           <span className="text-[10px] text-slate-400 border border-white/10 px-2 py-0.5 rounded">{plan.durationDays} Days</span>
                                       </div>
                                   </div>
                                   <div className="text-right">
                                       <div className="text-2xl font-bold text-green-400">{plan.apy}%</div>
                                       <div className="text-[10px] text-slate-500 uppercase font-bold">APY</div>
                                   </div>
                               </div>
                               
                               <p className="text-sm text-slate-400 mb-6 line-clamp-3">{plan.description}</p>
                               
                               <div className="mt-auto space-y-4">
                                   <div>
                                       <div className="flex justify-between text-xs mb-1">
                                           <span className="text-slate-500">Pool Filled</span>
                                           <span className="text-white font-bold">{filledPct.toFixed(1)}%</span>
                                       </div>
                                       <div className="w-full h-1.5 bg-nexus-900 rounded-full overflow-hidden">
                                           <div className={`h-full ${plan.color}`} style={{width: `${filledPct}%`}}></div>
                                       </div>
                                   </div>
                                   <button onClick={()=>setSelectedPlan(plan)} className="w-full py-3 bg-nexus-700 hover:bg-white hover:text-nexus-900 text-white font-bold rounded-xl transition shadow-lg">
                                       Invest Now
                                   </button>
                               </div>
                           </div>
                       </div>
                   )
               })}
           </div>
       )}

       {selectedPlan && (
           <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
               <div className="bg-nexus-800 rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl animate-in zoom-in duration-200">
                   <h3 className="text-xl font-bold text-white mb-2">Subscribe to Vault</h3>
                   <div className="bg-nexus-900/50 p-4 rounded-xl border border-white/5 mb-4">
                       <div className="flex justify-between mb-2"><span className="text-slate-400">Project</span> <span className="text-white font-bold">{selectedPlan.name}</span></div>
                       <div className="flex justify-between mb-2"><span className="text-slate-400">APY</span> <span className="text-green-400 font-bold">{selectedPlan.apy}%</span></div>
                       <div className="flex justify-between"><span className="text-slate-400">Lock Period</span> <span className="text-white">{selectedPlan.durationDays} Days</span></div>
                   </div>
                   
                   <div className="mb-6">
                       <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Amount (USDT)</label>
                       <input type="number" value={investAmount} onChange={e=>setInvestAmount(e.target.value)} className="w-full bg-nexus-900 border border-white/10 rounded-lg p-3 text-white font-bold text-lg outline-none focus:border-blue-500" placeholder={`Min ${selectedPlan.minAmount}`}/>
                   </div>

                   <div className="flex gap-3">
                       <button onClick={()=>setSelectedPlan(null)} className="flex-1 py-3 text-slate-400 font-bold hover:text-white">Cancel</button>
                       <button onClick={handleInvest} disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg">Confirm</button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
