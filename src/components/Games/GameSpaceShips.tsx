import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GameSpaceShipsProps {
  onGameEnd: (score: number, timeSpent: number) => void;
  onClose: () => void;
}

export const GameSpaceShips: React.FC<GameSpaceShipsProps> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [posicion, setPosicion] = useState(50);
  const [enemigos, setEnemigos] = useState<Array<{ id: number; x: number }>>([]);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const tiempoInicio = React.useRef<number>(Date.now());
  const contadorEnemigos = React.useRef(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio.current) / 1000));
    }, 100);

    const generador = setInterval(() => {
      contadorEnemigos.current++;
      setEnemigos(prev => [...prev, { id: contadorEnemigos.current, x: Math.random() * 100 }]);
    }, 800);

    return () => {
      clearInterval(intervalo);
      clearInterval(generador);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicion(Math.max(0, posicion - 5));
      if (e.key === 'ArrowRight') setPosicion(Math.min(100, posicion + 5));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [posicion]);

  const dispararEnemigo = (id: number) => {
    setEnemigos(prev => prev.filter(e => e.id !== id));
    setPuntuacion(puntuacion + 10);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">Defensor de Naves Espaciales</h3>
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-slate-400 text-xs">Puntuación</p>
              <p className="text-2xl font-bold text-yellow-400">{puntuacion}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Tiempo</p>
              <p className="text-2xl font-bold text-blue-400">{formatearTiempo(tiempoTranscurrido)}</p>
            </div>
          </div>
        </div>

        {/* Área de Juego */}
        <div className="relative w-full h-96 bg-gradient-to-b from-slate-900 to-black rounded-lg border border-white/20 overflow-hidden">
          {/* Enemigos */}
          {enemigos.map(enemigo => (
            <motion.button
              key={enemigo.id}
              onClick={() => dispararEnemigo(enemigo.id)}
              initial={{ y: -50, opacity: 1 }}
              animate={{ y: 400 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
              className="absolute text-3xl hover:scale-125 transition-transform"
              style={{ left: `${enemigo.x}%`, transform: 'translateX(-50%)' }}
            >
              👾
            </motion.button>
          ))}

          {/* Nave del Jugador */}
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-100"
            style={{ left: `${posicion}%` }}
          >
            <div className="text-4xl">🛸</div>
          </div>

          {/* Instrucciones */}
          <div className="absolute top-4 left-4 text-xs text-slate-300">
            <p>⬅️ ➡️ Mover | Click para disparar</p>
          </div>
        </div>

        {/* Controles */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-slate-400">Enemigos: {enemigos.length}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSpaceShips;
