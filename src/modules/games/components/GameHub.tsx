import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameDash } from './GameDash';
import { GameLawTrial } from './GameLawTrial';

interface GameHubProps {
  onRestartIntro: () => void;
}

type ActiveGame = 'none' | 'dash' | 'law';

export const GameHub: React.FC<GameHubProps> = ({ onRestartIntro }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {activeGame === 'none' && (
          <motion.div
            key="hub-menu"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col items-center gap-6 px-4"
          >
            <div className="text-center mt-4">
              <h1 className="text-xl md:text-2xl font-['Orbitron'] tracking-[0.4em] text-cyan-100 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]">
                WILEX GAME STATION
              </h1>
              <p className="mt-2 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.3em] text-slate-300/90">
                CENTRAL HUB · RETRO NEON · TRAINING + ARCADE
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              <button
                onClick={() => setActiveGame('dash')}
                className="relative overflow-hidden rounded-2xl border border-cyan-500/60 bg-slate-950/60 backdrop-blur-2xl p-4 text-left shadow-[0_0_28px_rgba(34,211,238,0.6)] hover:bg-slate-900/80 transition-colors"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.5),transparent_55%)] opacity-80" />
                <div className="relative flex flex-col gap-2">
                  <span className="text-[10px] font-['Share_Tech_Mono'] tracking-[0.4em] text-cyan-200">
                    TRIAL 01
                  </span>
                  <h2 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-white">
                    GEOMETRY TRIAL
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-200/90">
                    Esquiva obstáculos con hasta tres saltos encadenados. Ritmo, precisión y reflejos.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveGame('law')}
                className="relative overflow-hidden rounded-2xl border border-purple-500/60 bg-slate-950/60 backdrop-blur-2xl p-4 text-left shadow-[0_0_28px_rgba(168,85,247,0.7)] hover:bg-slate-900/80 transition-colors"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(147,51,234,0.5),transparent_55%)] opacity-80" />
                <div className="relative flex flex-col gap-2">
                  <span className="text-[10px] font-['Share_Tech_Mono'] tracking-[0.4em] text-purple-200">
                    TRIAL 02
                  </span>
                  <h2 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-white">
                    JUSTICE MODULE
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-200/90">
                    Resuelve microcasos sobre igualdad, reglas claras y derecho a ser oído.
                  </p>
                </div>
              </button>

              <div className="relative overflow-hidden rounded-2xl border border-slate-600/60 bg-slate-950/40 backdrop-blur-2xl p-4 text-left">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.4),transparent_55%)] opacity-80" />
                <div className="relative flex flex-col gap-2">
                  <span className="text-[10px] font-['Share_Tech_Mono'] tracking-[0.4em] text-slate-200">
                    SYSTEM
                  </span>
                  <h2 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-slate-50">
                    INTRO / REBOOT
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-200/80">
                    Vuelve a vivir la secuencia cinematográfica de encendido de WilexGameStation.
                  </p>
                  <button
                    onClick={onRestartIntro}
                    className="mt-2 inline-flex items-center justify-center px-3 py-1 rounded-full border border-slate-400/80 bg-black/50 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.3em] text-slate-100 hover:bg-slate-700/60"
                  >
                    RUN INTRO
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between w-full max-w-4xl text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-slate-400/90">
              <span>WGS · HUB JUGABLE · ESTE MÓDULO NO ES ASESORÍA LEGAL REAL</span>
              <span>ONLINE STATUS · LOCAL</span>
            </div>
          </motion.div>
        )}

        {activeGame === 'dash' && (
          <motion.div
            key="hub-dash"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameDash onExit={() => setActiveGame('none')} />
          </motion.div>
        )}

        {activeGame === 'law' && (
          <motion.div
            key="hub-law"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameLawTrial onExit={() => setActiveGame('none')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
