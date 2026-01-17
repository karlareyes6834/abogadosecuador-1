
import React from 'react';
import { User } from '../types';
import { Copy, Gift, Users } from './Icons';

interface ReferralsProps {
  user: User;
}

export const Referrals: React.FC<ReferralsProps> = ({ user }) => {
  const refLink = `https://wiglobal.io/register?ref=${user.id.substring(2)}`;

  const copyLink = () => {
      navigator.clipboard.writeText(refLink);
      alert("Enlace copiado al portapapeles");
  };

  return (
    <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold mb-2">Programa de Afiliados WI</h2>
                <p className="text-orange-100 mb-6">Invita amigos y gana hasta el 40% de comisiones sobre sus operaciones de trading para siempre.</p>
                
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-orange-200 uppercase font-bold">Tu Enlace de Referido</label>
                        <div className="flex items-center bg-black/20 rounded mt-1 px-3 py-2">
                            <input type="text" value={refLink} readOnly className="bg-transparent border-none text-white text-sm w-full outline-none font-mono" />
                            <button onClick={copyLink} className="ml-2 text-white hover:text-orange-200"><Copy className="w-4 h-4"/></button>
                        </div>
                    </div>
                    <div className="flex space-x-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">20%</div>
                            <div className="text-[10px] text-orange-200 uppercase">Comisión Base</div>
                        </div>
                        <div className="w-px bg-white/20 h-10"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">0</div>
                            <div className="text-[10px] text-orange-200 uppercase">Amigos</div>
                        </div>
                    </div>
                </div>
            </div>
            <Gift className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-10 rotate-12" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Ganancias Totales</h3>
                <p className="text-3xl font-bold text-white">0.00 <span className="text-sm text-slate-500">USDT</span></p>
            </div>
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Referidos Activos</h3>
                <p className="text-3xl font-bold text-white">0</p>
            </div>
            <div className="bg-nexus-800 p-6 rounded-xl border border-nexus-700">
                <h3 className="text-slate-400 text-xs font-bold uppercase mb-2">Rango Actual</h3>
                <p className="text-3xl font-bold text-nexus-accent">Bronce</p>
            </div>
        </div>

        <div className="bg-nexus-800 rounded-xl border border-nexus-700 overflow-hidden">
            <div className="p-4 border-b border-nexus-700 font-bold text-white">Historial de Comisiones</div>
            <div className="p-8 text-center text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Aún no tienes referidos. ¡Comparte tu enlace!</p>
            </div>
        </div>
    </div>
  );
};
