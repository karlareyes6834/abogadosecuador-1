import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';

interface CosmeticItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'cube' | 'pattern' | 'theme';
  preview: string;
}

const COSMETICS: CosmeticItem[] = [
  {
    id: 'default',
    name: 'CLASSIC CUBE',
    description: 'El cubo original de Wilex.',
    cost: 0,
    category: 'cube',
    preview: 'from-cyan-400 to-purple-500',
  },
  {
    id: 'gold-cube',
    name: 'GOLDEN TRIAL',
    description: 'Cubo dorado para ganadores.',
    cost: 50,
    category: 'cube',
    preview: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'neon-pink',
    name: 'NEON PINK',
    description: 'Cubo rosa neón vibrante.',
    cost: 40,
    category: 'cube',
    preview: 'from-pink-400 to-rose-600',
  },
  {
    id: 'emerald-cube',
    name: 'EMERALD JUSTICE',
    description: 'Cubo verde esmeralda para justicia.',
    cost: 45,
    category: 'cube',
    preview: 'from-emerald-400 to-green-600',
  },
  {
    id: 'pattern-dots',
    name: 'DOT PATTERN',
    description: 'Patrón de puntos retro.',
    cost: 25,
    category: 'pattern',
    preview: 'radial-gradient(circle, rgba(255,255,255,0.3) 20%, transparent 20%)',
  },
  {
    id: 'pattern-grid',
    name: 'GRID PATTERN',
    description: 'Patrón de rejilla clásica.',
    cost: 30,
    category: 'pattern',
    preview: 'linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
  },
  {
    id: 'theme-dark',
    name: 'DARK MODE',
    description: 'Tema oscuro premium.',
    cost: 60,
    category: 'theme',
    preview: 'from-slate-900 to-black',
  },
  {
    id: 'theme-light',
    name: 'LIGHT MODE',
    description: 'Tema claro futurista.',
    cost: 60,
    category: 'theme',
    preview: 'from-slate-100 to-white',
  },
];

interface GameStoreProps {
  onExit: () => void;
}

export const GameStore: React.FC<GameStoreProps> = ({ onExit }) => {
  const { profile, purchaseCosmetic, setActiveCosmetic } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<'cube' | 'pattern' | 'theme'>('cube');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const filtered = COSMETICS.filter((c) => c.category === selectedCategory);

  const handlePurchase = (item: CosmeticItem) => {
    if (profile.ownedCosmetics.includes(item.id)) {
      setActiveCosmetic(item.id);
      setPurchaseMessage(`✓ ${item.name} ACTIVATED`);
      playRetroSound('COIN');
    } else if (profile.tokens >= item.cost) {
      const success = purchaseCosmetic(item.id, item.cost);
      if (success) {
        setActiveCosmetic(item.id);
        setPurchaseMessage(`✓ ${item.name} PURCHASED & ACTIVATED`);
        playRetroSound('POWERUP');
      }
    } else {
      setPurchaseMessage(`✗ NOT ENOUGH TOKENS`);
      playRetroSound('EXPLOSION');
    }
    setTimeout(() => setPurchaseMessage(null), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none overflow-y-auto">
      <div className="mb-4 flex items-center justify-between w-full max-w-4xl px-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-cyan-200">
        <span>WILEX // COSMETICS STORE</span>
        <span>BALANCE: {profile.tokens.toString().padStart(4, '0')} TOKENS</span>
      </div>

      {/* Categorías */}
      <div className="mb-4 flex gap-2">
        {(['cube', 'pattern', 'theme'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full border text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] transition-colors ${
              selectedCategory === cat
                ? 'border-cyan-400/80 bg-cyan-500/30 text-cyan-100'
                : 'border-slate-500/60 bg-black/40 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid de cosméticos */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-4 mb-4">
        {filtered.map((item) => {
          const isOwned = profile.ownedCosmetics.includes(item.id);
          const isActive = profile.activeCosmetic === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative overflow-hidden rounded-xl border backdrop-blur-xl p-3 transition-colors ${
                isActive
                  ? 'border-emerald-400/70 bg-emerald-900/30 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                  : isOwned
                    ? 'border-cyan-500/50 bg-slate-900/60 shadow-[0_0_16px_rgba(34,211,238,0.5)]'
                    : 'border-slate-600/50 bg-slate-950/60 shadow-[0_0_12px_rgba(100,116,139,0.3)]'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),transparent_60%)] opacity-50" />

              <div className="relative flex flex-col gap-2">
                {/* Preview */}
                <div
                  className={`w-full h-20 rounded-lg border border-white/20 bg-gradient-to-br ${item.preview} flex items-center justify-center`}
                >
                  {isActive && (
                    <div className="text-[10px] font-['Orbitron'] tracking-[0.2em] text-white drop-shadow-lg">
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-[11px] md:text-xs font-['Orbitron'] tracking-[0.2em] text-cyan-100">
                    {item.name}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-slate-300/80 leading-tight">
                    {item.description}
                  </p>
                </div>

                {/* Precio / Estado */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] md:text-xs font-['Share_Tech_Mono'] text-cyan-300">
                    {isOwned ? 'OWNED' : `${item.cost} TOKENS`}
                  </span>
                  <button
                    onClick={() => handlePurchase(item)}
                    className={`px-2 py-1 rounded-full text-[9px] md:text-[10px] font-['Share_Tech_Mono'] tracking-[0.2em] border transition-colors ${
                      isActive
                        ? 'border-emerald-400/70 bg-emerald-900/40 text-emerald-200 cursor-default'
                        : isOwned
                          ? 'border-cyan-400/70 bg-cyan-900/40 text-cyan-200 hover:bg-cyan-800/60'
                          : 'border-purple-400/70 bg-purple-900/40 text-purple-200 hover:bg-purple-800/60'
                    }`}
                  >
                    {isActive ? 'ACTIVE' : isOwned ? 'EQUIP' : 'BUY'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mensaje de compra */}
      {purchaseMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-cyan-400/70 bg-black/70 backdrop-blur-md text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.25em] text-cyan-100"
        >
          {purchaseMessage}
        </motion.div>
      )}

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
