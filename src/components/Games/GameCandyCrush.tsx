import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface GameCandyCrushProps {
  onGameEnd: (score: number, timeSpent: number) => void;
  onClose: () => void;
}

export const GameCandyCrush: React.FC<GameCandyCrushProps> = ({ onGameEnd, onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [nivel] = useState(1);
  const [movimientos, setMovimientos] = useState(30);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [sonidoActivo, setSonidoActivo] = useState(true);
  const [grid, setGrid] = useState<string[][]>([]);
  const tiempoInicio = React.useRef<number>(Date.now());

  const COLORES = ['🟥', '🟦', '🟨', '🟩', '🟪'];
  const TAMAÑO_GRID = 5;

  useEffect(() => {
    inicializarGrid();
    const intervalo = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio.current) / 1000));
    }, 100);
    return () => clearInterval(intervalo);
  }, []);

  const inicializarGrid = () => {
    const nuevoGrid = Array(TAMAÑO_GRID).fill(null).map(() =>
      Array(TAMAÑO_GRID).fill(null).map(() => COLORES[Math.floor(Math.random() * COLORES.length)])
    );
    setGrid(nuevoGrid);
  };

  const hacerMovimiento = (fila: number, col: number) => {
    if (movimientos <= 0) return;

    const nuevoGrid = grid.map(r => [...r]);
    const colorActual = nuevoGrid[fila][col];

    // Simular eliminación de caramelos
    let eliminados = 0;
    for (let i = 0; i < TAMAÑO_GRID; i++) {
      if (nuevoGrid[fila][i] === colorActual) {
        nuevoGrid[fila][i] = '';
        eliminados++;
      }
    }

    if (eliminados >= 3) {
      setPuntuacion(puntuacion + eliminados * 10 * nivel);
      setGrid(nuevoGrid);
      setMovimientos(movimientos - 1);

      if (movimientos - 1 === 0) {
        setTimeout(() => onGameEnd(puntuacion + eliminados * 10 * nivel, tiempoTranscurrido), 500);
      }
    }
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Candy Crush Legal</h3>
            <p className="text-slate-300 text-sm">Nivel {nivel}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs">Puntuación</p>
              <p className="text-2xl font-bold text-yellow-400">{puntuacion}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Movimientos</p>
              <p className="text-2xl font-bold text-blue-400">{movimientos}</p>
            </div>
            <button
              onClick={() => setSonidoActivo(!sonidoActivo)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
            >
              {sonidoActivo ? (
                <Volume2 className="w-5 h-5 text-white" />
              ) : (
                <VolumeX className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Grid de Juego */}
        <div className="grid gap-2 mb-6" style={{ gridTemplateColumns: `repeat(${TAMAÑO_GRID}, 1fr)` }}>
          {grid.map((fila, i) =>
            fila.map((color, j) => (
              <motion.button
                key={`${i}-${j}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => hacerMovimiento(i, j)}
                className="aspect-square bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-lg hover:border-white/50 transition-all text-3xl font-bold flex items-center justify-center"
              >
                {color}
              </motion.button>
            ))
          )}
        </div>

        {/* Información */}
        <div className="flex justify-between items-center text-sm text-slate-300">
          <span>Tiempo: {formatearTiempo(tiempoTranscurrido)}</span>
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

export default GameCandyCrush;
