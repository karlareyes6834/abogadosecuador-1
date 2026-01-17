import React, { useState } from 'react';
import { UserSession } from '../types';
import { User, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      onLogin({
        name: name || 'Invitado',
        email: email,
        avatar: undefined
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Background with Blur - Monochrome */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center grayscale opacity-50"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl"></div>
      </div>

      <div className="relative w-full max-w-sm p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl animate-[fadeIn_0.5s_ease-out]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
             <User size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-sans font-bold text-white mb-1 tracking-tight">Bienvenido</h1>
          <p className="text-white/50 text-sm">Abogados OS Desktop</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
             <label className="text-xs text-white/70 ml-2 mb-1 block uppercase tracking-wider font-bold">Nombre</label>
             <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 transition-all"
              placeholder="Su nombre"
              required
            />
          </div>
          
          <div>
            <label className="text-xs text-white/50 ml-2 mb-1 block uppercase tracking-wider font-bold">Correo (Opcional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:bg-white/10 transition-all"
              placeholder="cliente@ejemplo.com"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group mt-6"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-gray-400 border-t-black rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Ingresar</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};