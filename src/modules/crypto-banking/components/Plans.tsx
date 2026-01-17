
import React, { useState } from 'react';
import { User, UserTier, SubscriptionPlan } from '../types';
import { CheckCircle, Crown, Lock } from './Icons';
import { AuthService } from '../services/api';

interface PlansProps {
  user: User;
  onUpdate: () => void;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: 'STANDARD',
    name: 'Starter',
    price: 9.99,
    color: 'bg-slate-700',
    maxLeverage: 10,
    tradingFeeMaker: 0.1,
    tradingFeeTaker: 0.1,
    tradingFeeBinary: 0.1,
    features: ['Basic Trading Access', 'Standard Fees (0.1%)', '1H, 4H, 1D Timeframes', 'Email Support']
  },
  {
    id: 'GOLD',
    name: 'Pro Trader',
    price: 29.99,
    color: 'bg-yellow-600',
    maxLeverage: 50,
    tradingFeeMaker: 0.05,
    tradingFeeTaker: 0.07,
    tradingFeeBinary: 0.05,
    features: ['Everything in Starter', 'Reduced Fees', '1m, 5m, 15m Charts', 'Copy Trading', 'Priority Support', 'Heikin Ashi Charts']
  },
  {
    id: 'PLATINUM',
    name: 'Institutional',
    price: 99.99,
    color: 'bg-indigo-600',
    maxLeverage: 100,
    tradingFeeMaker: 0.0,
    tradingFeeTaker: 0.04,
    tradingFeeBinary: 0.0,
    features: ['Everything in Pro', '0% Maker Fees', 'HFT Data (1s, 3s)', 'API Key Access', 'Dedicated Manager', 'Arbitrage Bots', '100x Leverage']
  }
];

export const Plans: React.FC<PlansProps> = ({ user, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: UserTier, price: number) => {
      // Allow re-buying to extend or for demo purposes
      if(!window.confirm(`Confirm purchase of ${planId} plan for $${price}?`)) return;
      
      setLoading(true);
      try {
          await AuthService.upgradeTier(planId, price);
          alert(`Congratulations! You are now a ${planId} member.`);
          onUpdate();
      } catch (e: any) {
          alert("Error: " + e.message);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Professional Membership Plans</h2>
            <p className="text-slate-400">
                Unlock the full power of WI Global. Access institutional-grade tools, lower fees, and high-frequency real-time market data.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PLANS.map((plan) => {
                const isCurrent = user.tier === plan.id;
                // Simple check for upgrade path
                const planValue = plan.id === 'PLATINUM' ? 3 : plan.id === 'GOLD' ? 2 : 1;
                const userValue = user.tier === 'PLATINUM' ? 3 : user.tier === 'GOLD' ? 2 : 1;
                const isHigher = planValue > userValue;

                return (
                    <div key={plan.id} className={`relative rounded-2xl border ${isCurrent ? 'border-green-500 shadow-green-900/50 shadow-2xl scale-105 z-10' : 'border-nexus-700 bg-nexus-800'} overflow-hidden transition hover:border-nexus-500`}>
                        {isCurrent && (
                            <div className="absolute top-0 left-0 right-0 bg-green-600 text-white text-center text-xs font-bold py-1 uppercase tracking-wider">
                                Current Plan
                            </div>
                        )}
                        <div className={`p-6 ${isCurrent ? 'bg-nexus-900' : ''}`}>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.color} text-white shadow-lg`}>
                                <Crown className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                            <div className="flex items-baseline mt-2 mb-6">
                                <span className="text-3xl font-bold text-white">${plan.price}</span>
                                <span className="text-slate-500 ml-2">/ month</span>
                            </div>
                            
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, i) => (
                                    <li key={i} className="flex items-start text-sm text-slate-300">
                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 shrink-0 mt-0.5" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handleUpgrade(plan.id, plan.price)}
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold transition flex items-center justify-center ${
                                    isCurrent 
                                    ? 'bg-green-600/20 text-green-500 cursor-default'
                                    : 'bg-white text-nexus-900 hover:bg-slate-200 shadow-lg'
                                }`}
                            >
                                {isCurrent ? 'Active Plan' : 'Subscribe Now'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="bg-nexus-800 rounded-xl p-6 border border-nexus-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
                 <div className="p-3 bg-blue-600/20 text-blue-400 rounded-full"><Lock className="w-6 h-6"/></div>
                 <div>
                     <h3 className="text-white font-bold">Need Corporate API Access?</h3>
                     <p className="text-sm text-slate-400">For hedge funds and HFT firms exceeding 10M USD/month volume.</p>
                 </div>
            </div>
            <button className="px-6 py-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-600/10 font-bold text-sm">
                Contact Sales
            </button>
        </div>
    </div>
  );
};
