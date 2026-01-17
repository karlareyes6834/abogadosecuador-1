import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Coins, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface PaqueteTokens {
  id: string;
  cantidad: number;
  precio: number;
  descuento: number;
  bonusTokens: number;
  esPopular: boolean;
}

const PAQUETES_TOKENS: PaqueteTokens[] = [
  {
    id: 'basico',
    cantidad: 100,
    precio: 4.99,
    descuento: 0,
    bonusTokens: 0,
    esPopular: false
  },
  {
    id: 'intermedio',
    cantidad: 500,
    precio: 19.99,
    descuento: 8,
    bonusTokens: 50,
    esPopular: true
  },
  {
    id: 'premium',
    cantidad: 1000,
    precio: 34.99,
    descuento: 15,
    bonusTokens: 150,
    esPopular: false
  },
  {
    id: 'elite',
    cantidad: 2500,
    precio: 74.99,
    descuento: 25,
    bonusTokens: 500,
    esPopular: false
  }
];

interface GameStoreIntegradoProps {
  onCompraExitosa?: () => void;
}

export const GameStoreIntegrado: React.FC<GameStoreIntegradoProps> = ({ onCompraExitosa }) => {
  const { user } = useAuth();
  const [tokensActuales, setTokensActuales] = useState(0);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    cargarTokens();
  }, [user]);

  const cargarTokens = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('user_tokens')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      setTokensActuales(data?.balance || 0);
    } catch (error) {
      console.error('Error cargando tokens:', error);
    }
  };

  const procesarCompra = async (paquete: PaqueteTokens) => {
    if (!user) {
      setMensaje({ tipo: 'error', texto: 'Debes iniciar sesión para comprar tokens' });
      return;
    }

    setProcesando(true);
    setMensaje(null);

    try {
      // Simular procesamiento de pago (en producción, integrar con PayPal/Stripe)
      await new Promise(resolve => setTimeout(resolve, 1500));

      const totalTokens = paquete.cantidad + paquete.bonusTokens;
      const nuevoBalance = tokensActuales + totalTokens;

      // Actualizar balance de tokens
      const { error: errorUpdate } = await supabase
        .from('user_tokens')
        .update({ balance: nuevoBalance })
        .eq('user_id', user.id);

      if (errorUpdate) throw errorUpdate;

      // Registrar transacción
      const { error: errorTransaccion } = await supabase
        .from('token_transactions')
        .insert({
          user_id: user.id,
          tipo: 'compra',
          cantidad: totalTokens,
          precio_usd: paquete.precio,
          paquete_id: paquete.id,
          fecha: new Date().toISOString()
        });

      if (errorTransaccion) throw errorTransaccion;

      setTokensActuales(nuevoBalance);
      setMensaje({
        tipo: 'exito',
        texto: `¡Compra exitosa! Recibiste ${totalTokens} tokens${paquete.bonusTokens > 0 ? ` (${paquete.bonusTokens} bonus)` : ''}`
      });

      onCompraExitosa?.();

      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error('Error procesando compra:', error);
      setMensaje({ tipo: 'error', texto: 'Error al procesar la compra. Intenta de nuevo.' });
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShoppingCart className="w-8 h-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Tienda de Tokens</h1>
                <p className="text-slate-300">Compra tokens para desbloquear juegos premium</p>
              </div>
            </div>
            <div className="backdrop-blur-md bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4">
              <div className="text-center">
                <p className="text-slate-300 text-sm">Saldo Actual</p>
                <p className="text-3xl font-bold text-emerald-400">{tokensActuales}</p>
                <p className="text-slate-400 text-xs">Tokens</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mensaje de estado */}
      {mensaje && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
            mensaje.tipo === 'exito'
              ? 'bg-green-500/20 border-green-400/50 text-green-200'
              : 'bg-red-500/20 border-red-400/50 text-red-200'
          }`}
        >
          {mensaje.tipo === 'exito' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {mensaje.texto}
        </motion.div>
      )}

      {/* Grid de paquetes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {PAQUETES_TOKENS.map((paquete, index) => (
          <motion.div
            key={paquete.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative group ${paquete.esPopular ? 'lg:scale-105' : ''}`}
          >
            {paquete.esPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 rounded-full text-sm font-bold z-10">
                ⭐ MÁS POPULAR
              </div>
            )}

            <div className={`backdrop-blur-xl border rounded-2xl p-6 h-full flex flex-col transition-all duration-300 ${
              paquete.esPopular
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-2xl shadow-yellow-500/20'
                : 'bg-white/10 border-white/20 hover:border-emerald-400/50 hover:shadow-lg hover:shadow-emerald-500/20'
            }`}>
              {/* Cantidad de tokens */}
              <div className="mb-4">
                <div className="text-4xl font-bold text-white mb-2">{paquete.cantidad}</div>
                <p className="text-slate-300 text-sm">Tokens</p>
                {paquete.bonusTokens > 0 && (
                  <p className="text-emerald-400 text-sm font-bold mt-2">
                    + {paquete.bonusTokens} Bonus
                  </p>
                )}
              </div>

              {/* Detalles */}
              <div className="flex-1 mb-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-300 text-sm">
                    ${paquete.precio.toFixed(2)} USD
                  </span>
                </div>
                {paquete.descuento > 0 && (
                  <div className="bg-green-500/30 border border-green-400/50 rounded px-3 py-1">
                    <span className="text-green-200 text-sm font-bold">
                      Ahorra {paquete.descuento}%
                    </span>
                  </div>
                )}
              </div>

              {/* Botón de compra */}
              <button
                onClick={() => procesarCompra(paquete)}
                disabled={procesando}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  paquete.esPopular
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-500/50'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <CreditCard className="w-4 h-4" />
                {procesando ? 'Procesando...' : 'Comprar Ahora'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Información adicional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Información sobre Tokens</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-bold text-emerald-400 mb-2">🎮 Desbloquea Juegos</h4>
            <p className="text-slate-300 text-sm">Usa tokens para comprar acceso a juegos premium y exclusivos</p>
          </div>
          <div>
            <h4 className="font-bold text-purple-400 mb-2">🏆 Gana Recompensas</h4>
            <p className="text-slate-300 text-sm">Completa juegos y gana tokens como recompensa por tu desempeño</p>
          </div>
          <div>
            <h4 className="font-bold text-blue-400 mb-2">💎 Mejoras Exclusivas</h4>
            <p className="text-slate-300 text-sm">Accede a personajes, temas y mejoras especiales con tokens</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameStoreIntegrado;
