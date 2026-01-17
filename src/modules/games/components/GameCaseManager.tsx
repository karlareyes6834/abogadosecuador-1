import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface Case {
  id: string;
  titleEs: string;
  titleEn: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  deadline: number;
  reward: number;
  completed: boolean;
}

interface GameCaseManagerProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

const CASES_POOL: Case[] = [
  {
    id: 'case-1',
    titleEs: 'Defensa Penal - Robo',
    titleEn: 'Criminal Defense - Theft',
    priority: 'high',
    deadline: 30,
    reward: 100,
    completed: false
  },
  {
    id: 'case-2',
    titleEs: 'Litigio Civil - Contrato',
    titleEn: 'Civil Litigation - Contract',
    priority: 'medium',
    deadline: 45,
    reward: 80,
    completed: false
  },
  {
    id: 'case-3',
    titleEs: 'Derecho Laboral - Despido',
    titleEn: 'Labor Law - Dismissal',
    priority: 'high',
    deadline: 25,
    reward: 120,
    completed: false
  },
  {
    id: 'case-4',
    titleEs: 'Tránsito - Multa',
    titleEn: 'Traffic - Fine',
    priority: 'low',
    deadline: 60,
    reward: 50,
    completed: false
  },
  {
    id: 'case-5',
    titleEs: 'Derecho Comercial - Fusión',
    titleEn: 'Commercial Law - Merger',
    priority: 'critical',
    deadline: 15,
    reward: 150,
    completed: false
  },
  {
    id: 'case-6',
    titleEs: 'Aduanas - Liberación',
    titleEn: 'Customs - Release',
    priority: 'medium',
    deadline: 40,
    reward: 90,
    completed: false
  }
];

export const GameCaseManager: React.FC<GameCaseManagerProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [cases, setCases] = useState<Case[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const labels = {
    es: {
      title: 'Gestor de Casos',
      level: 'Nivel',
      timeRemaining: 'Tiempo Restante',
      completedCases: 'Casos Completados',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub',
      gameOver: 'TIEMPO AGOTADO',
      finalScore: 'Puntuación Final',
      priority: {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        critical: 'Crítica'
      }
    },
    en: {
      title: 'Case Manager',
      level: 'Level',
      timeRemaining: 'Time Remaining',
      completedCases: 'Completed Cases',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub',
      gameOver: 'TIME UP',
      finalScore: 'Final Score',
      priority: {
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical'
      }
    }
  };

  const l = labels[language];

  useEffect(() => {
    const selectedCases = CASES_POOL.sort(() => Math.random() - 0.5).slice(0, 3 + level);
    setCases(selectedCases);
  }, [level]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      setGameOver(true);
      const totalTokens = completedCount * 50 * (level / 5);
      addTokens(totalTokens);
      addXP(totalTokens * 2);
      playRetroSound('EXPLOSION');
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, completedCount, level, addTokens, addXP]);

  const handleCompleteCase = (caseId: string) => {
    const caseItem = cases.find(c => c.id === caseId);
    if (!caseItem || caseItem.completed) return;

    const newScore = score + caseItem.reward;
    setScore(newScore);
    setCompletedCount(completedCount + 1);
    
    setCases(cases.map(c => 
      c.id === caseId ? { ...c, completed: true } : c
    ));

    playRetroSound('POWERUP');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-900/30 border-red-500 text-red-300';
      case 'high':
        return 'bg-orange-900/30 border-orange-500 text-orange-300';
      case 'medium':
        return 'bg-yellow-900/30 border-yellow-500 text-yellow-300';
      default:
        return 'bg-green-900/30 border-green-500 text-green-300';
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
          <h2 className="text-4xl font-bold text-cyan-400">{l.gameOver}</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {l.finalScore}: <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.completedCases}: <span className="text-green-400">{completedCount}</span>
            </p>
            <p className="text-lg text-slate-300">
              {l.tokens}: <span className="text-green-400">+{Math.floor(completedCount * 50 * (level / 5))}</span>
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
    <div className="w-full h-full flex flex-col bg-gradient-to-b from-slate-900 to-black p-4 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">{l.title}</h1>
        
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400">{l.level}</p>
            <p className="text-2xl font-bold text-cyan-300">{level}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400">{l.timeRemaining}</p>
            <p className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
              <Clock size={20} />
              {timeRemaining}s
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <p className="text-xs text-slate-400">{l.score}</p>
            <p className="text-2xl font-bold text-green-300">{score}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: '100%' }}
            animate={{ width: `${(timeRemaining / 120) * 100}%` }}
          />
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <AnimatePresence>
          {cases.map(caseItem => (
            <motion.button
              key={caseItem.id}
              onClick={() => handleCompleteCase(caseItem.id)}
              disabled={caseItem.completed}
              whileHover={{ scale: caseItem.completed ? 1 : 1.02 }}
              className={`p-4 rounded-lg border-2 text-left transition ${
                caseItem.completed
                  ? 'border-green-500 bg-green-900/20 opacity-60'
                  : `border-2 ${getPriorityColor(caseItem.priority)}`
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-white">
                    {language === 'es' ? caseItem.titleEs : caseItem.titleEn}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {l.priority[caseItem.priority as keyof typeof l.priority]}
                  </p>
                </div>
                {caseItem.completed ? (
                  <CheckCircle size={24} className="text-green-400" />
                ) : (
                  <AlertCircle size={24} className="text-orange-400" />
                )}
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-bold text-cyan-300">+{caseItem.reward} pts</span>
                {!caseItem.completed && (
                  <span className="text-xs text-slate-400">{caseItem.deadline}s</span>
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      <button
        onClick={onExit}
        className="w-full mt-6 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold transition"
      >
        {l.backToHub}
      </button>
    </div>
  );
};
