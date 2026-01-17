import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface JuegosAvanzadosProps {
  juegoId: string;
  nombre: string;
  icono: string;
  nivelActual: number;
  totalNiveles: number;
  onAvanzarNivel: () => void;
  onPerder: () => void;
  onVolver: () => void;
  tokens: number;
  onTokensChange: (tokens: number) => void;
}

// Parchís Game
const ParchisGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicion, setPosicion] = useState(0);
  const [dado, setDado] = useState(0);
  const [movimientos, setMovimientos] = useState(0);

  const lanzarDado = () => {
    const resultado = Math.floor(Math.random() * 6) + 1;
    setDado(resultado);
    const nuevaPosicion = Math.min(posicion + resultado, 100);
    setPosicion(nuevaPosicion);
    setMovimientos(movimientos + 1);

    if (nuevaPosicion >= 100) {
      setTimeout(onGanar, 1000);
    } else if (movimientos >= 20) {
      setTimeout(onPerder, 1000);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
        <p className="text-center text-2xl font-bold text-slate-900 mb-4">Parchís Legal</p>
        <div className="w-full bg-gray-300 rounded-full h-6 mb-4">
          <motion.div
            animate={{ width: `${posicion}%` }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
          />
        </div>
        <p className="text-center font-bold text-slate-900">Progreso: {posicion}/100</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-700 mb-2">Último Dado</p>
          <p className="text-4xl font-bold text-blue-600">{dado}</p>
        </div>
        <div className="bg-green-100 rounded-lg p-4 text-center">
          <p className="text-sm text-slate-700 mb-2">Movimientos</p>
          <p className="text-4xl font-bold text-green-600">{movimientos}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={lanzarDado}
        className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg"
      >
        🎲 Lanzar Dado
      </motion.button>
    </div>
  );
};

// Ruleta Game
const RuletaGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [girando, setGirando] = useState(false);
  const [resultado, setResultado] = useState<number | null>(null);
  const [apuesta, setApuesta] = useState(10);
  const [saldo, setSaldo] = useState(100);

  const girar = () => {
    if (saldo < apuesta) return;
    
    setGirando(true);
    setResultado(null);
    
    setTimeout(() => {
      const numero = Math.floor(Math.random() * 37);
      setResultado(numero);
      setGirando(false);

      if (numero % 2 === 0) {
        setSaldo(saldo + apuesta);
        setTimeout(onGanar, 1500);
      } else {
        setSaldo(Math.max(0, saldo - apuesta));
        if (saldo - apuesta <= 0) {
          setTimeout(onPerder, 1500);
        }
      }
    }, 2000);
  };

  return (
    <div className="p-8 space-y-6 text-center">
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: girando ? 360 : 0 }}
          transition={{ duration: 2, repeat: girando ? Infinity : 0 }}
          className="w-32 h-32 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-yellow-400"
        >
          {resultado !== null ? resultado : '?'}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-100 rounded-lg p-4">
          <p className="text-sm text-slate-700">Saldo</p>
          <p className="text-3xl font-bold text-green-600">${saldo}</p>
        </div>
        <div className="bg-orange-100 rounded-lg p-4">
          <p className="text-sm text-slate-700">Apuesta</p>
          <p className="text-3xl font-bold text-orange-600">${apuesta}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setApuesta(Math.max(1, apuesta - 5))}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600"
        >
          - Apuesta
        </button>
        <button
          onClick={() => setApuesta(apuesta + 5)}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
        >
          + Apuesta
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={girar}
        disabled={girando || saldo < apuesta}
        className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-black text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
      >
        {girando ? '🎡 Girando...' : '🎡 Girar Ruleta'}
      </motion.button>
    </div>
  );
};

// Cartas Avanzado
const CartasAvanzadoGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [mano, setMano] = useState<string[]>(['♠A', '♥K', '♦Q', '♣J']);
  const [mesa, setMesa] = useState<string[]>(['♠10', '♥9', '♦8']);
  const [puntos, setPuntos] = useState(0);
  const [ronda, setRonda] = useState(1);

  const jugarCarta = (index: number) => {
    const nuevaMano = mano.filter((_, i) => i !== index);
    setMano(nuevaMano);
    const nuevaPuntos = puntos + (Math.random() > 0.4 ? 10 : -5);
    setPuntos(Math.max(0, nuevaPuntos));

    if (ronda >= 5) {
      if (nuevaPuntos > 30) onGanar();
      else onPerder();
    } else {
      setRonda(ronda + 1);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-green-700 rounded-lg p-6 text-white">
        <p className="text-center text-sm mb-2">Mesa</p>
        <div className="flex justify-center gap-2 mb-4">
          {mesa.map((carta, i) => (
            <div key={i} className="bg-white text-green-700 px-3 py-2 rounded font-bold">
              {carta}
            </div>
          ))}
        </div>
        <p className="text-center">Ronda {ronda}/5</p>
      </div>

      <div className="space-y-2">
        <p className="text-center font-bold text-slate-900">Puntos: {puntos}</p>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className="bg-green-500 h-full rounded-full transition-all"
            style={{ width: `${Math.min(puntos, 50)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mano.map((carta, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => jugarCarta(i)}
            className="p-4 bg-blue-500 text-white rounded-lg font-bold text-lg hover:bg-blue-600"
          >
            {carta}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Componente Principal
export const JuegosAvanzados: React.FC<JuegosAvanzadosProps> = ({
  juegoId,
  nombre,
  icono,
  nivelActual,
  totalNiveles,
  onAvanzarNivel,
  onPerder,
  onVolver,
  tokens,
  onTokensChange,
}) => {
  const [resultado, setResultado] = useState<'ganando' | 'perdiendo' | null>(null);

  const renderizarJuego = () => {
    switch (juegoId) {
      case 'parchis':
        return (
          <ParchisGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'ruleta':
        return (
          <RuletaGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'cartas':
        return (
          <CartasAvanzadoGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      default:
        return <p className="p-8 text-center text-slate-600">Juego no disponible</p>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-bold"
      >
        <ChevronLeft className="w-5 h-5" />
        Volver a Juegos
      </button>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{icono}</span>
              <div>
                <h2 className="text-2xl font-bold">{nombre}</h2>
                <p className="text-blue-100">Nivel {nivelActual} de {totalNiveles}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Tokens</p>
              <p className="text-3xl font-bold text-yellow-300">{tokens}</p>
            </div>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nivelActual / totalNiveles) * 100}%` }}
              className="bg-green-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* Contenido del Juego */}
        <div className="bg-slate-50 min-h-96">{renderizarJuego()}</div>

        {/* Resultado */}
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 text-center ${resultado === 'ganando' ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <p className={`text-2xl font-bold mb-4 ${resultado === 'ganando' ? 'text-green-700' : 'text-red-700'}`}>
              {resultado === 'ganando' ? '¡Ganaste! 🎉' : 'Perdiste 😢'}
            </p>
            {resultado === 'ganando' && (
              <p className="text-lg font-bold text-green-700 mb-4">+75 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 75);
                    setResultado(null);
                    onAvanzarNivel();
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                >
                  Siguiente Nivel →
                </motion.button>
              )}
              {resultado === 'ganando' && nivelActual === totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 150);
                    onVolver();
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                >
                  ¡Juego Completado! Volver
                </motion.button>
              )}
              {resultado === 'perdiendo' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResultado(null)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600"
                >
                  Reintentar
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default JuegosAvanzados;
