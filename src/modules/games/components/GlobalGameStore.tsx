import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';
import { ShoppingCart, X } from 'lucide-react';

interface StoreItem {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  cost: number;
  category: 'cosmetic' | 'powerup' | 'character' | 'theme';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const STORE_ITEMS: StoreItem[] = [
  {
    id: 'gold-cube',
    nameEs: 'Cubo Dorado',
    nameEn: 'Golden Cube',
    descriptionEs: 'Cubo premium dorado para ganadores',
    descriptionEn: 'Premium golden cube for winners',
    cost: 50,
    category: 'cosmetic',
    icon: '✨',
    rarity: 'rare'
  },
  {
    id: 'neon-pink',
    nameEs: 'Neon Rosa',
    nameEn: 'Neon Pink',
    descriptionEs: 'Cubo rosa neón vibrante',
    descriptionEn: 'Vibrant neon pink cube',
    cost: 40,
    category: 'cosmetic',
    icon: '💗',
    rarity: 'rare'
  },
  {
    id: 'emerald-justice',
    nameEs: 'Justicia Esmeralda',
    nameEn: 'Emerald Justice',
    descriptionEs: 'Cubo verde esmeralda para justicia',
    descriptionEn: 'Green emerald cube for justice',
    cost: 45,
    category: 'cosmetic',
    icon: '💚',
    rarity: 'rare'
  },
  {
    id: 'speed-boost',
    nameEs: 'Impulso de Velocidad',
    nameEn: 'Speed Boost',
    descriptionEs: 'Aumenta la velocidad del juego 2x',
    descriptionEn: 'Doubles game speed',
    cost: 30,
    category: 'powerup',
    icon: '⚡',
    rarity: 'common'
  },
  {
    id: 'shield-protection',
    nameEs: 'Escudo Protector',
    nameEn: 'Shield Protection',
    descriptionEs: 'Protege de una colisión',
    descriptionEn: 'Protects from one collision',
    cost: 35,
    category: 'powerup',
    icon: '🛡️',
    rarity: 'common'
  },
  {
    id: 'lawyer-character',
    nameEs: 'Personaje Abogado',
    nameEn: 'Lawyer Character',
    descriptionEs: 'Juega como un abogado profesional',
    descriptionEn: 'Play as a professional lawyer',
    cost: 60,
    category: 'character',
    icon: '👨‍⚖️',
    rarity: 'epic'
  },
  {
    id: 'dark-theme',
    nameEs: 'Tema Oscuro Premium',
    nameEn: 'Premium Dark Theme',
    descriptionEs: 'Tema oscuro profesional',
    descriptionEn: 'Professional dark theme',
    cost: 50,
    category: 'theme',
    icon: '🌙',
    rarity: 'rare'
  },
  {
    id: 'light-theme',
    nameEs: 'Tema Claro Futurista',
    nameEn: 'Futuristic Light Theme',
    descriptionEs: 'Tema claro futurista',
    descriptionEn: 'Futuristic light theme',
    cost: 50,
    category: 'theme',
    icon: '☀️',
    rarity: 'rare'
  }
];

interface GlobalGameStoreProps {
  onClose: () => void;
  language: 'es' | 'en';
}

export const GlobalGameStore: React.FC<GlobalGameStoreProps> = ({ onClose, language }) => {
  const { profile, purchaseCosmetic, addTokens } = usePlayer();
  const [selectedCategory, setSelectedCategory] = useState<'cosmetic' | 'powerup' | 'character' | 'theme'>('cosmetic');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);
  const [cart, setCart] = useState<StoreItem[]>([]);

  const labels = {
    es: {
      title: 'Tienda Global de Juegos',
      balance: 'Saldo:',
      tokens: 'Tokens',
      buy: 'Comprar',
      owned: 'Poseído',
      equip: 'Equipar',
      cart: 'Carrito',
      checkout: 'Pagar',
      close: 'Cerrar',
      insufficientTokens: 'Tokens insuficientes',
      purchased: 'Comprado',
      addedToCart: 'Agregado al carrito'
    },
    en: {
      title: 'Global Game Store',
      balance: 'Balance:',
      tokens: 'Tokens',
      buy: 'Buy',
      owned: 'Owned',
      equip: 'Equip',
      cart: 'Cart',
      checkout: 'Checkout',
      close: 'Close',
      insufficientTokens: 'Insufficient tokens',
      purchased: 'Purchased',
      addedToCart: 'Added to cart'
    }
  };

