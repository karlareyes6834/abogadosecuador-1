import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Juego: Crucigrama Legal
export const GameCrossword: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const tiempoInicio = React.useRef<number>(Date.now());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio.current) / 1000));
    }, 100);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Crucigrama Legal</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {Array(25).fill(0).map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-full aspect-square bg-white/10 border border-white/20 rounded text-white text-center font-bold uppercase"
            />
          ))}
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

// Juego: Tenis Legal
export const GameTennis: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [posicionRaqueta, setPosicionRaqueta] = useState(50);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('tennis-area')?.getBoundingClientRect();
      if (rect) {
        const posicion = ((e.clientX - rect.left) / rect.width) * 100;
        setPosicionRaqueta(Math.max(0, Math.min(100, posicion)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Tenis Legal</h3>
        <div
          id="tennis-area"
          className="relative w-full h-64 bg-gradient-to-b from-green-900 to-green-950 rounded-lg border border-white/20 mb-4 flex items-center justify-center"
        >
          <div className="text-4xl">🎾</div>
          <div
            className="absolute bottom-4 h-2 w-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all"
            style={{ left: `${posicionRaqueta}%`, transform: 'translateX(-50%)' }}
          />
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

// Juego: Tanques Legales
export const GameTanks: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [posicionTanque, setPosicionTanque] = useState(50);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicionTanque(p => Math.max(0, p - 5));
      if (e.key === 'ArrowRight') setPosicionTanque(p => Math.min(100, p + 5));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Tanques Legales</h3>
        <div className="relative w-full h-64 bg-gradient-to-b from-slate-900 to-black rounded-lg border border-white/20 mb-4">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl">🎯</div>
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-3xl transition-all"
            style={{ left: `${posicionTanque}%` }}
          >
            🛢️
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

// Juego: Snake Legal
export const GameSnake: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Snake Legal</h3>
        <div className="grid grid-cols-10 gap-1 mb-6">
          {Array(100).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-white/10 border border-white/20 rounded" />
          ))}
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

// Juego: Flappy Bird Legal
export const GameFlappyBird: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [posicionPajaro, setPosicionPajaro] = useState(50);

  useEffect(() => {
    const handleClick = () => {
      setPosicionPajaro(p => Math.max(0, p - 10));
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Flappy Bird Legal</h3>
        <div className="relative w-full h-64 bg-gradient-to-b from-sky-400 to-sky-600 rounded-lg border border-white/20 mb-4">
          <div
            className="absolute left-1/4 text-3xl transition-all"
            style={{ top: `${posicionPajaro}%` }}
          >
            🦅
          </div>
          <div className="absolute top-1/4 right-0 w-1 h-20 bg-green-500" />
          <div className="absolute bottom-1/4 right-0 w-1 h-20 bg-green-500" />
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

// Juego: Pac-Man Legal
export const GamePacMan: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [posicionPacman, setPosicionPacman] = useState(50);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicionPacman(p => Math.max(0, p - 5));
      if (e.key === 'ArrowRight') setPosicionPacman(p => Math.min(100, p + 5));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-yellow-400/20 border border-white/20 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Pac-Man Legal</h3>
        <div className="relative w-full h-64 bg-gradient-to-b from-slate-900 to-black rounded-lg border border-white/20 mb-4">
          <div className="grid grid-cols-10 gap-2 p-4 h-full">
            {Array(100).fill(0).map((_, i) => (
              <div key={i} className="bg-white/10 rounded-full" />
            ))}
          </div>
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-3xl transition-all"
            style={{ left: `${posicionPacman}%` }}
          >
            👾
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-slate-400">Puntuación: {puntuacion}</p>
          <button onClick={onClose} className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg">Salir</button>
        </div>
      </div>
    </div>
  );
};

export default {
  GameCrossword,
  GameTennis,
  GameTanks,
  GameSnake,
  GameFlappyBird,
  GamePacMan
};
