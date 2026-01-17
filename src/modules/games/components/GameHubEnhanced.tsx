import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameDashEnhanced } from './GameDashEnhanced';
import { GameLawTrialEnhanced } from './GameLawTrialEnhanced';
import { GameStore } from './GameStore';
import { GameMissions } from './GameMissions';
import { GameSpaceShooter } from './GameSpaceShooter';
import { usePlayer } from '../contexts/PlayerContext';

type ActiveView = 'menu' | 'dash' | 'law' | 'space' | 'store' | 'missions' | 'difficulty';
type Difficulty = 'easy' | 'normal' | 'hard';

interface GameHubEnhancedProps {
  onRestartIntro: () => void;
}

export const GameHubEnhanced: React.FC<GameHubEnhancedProps> = ({ onRestartIntro }) => {
  const { profile } = usePlayer();
  const [activeView, setActiveView] = useState<ActiveView>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  const handleSelectDifficulty = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    setActiveView('dash');
  };

  return (
    <div className="absolute inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {/* MENÚ PRINCIPAL */}
        {activeView === 'menu' && (
          <motion.div
            key="hub-menu"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-5xl flex flex-col items-center gap-6 px-4"
          >
            {/* Cabecera con perfil */}
            <div className="text-center mt-4">
              <h1 className="text-xl md:text-2xl font-['Orbitron'] tracking-[0.4em] text-cyan-100 drop-shadow-[0_0_16px_rgba(34,211,238,0.8)]">
                WILEX GAME STATION
              </h1>
              <p className="mt-2 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.3em] text-slate-300/90">
                CENTRAL HUB · RETRO NEON · TRAINING + ARCADE
              </p>
            </div>

            {/* Barra de perfil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-2xl rounded-xl border border-purple-500/50 bg-slate-950/70 backdrop-blur-xl p-3 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.3),transparent_60%)]" />
              <div className="relative grid grid-cols-4 gap-2 text-center text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em]">
                <div>
                  <div className="text-cyan-300">LEVEL</div>
                  <div className="text-slate-100 font-bold">{profile.level}</div>
                </div>
                <div>
                  <div className="text-purple-300">XP</div>
                  <div className="text-slate-100 font-bold">{(profile.xp % 500).toString().padStart(3, '0')}</div>
                </div>
                <div>
                  <div className="text-emerald-300">TOKENS</div>
                  <div className="text-slate-100 font-bold">{profile.tokens.toString().padStart(4, '0')}</div>
                </div>
                <div>
                  <div className="text-yellow-300">BEST SCORE</div>
                  <div className="text-slate-100 font-bold">
                    {Math.max(profile.geometryBestScore, profile.justiceBestScore).toString().padStart(3, '0')}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid de opciones principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {/* GEOMETRY TRIAL */}
              <button
                onClick={() => setActiveView('difficulty')}
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
                    Esquiva obstáculos con hasta tres saltos. Easy / Normal / Hard.
                  </p>
                  <div className="mt-1 text-[9px] text-cyan-300">
                    Best: {profile.geometryBestScore}
                  </div>
                </div>
              </button>

              {/* JUSTICE MODULE */}
              <button
                onClick={() => setActiveView('law')}
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
                    Resuelve 8 microcasos sobre igualdad y derecho. Módulos progresivos.
                  </p>
                  <div className="mt-1 text-[9px] text-purple-300">
                    Best: {profile.justiceBestScore}/8
                  </div>
                </div>
              </button>

              {/* SPACE SHOOTER */}
              <button
                onClick={() => setActiveView('space')}
                className="relative overflow-hidden rounded-2xl border border-orange-500/60 bg-slate-950/60 backdrop-blur-2xl p-4 text-left shadow-[0_0_28px_rgba(249,115,22,0.6)] hover:bg-slate-900/80 transition-colors"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.5),transparent_55%)] opacity-80" />
                <div className="relative flex flex-col gap-2">
                  <span className="text-[10px] font-['Share_Tech_Mono'] tracking-[0.4em] text-orange-200">
                    TRIAL 03
                  </span>
                  <h2 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-white">
                    SPACE SHOOTER
                  </h2>
                  <p className="text-[10px] md:text-xs text-slate-200/90">
                    Defiende tu nave contra enemigos cósmicos. 3 niveles progresivos.
                  </p>
                  <div className="mt-1 text-[9px] text-orange-300">
                    Best: {profile.spaceBestScore}
                  </div>
                </div>
              </button>
            </div>

            {/* Botones secundarios */}
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => setActiveView('store')}
                className="px-4 py-2 rounded-full border border-emerald-500/60 bg-emerald-900/30 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-emerald-200 hover:bg-emerald-800/50"
              >
                🛍️ STORE
              </button>
              <button
                onClick={() => setActiveView('missions')}
                className="px-4 py-2 rounded-full border border-yellow-500/60 bg-yellow-900/30 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-yellow-200 hover:bg-yellow-800/50"
              >
                ⚡ MISSIONS
              </button>
              <button
                onClick={onRestartIntro}
                className="px-4 py-2 rounded-full border border-slate-500/60 bg-slate-900/30 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-slate-200 hover:bg-slate-800/50"
              >
                🔄 INTRO
              </button>
            </div>

            <div className="mb-4 flex items-center justify-between w-full max-w-4xl text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-slate-400/90">
              <span>WGS · HUB JUGABLE · TOKENS + COSMETICS + MISSIONS</span>
              <span>ONLINE STATUS · LOCAL</span>
            </div>
          </motion.div>
        )}

        {/* SELECTOR DE DIFICULTAD */}
        {activeView === 'difficulty' && (
          <motion.div
            key="difficulty-select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl flex flex-col items-center gap-4 px-4"
          >
            <div className="text-center">
              <h2 className="text-lg md:text-xl font-['Orbitron'] tracking-[0.3em] text-cyan-100 mb-2">
                SELECT DIFFICULTY
              </h2>
              <p className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-slate-300">
                Choose your challenge level
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {(['easy', 'normal', 'hard'] as const).map((diff) => {
                const colors = {
                  easy: { border: 'border-green-500/60', bg: 'bg-green-900/30', text: 'text-green-200' },
                  normal: { border: 'border-yellow-500/60', bg: 'bg-yellow-900/30', text: 'text-yellow-200' },
                  hard: { border: 'border-red-500/60', bg: 'bg-red-900/30', text: 'text-red-200' },
                };
                const c = colors[diff];

                return (
                  <button
                    key={diff}
                    onClick={() => handleSelectDifficulty(diff)}
                    className={`relative overflow-hidden rounded-xl border ${c.border} ${c.bg} backdrop-blur-xl p-4 text-left transition-colors hover:opacity-80`}
                  >
                    <div className="relative flex items-center justify-between">
                      <div>
                        <h3 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-white mb-1">
                          {diff.toUpperCase()}
                        </h3>
                        <p className="text-[10px] md:text-xs text-slate-200/80">
                          {diff === 'easy' && 'Slower speed, more time, fewer obstacles. Perfect for learning.'}
                          {diff === 'normal' && 'Balanced challenge. Standard rules and rewards.'}
                          {diff === 'hard' && 'Fast-paced action. High risk, high reward.'}
                        </p>
                      </div>
                      <div className={`text-[12px] md:text-sm font-['Orbitron'] tracking-[0.2em] ${c.text}`}>
                        {diff === 'easy' && '10 TOKENS'}
                        {diff === 'normal' && '25 TOKENS'}
                        {diff === 'hard' && '50 TOKENS'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveView('menu')}
              className="px-4 py-2 rounded-full border border-slate-500/60 bg-black/40 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-slate-100 hover:bg-slate-800/60"
            >
              BACK TO MENU
            </button>
          </motion.div>
        )}

        {/* GEOMETRY TRIAL */}
        {activeView === 'dash' && (
          <motion.div
            key="hub-dash"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameDashEnhanced difficulty={selectedDifficulty} onExit={() => setActiveView('menu')} />
          </motion.div>
        )}

        {/* JUSTICE MODULE */}
        {activeView === 'law' && (
          <motion.div
            key="hub-law"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameLawTrialEnhanced onExit={() => setActiveView('menu')} />
          </motion.div>
        )}

        {/* SPACE SHOOTER */}
        {activeView === 'space' && (
          <motion.div
            key="hub-space"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameSpaceShooter onExit={() => setActiveView('menu')} />
          </motion.div>
        )}

        {/* STORE */}
        {activeView === 'store' && (
          <motion.div
            key="hub-store"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameStore onExit={() => setActiveView('menu')} />
          </motion.div>
        )}

        {/* MISSIONS */}
        {activeView === 'missions' && (
          <motion.div
            key="hub-missions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameMissions onExit={() => setActiveView('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