  const l = labels[language];
  const filtered = STORE_ITEMS.filter(item => item.category === selectedCategory);

  const handlePurchase = (item: StoreItem) => {
    if (profile.tokens >= item.cost) {
      purchaseCosmetic(item.id, item.cost);
      setPurchaseMessage(`✓ ${language === 'es' ? item.nameEs : item.nameEn} ${l.purchased}`);
      playRetroSound('POWERUP');
      setTimeout(() => setPurchaseMessage(null), 2000);
    } else {
      setPurchaseMessage(`✗ ${l.insufficientTokens}`);
      playRetroSound('EXPLOSION');
      setTimeout(() => setPurchaseMessage(null), 2000);
    }
  };

  const handleAddToCart = (item: StoreItem) => {
    setCart([...cart, item]);
    setPurchaseMessage(`✓ ${l.addedToCart}`);
    playRetroSound('COIN');
    setTimeout(() => setPurchaseMessage(null), 1500);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.cost, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-cyan-500/30 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">{l.title}</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row gap-6 p-6">
          {/* Main Store */}
          <div className="flex-1">
            {/* Balance */}
            <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-cyan-500/20">
              <p className="text-sm text-slate-400">{l.balance}</p>
              <p className="text-3xl font-bold text-cyan-300">{profile.tokens} {l.tokens}</p>
            </div>

            {/* Categories */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {(['cosmetic', 'powerup', 'character', 'theme'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(item => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg border-2 transition ${
                    profile.ownedCosmetics.includes(item.id)
                      ? 'border-green-500 bg-green-900/20'
                      : 'border-slate-600 bg-slate-800 hover:border-cyan-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-2xl mb-2">{item.icon}</p>
                      <h3 className="font-bold text-white">
                        {language === 'es' ? item.nameEs : item.nameEn}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {language === 'es' ? item.descriptionEs : item.descriptionEn}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.rarity === 'legendary' ? 'bg-yellow-600 text-yellow-100' :
                      item.rarity === 'epic' ? 'bg-purple-600 text-purple-100' :
                      item.rarity === 'rare' ? 'bg-blue-600 text-blue-100' :
                      'bg-slate-600 text-slate-100'
                    }`}>
                      {item.rarity.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{item.cost} {l.tokens}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePurchase(item)}
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold transition"
                      >
                        {profile.ownedCosmetics.includes(item.id) ? l.equip : l.buy}
                      </button>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:w-80 bg-slate-800 rounded-lg border border-cyan-500/20 p-4 h-fit">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingCart size={20} />
              {l.cart} ({cart.length})
            </h2>

            <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-700 rounded">
                  <span className="text-sm text-white">{language === 'es' ? item.nameEs : item.nameEn}</span>
                  <button
                    onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <>
                <div className="border-t border-slate-600 pt-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-300">Total:</span>
                    <span className="text-2xl font-bold text-cyan-300">{cartTotal}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (profile.tokens >= cartTotal) {
                        cart.forEach(item => purchaseCosmetic(item.id, item.cost));
                        setCart([]);
                        setPurchaseMessage(`✓ ${l.purchased}`);
                        playRetroSound('SUCCESS');
                      } else {
                        setPurchaseMessage(`✗ ${l.insufficientTokens}`);
                        playRetroSound('EXPLOSION');
                      }
                      setTimeout(() => setPurchaseMessage(null), 2000);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition"
                  >
                    {l.checkout}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Purchase Message */}
        <AnimatePresence>
          {purchaseMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border border-cyan-400/70 bg-black/70 backdrop-blur-md text-sm font-bold text-cyan-100"
            >
              {purchaseMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
