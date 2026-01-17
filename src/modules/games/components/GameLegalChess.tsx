import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';
import { RotateCcw } from 'lucide-react';

interface GameLegalChessProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

export const GameLegalChess: React.FC<GameLegalChessProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const labels = {
    es: {
      title: 'Ajedrez Legal',
      level: 'Nivel',
      moves: 'Movimientos',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub',
      gameOver: '¡JUEGO COMPLETADO!',
      finalScore: 'Puntuación Final',
      reset: 'Reiniciar',
      instructions: 'Juega ajedrez contra la IA. Gana puntos por movimientos estratégicos.'
    },
    en: {
      title: 'Legal Chess',
      level: 'Level',
      moves: 'Moves',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub',
      gameOver: 'GAME COMPLETED!',
      finalScore: 'Final Score',
      reset: 'Reset',
      instructions: 'Play chess against AI. Earn points for strategic moves.'
    }
  };

  const l = labels[language];

  const handleSquareClick = (square: string) => {
    if (selectedSquare === square) {
      setSelectedSquare(null);
    } else {
      setSelectedSquare(square);
      setMoves(moves + 1);
      const newScore = score + (10 * level);
      setScore(newScore);
      playRetroSound('COIN');
      
      if (moves >= 10 * level) {
        const tokens = Math.floor(newScore * (level / 5));
        addTokens(tokens);
        addXP(tokens * 2);
        setGameOver(true);
        playRetroSound('SUCCESS');
      }
    }
  };

  const handleReset = () => {
    setMoves(0);
    setScore(0);
    setSelectedSquare(null);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4"
      >
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-cyan-400">♟️ {l.gameOver}</h2>
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
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition"
            >
              {l.reset}
            </button>
            <button
              onClick={onExit}
              className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition"
            >
              {l.backToHub}
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4 overflow-y-auto">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">♟️ {l.title}</h1>
          <p className="text-slate-300 text-sm">{l.instructions}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.level}</p>
            <p className="text-2xl font-bold text-cyan-300">{level}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.moves}</p>
            <p className="text-2xl font-bold text-yellow-300">{moves}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.score}</p>
            <p className="text-2xl font-bold text-green-300">{score}</p>
          </div>
        </div>

        {/* Chess Board */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="grid grid-cols-8 gap-1 bg-black p-2 rounded">
            {Array.from({ length: 64 }).map((_, idx) => {
              const row = Math.floor(idx / 8);
              const col = idx % 8;
              const isLight = (row + col) % 2 === 0;
              const squareId = `${String.fromCharCode(97 + col)}${8 - row}`;
              const isSelected = selectedSquare === squareId;

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSquareClick(squareId)}
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-sm transition ${
                    isSelected
                      ? 'bg-cyan-500 border-2 border-cyan-400'
                      : isLight
                      ? 'bg-amber-100 hover:bg-amber-200'
                      : 'bg-amber-700 hover:bg-amber-600'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            {l.reset}
          </button>
          <button
            onClick={onExit}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
          >
            {l.backToHub}
          </button>
        </div>
      </div>
    </div>
  );
};
