import React from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: { tokens: number; xp: number };
  condition: (profile: any) => boolean;
}

const MISSIONS: Mission[] = [
  {
    id: 'geometry-300',
    title: 'SPEED TRIAL',
    description: 'Reach score 300 in Geometry Trial',
    reward: { tokens: 50, xp: 100 },
    condition: (p) => p.geometryBestScore >= 300,
  },
  {
    id: 'geometry-600',
    title: 'MASTER RUNNER',
    description: 'Reach score 600 in Geometry Trial',
    reward: { tokens: 100, xp: 200 },
    condition: (p) => p.geometryBestScore >= 600,
  },
  {
    id: 'justice-perfect',
    title: 'PERFECT JUSTICE',
    description: 'Solve all Justice Module cases correctly',
    reward: { tokens: 150, xp: 300 },
    condition: (p) => p.justiceBestScore >= 8,
  },
  {
    id: 'level-5',
    title: 'RISING STAR',
    description: 'Reach level 5',
    reward: { tokens: 75, xp: 150 },
    condition: (p) => p.level >= 5,
  },
  {
    id: 'tokens-500',
    title: 'TOKEN COLLECTOR',
    description: 'Accumulate 500 tokens',
    reward: { tokens: 100, xp: 200 },
    condition: (p) => p.tokens >= 500,
  },
];

interface GameMissionsProps {
  onExit: () => void;
}

export const GameMissions: React.FC<GameMissionsProps> = ({ onExit }) => {
  const { profile } = usePlayer();

  const completedCount = MISSIONS.filter((m) => profile.completedMissions.includes(m.id)).length;
  const totalReward = MISSIONS.reduce((acc, m) => {
    if (profile.completedMissions.includes(m.id)) {
      return acc + m.reward.tokens;
    }
    return acc;
  }, 0);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none overflow-y-auto">
      <div className="mb-4 flex items-center justify-between w-full max-w-2xl px-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-purple-200">
        <span>WILEX // MISSIONS & QUESTS</span>
        <span>
          {completedCount}/{MISSIONS.length} COMPLETED
        </span>
      </div>

      {/* Resumen */}
      <div className="mb-4 w-full max-w-2xl px-4">
        <div className="relative rounded-xl border border-purple-500/50 bg-slate-950/70 backdrop-blur-xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.3),transparent_60%)]" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-[11px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-purple-200 mb-1">
                MISSION PROGRESS
              </div>
              <div className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-slate-300">
                Complete missions to earn bonus rewards
              </div>
            </div>
            <div className="text-right">
              <div className="text-[12px] md:text-sm font-['Orbitron'] tracking-[0.2em] text-emerald-300">
                {completedCount}/{MISSIONS.length}
              </div>
              <div className="text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-cyan-300">
                +{totalReward} TOKENS EARNED
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de misiones */}
      <div className="w-full max-w-2xl px-4 flex flex-col gap-2 mb-4">
        {MISSIONS.map((mission, idx) => {
          const isCompleted = profile.completedMissions.includes(mission.id);
          const isUnlocked = mission.condition(profile);

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative overflow-hidden rounded-lg border backdrop-blur-lg p-3 transition-colors ${
                isCompleted
                  ? 'border-emerald-400/70 bg-emerald-900/30 shadow-[0_0_16px_rgba(52,211,153,0.5)]'
                  : isUnlocked
                    ? 'border-cyan-500/50 bg-slate-900/60 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                    : 'border-slate-600/40 bg-slate-950/50 opacity-60'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.15),transparent_60%)]" />

              <div className="relative flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-[11px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-cyan-100 mb-1">
                    {mission.title}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-300/80">
                    {mission.description}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex gap-2 text-[9px] md:text-[10px] font-['Share_Tech_Mono']">
                    <span className="text-emerald-300">+{mission.reward.tokens} TOKENS</span>
                    <span className="text-cyan-300">+{mission.reward.xp} XP</span>
                  </div>
                  {isCompleted && (
                    <div className="text-[10px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-emerald-300">
                      ✓ DONE
                    </div>
                  )}
                  {!isCompleted && isUnlocked && (
                    <div className="text-[10px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-yellow-300">
                      ⚡ READY
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="text-[10px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-slate-400">
                      🔒 LOCKED
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Botón salir */}
      <div className="mt-4 flex gap-2">
        <button
          onClick={onExit}
          className="px-4 py-2 rounded-full border border-slate-500/60 bg-black/40 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-slate-100 hover:bg-slate-800/60"
        >
          BACK TO HUB
        </button>
      </div>
    </div>
  );
};
