
import React, { useState, useEffect } from 'react';
import { Landmark, ArrowRight, TrendingUp, ShieldCheck, Globe, Users, Phone, Apple, PlayStore, Facebook, Twitter, Instagram, Linkedin, Rocket, Download } from './Icons';
import { fetchLivePrices, PRICES } from '../services/api';

interface LandingProps {
  onLoginClick: () => void;
  onTradeClick: (symbol: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onTradeClick }) => {
  const [prices, setPrices] = useState(PRICES);

  useEffect(() => {
    const interval = setInterval(async () => {
      const p = await fetchLivePrices();
      setPrices({ ...p });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const topAssets = ['BTC', 'ETH', 'SOL', 'BNB', 'XRP'];

  return (
    <div className="min-h-screen bg-nexus-900 text-white font-sans overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-nexus-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">WI Global</span>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm font-bold text-slate-300">
            <a href="#" className="hover:text-white transition">Exchange</a>
            <a href="#" className="hover:text-white transition">Web3 Wallet</a>
            <a href="#" className="hover:text-white transition">Institutional</a>
            <a href="#" className="hover:text-white transition">Learn</a>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={onLoginClick} className="text-sm font-bold hover:text-blue-400 transition">Log In</button>
            <button onClick={onLoginClick} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-sm shadow-lg shadow-blue-900/20 transition transform hover:scale-105">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center space-x-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Rocket className="w-4 h-4" /> <span>V2.0 is Live</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Digital Finance</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg">
              Trade 500+ assets with institutional-grade liquidity, zero-fee P2P, and high-yield vaults.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onLoginClick} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-lg shadow-xl shadow-blue-900/20 transition flex items-center justify-center">
                Start Trading Now <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="px-8 py-4 bg-nexus-800 hover:bg-nexus-700 border border-white/10 rounded-xl font-bold text-lg transition flex items-center justify-center">
                <Download className="w-5 h-5 mr-2" /> Download App
              </button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-green-500" /> Audited 100% Reserves</span>
              <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-blue-500" /> 12M+ Users</span>
            </div>
          </div>
          
          {/* Hero Visual / Ticker */}
          <div className="relative animate-in slide-in-from-right duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl rounded-full" />
            <div className="bg-nexus-800/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Market Trends</h3>
                <span className="text-xs font-bold text-green-400 animate-pulse">● Live Updates</span>
              </div>
              <div className="space-y-4">
                {topAssets.map(asset => {
                  const price = prices[asset] || 0;
                  const change = (Math.random() * 5) - 2; // Sim
                  return (
                    <div key={asset} onClick={() => onTradeClick(asset)} className="flex items-center justify-between p-4 bg-nexus-900/50 hover:bg-white/5 rounded-xl border border-white/5 cursor-pointer transition group">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                          {asset[0]}
                        </div>
                        <div>
                          <div className="font-bold">{asset}</div>
                          <div className="text-xs text-slate-400">USDT</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold">${price.toLocaleString()}</div>
                        <div className={`text-xs font-bold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(2)}%
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="py-20 bg-nexus-800/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Financial Ecosystem</h2>
            <p className="text-slate-400">Everything you need to manage your digital assets, from spot trading to high-yield savings.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-nexus-900/50 border border-white/10 rounded-3xl hover:border-blue-500/50 transition group">
              <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Advanced Exchange</h3>
              <p className="text-slate-400 leading-relaxed">
                Spot, Margin, and Futures trading with up to 100x leverage. Professional charting tools and deep liquidity.
              </p>
            </div>
            <div className="p-8 bg-nexus-900/50 border border-white/10 rounded-3xl hover:border-purple-500/50 transition group">
              <div className="w-14 h-14 bg-purple-600/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global P2P & Fiat</h3>
              <p className="text-slate-400 leading-relaxed">
                Buy and sell crypto with 50+ fiat currencies via Bank Transfer, PayPal, and more. 0% fees for verified merchants.
              </p>
            </div>
            <div className="p-8 bg-nexus-900/50 border border-white/10 rounded-3xl hover:border-green-500/50 transition group">
              <div className="w-14 h-14 bg-green-600/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Vaults</h3>
              <p className="text-slate-400 leading-relaxed">
                Earn up to 20% APY on your idle assets. Flexible and fixed-term staking with daily payouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Trade Anywhere, Anytime</h2>
            <p className="text-blue-100 text-lg mb-8">
              Get the full WI Global experience on your phone. Real-time alerts, instant deposits, and secure wallet management.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center bg-black hover:bg-slate-900 text-white px-6 py-3 rounded-xl transition">
                <Apple className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="text-[10px] uppercase">Download on the</div>
                  <div className="font-bold leading-none">App Store</div>
                </div>
              </button>
              <button className="flex items-center bg-black hover:bg-slate-900 text-white px-6 py-3 rounded-xl transition">
                <PlayStore className="w-6 h-6 mr-3" />
                <div className="text-left">
                  <div className="text-[10px] uppercase">Get it on</div>
                  <div className="font-bold leading-none">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          
          <div className="hidden md:block relative z-10">
             {/* Mock Phone Visual */}
             <div className="w-64 h-[500px] bg-nexus-900 border-8 border-nexus-800 rounded-[3rem] shadow-2xl relative overflow-hidden transform rotate-6 hover:rotate-0 transition duration-500">
                 <div className="absolute top-0 left-0 right-0 h-full bg-nexus-900 p-4">
                     <div className="w-full h-8 bg-nexus-800 rounded-full mb-4"></div>
                     <div className="space-y-2">
                         <div className="h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl"></div>
                         <div className="h-12 bg-nexus-800 rounded-xl"></div>
                         <div className="h-12 bg-nexus-800 rounded-xl"></div>
                     </div>
                 </div>
             </div>
          </div>
          
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-nexus-950 border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Landmark className="w-6 h-6 text-blue-500" />
              <span className="text-xl font-bold">WI Global</span>
            </div>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Building the future of decentralized finance with trust, transparency, and technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-600 transition text-slate-400 hover:text-white"><Facebook className="w-4 h-4"/></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-400 transition text-slate-400 hover:text-white"><Twitter className="w-4 h-4"/></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-pink-600 transition text-slate-400 hover:text-white"><Instagram className="w-4 h-4"/></a>
              <a href="#" className="p-2 bg-white/5 rounded-full hover:bg-blue-700 transition text-slate-400 hover:text-white"><Linkedin className="w-4 h-4"/></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Markets</a></li>
              <li><a href="#" className="hover:text-blue-400">Exchange</a></li>
              <li><a href="#" className="hover:text-blue-400">Earn</a></li>
              <li><a href="#" className="hover:text-blue-400">Institutional</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
              <li><a href="#" className="hover:text-blue-400">API Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400">Fees</a></li>
              <li><a href="#" className="hover:text-blue-400">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-blue-400">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400">Legal</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-slate-600">
          <p>© 2024 WI Global. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Cookie Preferences</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
