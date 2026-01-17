import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';

interface MemoryCard {
  id: string;
  term: string;
  definition: string;
  matched: boolean;
}

interface GameLegalMemoryProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

const MEMORY_PAIRS = {
  es: [
    { term: 'Habeas Corpus', definition: 'Acción para proteger libertad personal' },
    { term: 'Demanda', definition: 'Escrito inicial de un proceso judicial' },
    { term: 'Sentencia', definition: 'Decisión final del juez' },
    { term: 'Apelación', definition: 'Recurso para revisar una decisión' },
    { term: 'Contrato', definition: 'Acuerdo entre dos o más partes' },
    { term: 'Recurso', definition: 'Medio para impugnar una decisión' },
    { term: 'Juicio', definition: 'Proceso legal completo' },
    { term: 'Derecho', definition: 'Facultad o prerrogativa de una persona' }
  ],
  en: [
    { term: 'Habeas Corpus', definition: 'Action to protect personal freedom' },
    { term: 'Lawsuit', definition: 'Initial written claim in a legal process' },
    { term: 'Sentence', definition: 'Final decision of the judge' },
    { term: 'Appeal', definition: 'Remedy to review a decision' },
    { term: 'Contract', definition: 'Agreement between two or more parties' },
    { term: 'Remedy', definition: 'Means to challenge a decision' },
    { term: 'Trial', definition: 'Complete legal process' },
    { term: 'Right', definition: 'Faculty or prerogative of a person' }
  ]
};

export const GameLegalMemory: React.FC<GameLegalMemoryProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const labels = {
    es: {
      title: 'Memoria Legal',
      level: 'Nivel',
      moves: 'Movimientos',
      matched: 'Parejas Encontradas',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub',
      gameOver: '¡JUEGO COMPLETADO!',
      finalScore: 'Puntuación Final'
    },
    en: {
      title: 'Legal Memory',
      level: 'Level',
      moves: 'Moves',
      matched: 'Pairs Found',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub',
      gameOver: 'GAME COMPLETED!',
      finalScore: 'Final Score'
    }
  };

  const l = labels[language];
  const pairs = MEMORY_PAIRS[language];
  const pairsToUse = pairs.slice(0, 3 + level);

  useEffect(() => {
    const allCards: MemoryCard[] = [];
    pairsToUse.forEach((pair, idx) => {
      allCards.push({ id: `term-${idx}`, term: pair.term, definition: pair.definition, matched: false });
      allCards.push({ id: `def-${idx}`, term: pair.term, definition: pair.definition, matched: false });
    });
    
    setCards(allCards.sort(() => Math.random() - 0.5));
  }, [level, language]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.term === secondCard.term) {
        setMatched([...matched, first, second]);
        setCards(cards.map(c => 
          c.id === first || c.id === second ? { ...c, matched: true } : c
        ));
        playRetroSound('POWERUP');
      } else {
        playRetroSound('EXPLOSION');
      }

      setMoves(moves + 1);
      setTimeout(() => setFlipped([]), 600);
    }
  }, [flipped, cards, matched, moves]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const calculatedScore = Math.max(100 - moves * 5, 20) * (level / 5);
      setScore(calculatedScore);
      addTokens(Math.floor(calculatedScore));
      addXP(Math.floor(calculatedScore * 2));
      setGameOver(true);
      playRetroSound('SUCCESS');
    }
  }, [matched, cards, moves, level, addTokens, addXP]);

  const handleCardClick = (cardId: string) => {
    if (flipped.includes(cardId) || matched.includes(cardId)) return;
    if (flipped.length === 2) return;

    setFlipped([...flipped, cardId]);
    playRetroSound('COIN');
  };

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
              {l.finalScore}: <span className="text-cyan-300">{Math.floor(score)}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.moves}: <span className="text-yellow-400">{moves}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.tokens}: <span className="text-green-400">+{Math.floor(score)}</span>
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
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">{l.title}</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400">{l.level}</p>
              <p className="text-2xl font-bold text-cyan-300">{level}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400">{l.moves}</p>
              <p className="text-2xl font-bold text-yellow-300">{moves}</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400">{l.matched}</p>
              <p className="text-2xl font-bold text-green-300">{Math.floor(matched.length / 2)}/{pairsToUse.length}</p>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid gap-3 ${pairsToUse.length <= 4 ? 'grid-cols-4' : 'grid-cols-4 md:grid-cols-6'}`}>
          {cards.map(card => (
            <motion.button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg border-2 font-bold text-sm flex items-center justify-center transition ${
                matched.includes(card.id)
                  ? 'border-green-500 bg-green-900/30 text-green-300'
                  : flipped.includes(card.id)
                  ? 'border-cyan-500 bg-cyan-900/30 text-cyan-100'
                  : 'border-slate-600 bg-slate-800 hover:border-cyan-500 text-slate-400'
              }`}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? (
                <div className="text-center text-xs leading-tight px-1">
                  <div className="font-bold">{card.term}</div>
                  <div className="text-[10px] opacity-75">{card.definition}</div>
                </div>
              ) : (
                '?'
              )}
            </motion.button>
          ))}
        </div>

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
