import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { GAMES_CONFIG } from '../config/gameConfig';
import { Gamepad2, Trophy, Coins, TrendingUp, Settings } from 'lucide-react';

interface GameHubProfessionalProps {
  onSelectGame: (gameId: string, level: number) => void;
  language: 'es' | 'en';
}

export const GameHubProfessional: React.FC<GameHubProfessionalProps> = ({ onSelectGame, language }) => {
  const { profile } = usePlayer();
  const [selectedLevel, setSelectedLevel] = useState<Record<string, number>>({});
  const [showLevelSelector, setShowLevelSelector] = useState<string | null>(null);

  const labels = {
    es: {
      title: 'Centro de Juegos Profesional',
      welcome: 'Bienvenido',
      profile: 'Perfil',
      level: 'Nivel',
      xp: 'Experiencia',
      tokens: 'Tokens',
      games: 'Juegos Disponibles',
      selectLevel: 'Selecciona Nivel',
      play: 'Jugar',
      difficulty: 'Dificultad',
      reward: 'Recompensa',
      category: {
        legal: 'Legal',
        arcade: 'Arcade',
        puzzle: 'Puzzle',
        strategy: 'Estrategia'
      },
      difficulty_level: {
        easy: 'Fácil',
        medium: 'Medio',
        hard: 'Difícil'
      }
    },
    en: {
      title: 'Professional Game Center',
      welcome: 'Welcome',
      profile: 'Profile',
      level: 'Level',
      xp: 'Experience',
      tokens: 'Tokens',
      games: 'Available Games',
      selectLevel: 'Select Level',
      play: 'Play',
      difficulty: 'Difficulty',
      reward: 'Reward',
      category: {
        legal: 'Legal',
        arcade: 'Arcade',
        puzzle: 'Puzzle',
        strategy: 'Strategy'
      },
      difficulty_level: {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard'
      }
    }
  };

  const l = labels[language];
  const games = Object.values(GAMES_CONFIG).filter(g => g.enabled);

  const handlePlayGame = (gameId: string) => {
    const level = selectedLevel[gameId] || 1;
    onSelectGame(gameId, level);
    setShowLevelSelector(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'legal':
        return 'bg-indigo-900/30 border-indigo-500 text-indigo-300';
      case 'arcade':
        return 'bg-purple-900/30 border-purple-500 text-purple-300';
      case 'puzzle':
        return 'bg-cyan-900/30 border-cyan-500 text-cyan-300';
      case 'strategy':
        return 'bg-orange-900/30 border-orange-500 text-orange-300';
      default:
        return 'bg-slate-900/30 border-slate-500 text-slate-300';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-900 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
            <Gamepad2 size={32} />
            {l.title}
          </h1>

          {/* Profile Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Trophy size={14} />
                {l.level}
              </p>
              <p className="text-2xl font-bold text-cyan-300">{profile.level}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <TrendingUp size={14} />
                {l.xp}
              </p>
              <p className="text-2xl font-bold text-yellow-300">{(profile.xp % 500).toString().padStart(3, '0')}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Coins size={14} />
                {l.tokens}
              </p>
              <p className="text-2xl font-bold text-green-300">{profile.tokens.toString().padStart(4, '0')}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <Settings size={14} />
                {l.games}
              </p>
              <p className="text-2xl font-bold text-purple-300">{games.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {games.map(game => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-cyan-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity ${getCategoryColor(game.category)}`} />

                  {/* Content */}
                  <div className="relative p-6 h-full flex flex-col">
                    {/* Icon and Title */}
                    <div className="mb-4">
                      <div className="text-5xl mb-3">{game.icon}</div>
                      <h2 className="text-xl font-bold text-white">
                        {language === 'es' ? game.nameEs : game.nameEn}
                      </h2>
                      <p className="text-sm text-slate-400 mt-2">
                        {language === 'es' ? game.descriptionEs : game.descriptionEn}
                      </p>
                    </div>

                    {/* Category Badge */}
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-4 w-fit ${getCategoryColor(game.category)}`}>
                      {l.category[game.category as keyof typeof l.category]}
                    </div>

                    {/* Stats */}
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{l.difficulty}:</span>
                        <span className={`font-bold ${getDifficultyColor(game.difficulty)}`}>
                          {l.difficulty_level[game.difficulty as keyof typeof l.difficulty_level]}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">{l.reward}:</span>
                        <span className="font-bold text-green-400">+{game.baseTokenReward} tokens</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Niveles:</span>
                        <span className="font-bold text-cyan-400">{game.minLevel}-{game.maxLevel}</span>
                      </div>
                    </div>

                    {/* Level Selector */}
                    {showLevelSelector === game.id ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 mb-4"
                      >
                        <div className="grid grid-cols-5 gap-2">
                          {Array.from({ length: game.maxLevel }, (_, i) => i + 1).map(level => (
                            <button
                              key={level}
                              onClick={() => setSelectedLevel({ ...selectedLevel, [game.id]: level })}
                              className={`py-2 rounded-lg font-bold text-sm transition ${
                                (selectedLevel[game.id] || 1) === level
                                  ? 'bg-cyan-600 text-white'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <button
                          onClick={() => handlePlayGame(game.id)}
                          className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition"
                        >
                          {l.play}
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setShowLevelSelector(game.id)}
                        className="w-full px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                      >
                        {l.play}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
