import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';
import { Volume2, VolumeX } from 'lucide-react';

interface Question {
  es: string;
  en: string;
  options: {
    es: string[];
    en: string[];
  };
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: {
    es: string;
    en: string;
  };
}

const QUESTIONS: Question[] = [
  {
    es: '¿Cuál es el código legal que rige los procesos penales en Ecuador?',
    en: 'What is the legal code that governs criminal processes in Ecuador?',
    options: {
      es: ['Código Penal', 'Código de Procedimiento Penal', 'Código Civil', 'Código Comercial'],
      en: ['Penal Code', 'Criminal Procedure Code', 'Civil Code', 'Commercial Code']
    },
    correctAnswer: 1,
    category: 'Derecho Penal',
    difficulty: 'easy',
    explanation: {
      es: 'El Código de Procedimiento Penal es el que rige los procesos penales en Ecuador.',
      en: 'The Criminal Procedure Code governs criminal processes in Ecuador.'
    }
  },
  {
    es: '¿Cuál es el plazo máximo para presentar una demanda civil?',
    en: 'What is the maximum deadline to file a civil lawsuit?',
    options: {
      es: ['1 año', '2 años', '3 años', '5 años'],
      en: ['1 year', '2 years', '3 years', '5 years']
    },
    correctAnswer: 2,
    category: 'Derecho Civil',
    difficulty: 'medium',
    explanation: {
      es: 'El plazo de prescripción para acciones civiles ordinarias es de 3 años.',
      en: 'The statute of limitations for ordinary civil actions is 3 years.'
    }
  },
  {
    es: '¿Qué es un habeas corpus?',
    en: 'What is a habeas corpus?',
    options: {
      es: ['Una acción para proteger la libertad personal', 'Un contrato mercantil', 'Una multa de tránsito', 'Un documento notarial'],
      en: ['An action to protect personal freedom', 'A commercial contract', 'A traffic fine', 'A notarial document']
    },
    correctAnswer: 0,
    category: 'Derechos Constitucionales',
    difficulty: 'medium',
    explanation: {
      es: 'El habeas corpus es una acción constitucional para proteger la libertad personal.',
      en: 'Habeas corpus is a constitutional action to protect personal freedom.'
    }
  },
  {
    es: '¿Cuál es la pena máxima por homicidio en Ecuador?',
    en: 'What is the maximum penalty for homicide in Ecuador?',
    options: {
      es: ['10 años', '15 años', '20 años', '25 años'],
      en: ['10 years', '15 years', '20 years', '25 years']
    },
    correctAnswer: 2,
    category: 'Derecho Penal',
    difficulty: 'hard',
    explanation: {
      es: 'La pena máxima por homicidio es de 20 años según el Código Penal ecuatoriano.',
      en: 'The maximum penalty for homicide is 20 years under the Ecuadorian Penal Code.'
    }
  },
  {
    es: '¿Qué es una acción de protección?',
    en: 'What is a protection action?',
    options: {
      es: ['Una demanda civil ordinaria', 'Una acción constitucional para proteger derechos', 'Un recurso de apelación', 'Una medida cautelar'],
      en: ['An ordinary civil lawsuit', 'A constitutional action to protect rights', 'An appeal remedy', 'A precautionary measure']
    },
    correctAnswer: 1,
    category: 'Derechos Constitucionales',
    difficulty: 'medium',
    explanation: {
      es: 'La acción de protección es una acción constitucional para proteger derechos fundamentales.',
      en: 'The protection action is a constitutional action to protect fundamental rights.'
    }
  }
];

interface GameWhoWantsToBeALawyerProps {
  onExit: () => void;
  language: 'es' | 'en';
}

export const GameWhoWantsToBeALawyer: React.FC<GameWhoWantsToBeALawyerProps> = ({ onExit, language }) => {
  const { addTokens, addXP } = usePlayer();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const question = QUESTIONS[currentQuestion];
  const text = language === 'es' ? question.es : question.en;
  const options = language === 'es' ? question.options.es : question.options.en;
  const explanation = language === 'es' ? question.explanation.es : question.explanation.en;

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === question.correctAnswer) {
      const points = question.difficulty === 'easy' ? 10 : question.difficulty === 'medium' ? 20 : 30;
      setScore(score + points);
      addTokens(points);
      addXP(points * 2);
      if (soundEnabled) playRetroSound('SUCCESS');
    } else {
      if (soundEnabled) playRetroSound('EXPLOSION');
    }
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameOver(true);
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
          <h2 className="text-4xl font-bold text-cyan-400">GAME OVER</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {language === 'es' ? 'Puntuación Final:' : 'Final Score:'} <span className="text-cyan-300">{score}</span>
            </p>
            <p className="text-lg text-slate-300">
              {language === 'es' ? 'Tokens Ganados:' : 'Tokens Earned:'} <span className="text-green-400">+{score}</span>
            </p>
          </div>
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition"
          >
            {language === 'es' ? 'Volver al Hub' : 'Back to Hub'}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4 overflow-y-auto">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-cyan-400">
            {language === 'es' ? '¿Quién Quiere Ser Abogado?' : 'Who Wants to Be a Lawyer?'}
          </h1>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <span>{language === 'es' ? 'Pregunta' : 'Question'} {currentQuestion + 1}/{QUESTIONS.length}</span>
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-800 rounded-lg border border-cyan-500/30 p-6 mb-6"
      >
        <div className="mb-4">
          <p className="text-xs text-cyan-400 mb-2">
            {language === 'es' ? 'Categoría:' : 'Category:'} {question.category} • 
            <span className={`ml-2 ${question.difficulty === 'easy' ? 'text-green-400' : question.difficulty === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
              {question.difficulty.toUpperCase()}
            </span>
          </p>
          <h2 className="text-xl font-bold text-white">{text}</h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
              className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition ${
                selectedAnswer === null
                  ? 'border-slate-600 bg-slate-700 hover:border-cyan-500 text-white cursor-pointer'
                  : index === question.correctAnswer
                  ? 'border-green-500 bg-green-900/30 text-green-300'
                  : index === selectedAnswer
                  ? 'border-red-500 bg-red-900/30 text-red-300'
                  : 'border-slate-600 bg-slate-700 text-slate-400'
              }`}
            >
              {String.fromCharCode(65 + index)}. {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-2xl bg-slate-700 rounded-lg p-4 mb-6 border border-cyan-500/20"
          >
            <p className="text-sm text-slate-200 mb-4">{explanation}</p>
            <button
              onClick={handleNext}
              className="w-full px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition"
            >
              {currentQuestion < QUESTIONS.length - 1 ? (language === 'es' ? 'Siguiente' : 'Next') : (language === 'es' ? 'Finalizar' : 'Finish')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Score */}
      <div className="text-center text-cyan-300 font-bold">
        {language === 'es' ? 'Puntuación:' : 'Score:'} {score}
      </div>
    </div>
  );
};
