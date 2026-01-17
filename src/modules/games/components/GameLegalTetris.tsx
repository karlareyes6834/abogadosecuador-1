import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';

interface GameLegalTetrisProps {
  onExit: () => void;
  language: 'es' | 'en';
}

const TETRIS_BLOCKS = [
  { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-red-500' },
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-green-500' },
  { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-blue-500' },
  { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-purple-500' },
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-pink-500' }
];

export const GameLegalTetris: React.FC<GameLegalTetrisProps> = ({ onExit, language }) => {
  const { addTokens, addXP } = usePlayer();
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [grid] = useState<number[][]>(Array(20).fill(null).map(() => Array(10).fill(0)));
  const [currentBlock, setCurrentBlock] = useState(TETRIS_BLOCKS[0]);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [nextBlock] = useState(TETRIS_BLOCKS[Math.floor(Math.random() * TETRIS_BLOCKS.length)]);

  const labels = {
    es: { title: 'Tetris Legal', gameOver: 'JUEGO TERMINADO', finalScore: 'Puntuación Final:', tokensEarned: 'Tokens Ganados:', backToHub: 'Volver al Hub', level: 'Nivel:' },
    en: { title: 'Legal Tetris', gameOver: 'GAME OVER', finalScore: 'Final Score:', tokensEarned: 'Tokens Earned:', backToHub: 'Back to Hub', level: 'Level:' }
  };

  const l = labels[language];

  const moveBlock = useCallback((direction: 'left' | 'right' | 'down') => {
    setPosition(prev => {
      let newX = prev.x;
      if (direction === 'left') newX = Math.max(0, prev.x - 1);
      if (direction === 'right') newX = Math.min(10 - currentBlock.shape[0].length, prev.x + 1);
      if (direction === 'down') return { ...prev, y: prev.y + 1 };
      return { ...prev, x: newX };
    });
  }, [currentBlock]);

  const rotateBlock = useCallback(() => {
    const rotated = currentBlock.shape[0].map((_, i) =>
      currentBlock.shape.map(row => row[i]).reverse()
    );
    setCurrentBlock({ ...currentBlock, shape: rotated });
  }, [currentBlock]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;
      if (e.key === 'ArrowLeft') moveBlock('left');
      if (e.key === 'ArrowRight') moveBlock('right');
      if (e.key === 'ArrowDown') moveBlock('down');
      if (e.key === ' ') rotateBlock();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [moveBlock, rotateBlock, gameOver]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveBlock('down');
    }, 1000 - level * 50);

    return () => clearInterval(interval);
  }, [moveBlock, level, gameOver]);

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4"
      >
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-cyan-400">{l.gameOver}</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {l.finalScore} <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.tokensEarned} <span className="text-green-400">+{Math.floor(score / 10)}</span>
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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-cyan-400 text-center">{l.title}</h1>

        <div className="flex justify-between items-center text-white mb-4">
          <div>
            <p className="text-sm text-slate-400">Score</p>
            <p className="text-2xl font-bold text-cyan-300">{score}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">{l.level}</p>
            <p className="text-2xl font-bold text-cyan-300">{level}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Next</p>
            <div className="w-12 h-12 bg-slate-800 rounded border border-cyan-500/30 flex items-center justify-center">
              <div className={`w-6 h-6 ${nextBlock.color}`} />
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="bg-black border-2 border-cyan-500 rounded-lg overflow-hidden">
          <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(10, 1fr)' }}>
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-8 h-8 border border-slate-700 ${
                    cell ? 'bg-cyan-500' : 'bg-slate-900'
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <div className="text-center text-slate-400 text-sm">
          <p>{language === 'es' ? '← → Mover | ↓ Bajar | ESPACIO Rotar' : '← → Move | ↓ Down | SPACE Rotate'}</p>
        </div>

        <button
          onClick={onExit}
          className="w-full px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
        >
          {l.backToHub}
        </button>
      </div>
    </div>
  );
};
