import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';

interface GameLegalCheckersProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

export const GameLegalCheckers: React.FC<GameLegalCheckersProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pieces, setPieces] = useState(12 * level);

  const labels = {
    es: {
      title: 'Damas Legales',
      level: 'Nivel',
      moves: 'Movimientos',
      pieces: 'Piezas Restantes',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub',
      gameOver: '¡JUEGO COMPLETADO!',
      finalScore: 'Puntuación Final',
      instructions: 'Juega damas contra la IA. Captura piezas para ganar puntos.'
    },
    en: {
      title: 'Legal Checkers',
      level: 'Level',
      moves: 'Moves',
      pieces: 'Pieces Left',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub',
      gameOver: 'GAME COMPLETED!',
      finalScore: 'Final Score',
      instructions: 'Play checkers against AI. Capture pieces to earn points.'
    }
  };

  const l = labels[language];

  const handleMove = () => {
    setMoves(moves + 1);
    const newScore = score + (15 * level);
    setScore(newScore);
    const newPieces = pieces - 1;
    setPieces(newPieces);
    playRetroSound('COIN');

    if (newPieces <= 0 || moves >= 8 * level) {
      const tokens = Math.floor(newScore * (level / 5));
      addTokens(tokens);
      addXP(tokens * 2);
      setGameOver(true);
      playRetroSound('SUCCESS');
    }
  };

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4"
      >
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-cyan-400">⚫ {l.gameOver}</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {l.finalScore}: <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.moves}: <span className="text-yellow-400">{moves}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.tokens}: <span className="text-green-400">+{Math.floor(score * (level / 5))}</span>
            </p>
          </div>
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition"
          >
            {l.backToHub}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">⚫ {l.title}</h1>
          <p className="text-slate-300 text-sm">{l.instructions}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.level}</p>
            <p className="text-2xl font-bold text-cyan-300">{level}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.moves}</p>
            <p className="text-2xl font-bold text-yellow-300">{moves}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.pieces}</p>
            <p className="text-2xl font-bold text-red-300">{pieces}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.score}</p>
            <p className="text-2xl font-bold text-green-300">{score}</p>
          </div>
        </div>

        {/* Checkers Board */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="grid grid-cols-8 gap-1 bg-black p-2 rounded">
            {Array.from({ length: 64 }).map((_, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const isPlayable = (row + col) % 2 === 1;

              return (
                <motion.div
                  key={idx}
                  className={`aspect-square rounded-sm transition ${
                    isPlayable ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-300'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleMove}
          className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold text-lg transition"
        >
          Realizar Movimiento
        </button>

        {/* Back Button */}
        <button
          onClick={onExit}
          className="w-full px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
        >
          {l.backToHub}
        </button>
      </div>
    </div>
  );
};
