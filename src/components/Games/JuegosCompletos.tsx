import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosCompletosProps {
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

// Poker Game
const PokerGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [mano, setMano] = useState<string[]>(['♠A', '♥K', '♦Q', '♣J', '♠10']);
  const [apuesta, setApuesta] = useState(10);
  const [resultado, setResultado] = useState<string | null>(null);

  const jugar = () => {
    const random = Math.random();
    if (random > 0.4) {
      setResultado('¡Ganaste la mano! 🎉');
      setTimeout(onGanar, 1500);
    } else {
      setResultado('Perdiste esta mano 😢');
      setTimeout(onPerder, 1500);
    }
  };

  return (
    <div className="p-8 text-center space-y-6">
      <div className="bg-green-700 rounded-lg p-8 text-white">
        <p className="text-sm mb-2">Tu Mano</p>
        <div className="flex justify-center gap-2 mb-4">
          {mano.map((carta, i) => (
            <div key={i} className="bg-white text-green-700 px-4 py-2 rounded font-bold text-lg">
              {carta}
            </div>
          ))}
        </div>
        <p className="text-xl font-bold">Apuesta: ${apuesta}</p>
      </div>
      {resultado && <p className="text-2xl font-bold text-slate-900">{resultado}</p>}
      {!resultado && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={jugar}
          className="px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
        >
          Jugar Mano
        </motion.button>
      )}
    </div>
  );
};

// Solitario Game
const SolitarioGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [cartas, setCartas] = useState<{ id: number; valor: string; movida: boolean }[]>(
    Array.from({ length: 7 }, (_, i) => ({ id: i, valor: `${i + 1}`, movida: false }))
  );
  const [movidas, setMovidas] = useState(0);

  const moverCarta = (id: number) => {
    setCartas(cartas.map(c => c.id === id ? { ...c, movida: true } : c));
    setMovidas(movidas + 1);
    if (movidas + 1 === 7) onGanar();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-7 gap-2">
        {cartas.map(carta => (
          <motion.button
            key={carta.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => moverCarta(carta.id)}
            className={`p-4 rounded-lg font-bold transition-all ${
              carta.movida
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {carta.valor}
          </motion.button>
        ))}
      </div>
      <p className="text-center font-bold text-slate-900">Cartas movidas: {movidas}/7</p>
    </div>
  );
};

// Candy Crush Game
const CandyCrushGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [puntos, setPuntos] = useState(0);
  const [movimientos, setMovimientos] = useState(10);

  const hacerMovimiento = () => {
    const puntosPorMovimiento = Math.floor(Math.random() * 50) + 10;
    setPuntos(puntos + puntosPorMovimiento);
    setMovimientos(movimientos - 1);

    if (puntos + puntosPorMovimiento >= 500) {
      onGanar();
    } else if (movimientos - 1 === 0) {
      onPerder();
    }
  };

  return (
    <div className="p-8 space-y-6 text-center">
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={hacerMovimiento}
            className="p-6 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-lg font-bold text-2xl hover:shadow-lg"
          >
            🍬
          </motion.button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">Puntos: {puntos}</p>
        <p className="text-lg font-bold text-slate-700">Movimientos: {movimientos}</p>
        <p className="text-sm text-slate-600">Objetivo: 500 puntos</p>
      </div>
    </div>
  );
};

// Carros Game
const CarrosGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicion, setPosicion] = useState(50);
  const [velocidad, setVelocidad] = useState(0);
  const [distancia, setDistancia] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistancia(d => {
        if (d >= 100) {
          onGanar();
          return d;
        }
        return d + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const mover = (direccion: number) => {
    setPosicion(Math.max(10, Math.min(90, posicion + direccion)));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gray-200 rounded-lg p-4 h-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center">
          <div className="absolute left-0 right-0 h-1 bg-yellow-400" style={{ top: '25%' }}></div>
          <div className="absolute left-0 right-0 h-1 bg-yellow-400" style={{ top: '75%' }}></div>
        </div>
        <motion.div
          animate={{ left: `${posicion}%` }}
          className="absolute top-1/2 transform -translate-y-1/2 text-4xl"
        >
          🏎️
        </motion.div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-slate-900">Distancia: {distancia}%</p>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <motion.div
            animate={{ width: `${distancia}%` }}
            className="bg-green-500 h-full rounded-full"
          />
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => mover(-10)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
        >
          ← Izquierda
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => mover(10)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
        >
          Derecha →
        </motion.button>
      </div>
    </div>
  );
};

// Peleas Game
const PeleasGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [vidaJugador, setVidaJugador] = useState(100);
  const [vidaOponente, setVidaOponente] = useState(100);
  const [resultado, setResultado] = useState<string | null>(null);

  const atacar = (tipo: string) => {
    const danio = Math.floor(Math.random() * 30) + 10;
    const danioRecibido = Math.floor(Math.random() * 20) + 5;

    setVidaOponente(Math.max(0, vidaOponente - danio));
    setVidaJugador(Math.max(0, vidaJugador - danioRecibido));

    if (vidaOponente - danio <= 0) {
      setResultado('¡Ganaste el combate! 🥊');
      setTimeout(onGanar, 1500);
    } else if (vidaJugador - danioRecibido <= 0) {
      setResultado('Perdiste el combate 😢');
      setTimeout(onPerder, 1500);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="font-bold text-slate-900 mb-2">Tú</p>
          <div className="text-4xl mb-2">🥊</div>
          <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-full rounded-full transition-all"
              style={{ width: `${vidaJugador}%` }}
            ></div>
          </div>
          <p className="font-bold text-slate-900">{vidaJugador} HP</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="font-bold text-slate-900 mb-2">Oponente</p>
          <div className="text-4xl mb-2">🤼</div>
          <div className="w-full bg-gray-300 rounded-full h-4 mb-2">
            <div
              className="bg-green-500 h-full rounded-full transition-all"
              style={{ width: `${vidaOponente}%` }}
            ></div>
          </div>
          <p className="font-bold text-slate-900">{vidaOponente} HP</p>
        </div>
      </div>

      {resultado && <p className="text-2xl font-bold text-center text-slate-900">{resultado}</p>}

      {!resultado && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => atacar('puño')}
            className="px-4 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700"
          >
            Puño 👊
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => atacar('patada')}
            className="px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
          >
            Patada 🦵
          </motion.button>
        </div>
      )}
    </div>
  );
};

// Componente Principal
export const JuegosCompletos: React.FC<JuegosCompletosProps> = ({
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
      case 'poker':
        return (
          <PokerGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'solitario':
        return (
          <SolitarioGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'candy':
        return (
          <CandyCrushGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'carros':
        return (
          <CarrosGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'peleas':
        return (
          <PeleasGame
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
              <p className="text-lg font-bold text-green-700 mb-4">+50 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 50);
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
                    onTokensChange(tokens + 100);
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

export default JuegosCompletos;
