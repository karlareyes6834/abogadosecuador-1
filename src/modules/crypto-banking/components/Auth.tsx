
import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { User } from '../types';
import { ShieldCheck, ArrowRightLeft } from './Icons';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user;
      if (isLogin) {
        user = await AuthService.login(email, password);
      } else {
        user = await AuthService.register(email, password, name);
      }
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nexus-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-nexus-800 rounded-2xl border border-nexus-700 shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
              <span className="font-bold text-2xl text-white">N</span>
           </div>
           <h1 className="text-2xl font-bold text-white">NexusFi Access</h1>
           <p className="text-slate-400 text-sm mt-1">Institutional-Grade Crypto Platform</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white focus:border-nexus-accent outline-none transition"
                placeholder="John Doe"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white focus:border-nexus-accent outline-none transition"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-nexus-900 border border-nexus-600 rounded-lg p-3 text-white focus:border-nexus-accent outline-none transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-nexus-accent hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              isLogin ? 'Secure Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-nexus-700">
          <p className="text-slate-400 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-nexus-accent hover:text-white font-medium transition"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="mt-8 flex justify-center space-x-4 text-xs text-slate-500">
          <div className="flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1" /> SOC2 Compliant
          </div>
          <div className="flex items-center">
            <ArrowRightLeft className="w-3 h-3 mr-1" /> 256-bit Encryption
          </div>
        </div>
      </div>
    </div>
  );
};
