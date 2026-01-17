import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';

interface GameLegalDominoProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

export const GameLegalDomino: React.FC<GameLegalDominoProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [chain, setChain] = useState(0);

  const labels = {
    es: {
      title: 'Dominó Legal',
      level: 'Nivel',
      moves: 'Movimientos',
      chain: 'Cadena',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub',
      gameOver: '¡JUEGO COMPLETADO!',
      finalScore: 'Puntuación Final',
      playMove: 'Jugar Movimiento',
      instructions: 'Coloca fichas de dominó legales. Forma cadenas para ganar puntos.'
    },
    en: {
      title: 'Legal Domino',
      level: 'Level',
      moves: 'Moves',
      chain: 'Chain',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub',
      gameOver: 'GAME COMPLETED!',
      finalScore: 'Final Score',
      playMove: 'Play Move',
      instructions: 'Place legal domino tiles. Form chains to earn points.'
    }
  };

  const l = labels[language];

  const handlePlayMove = () => {
    setMoves(moves + 1);
    const newChain = chain + 1;
    setChain(newChain);
    const moveScore = (10 + newChain * 5) * level;
    const newScore = score + moveScore;
    setScore(newScore);
    playRetroSound('COIN');

    if (moves >= 12 * level) {
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
          <h2 className="text-4xl font-bold text-cyan-400">🎲 {l.gameOver}</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {l.finalScore}: <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.moves}: <span className="text-yellow-400">{moves}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.chain}: <span className="text-purple-400">{chain}</span>
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
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">🎲 {l.title}</h1>
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
            <p className="text-xs text-slate-400">{l.chain}</p>
            <p className="text-2xl font-bold text-purple-300">{chain}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center">
            <p className="text-xs text-slate-400">{l.score}</p>
            <p className="text-2xl font-bold text-green-300">{score}</p>
          </div>
        </div>

        {/* Domino Display */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex justify-center gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="w-16 h-32 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-2 border-amber-800 flex items-center justify-center shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-900">{idx + 1}</div>
                  <div className="text-xs text-amber-700">•</div>
                  <div className="text-2xl font-bold text-amber-900">{6 - idx}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-slate-300 text-sm">
            {language === 'es' ? 'Fichas disponibles' : 'Available tiles'}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handlePlayMove}
          className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-bold text-lg transition"
        >
          {l.playMove}
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
