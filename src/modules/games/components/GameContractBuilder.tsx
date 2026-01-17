import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '../contexts/PlayerContext';
import { playRetroSound } from '../utils/audio';

interface ContractClause {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: 'parties' | 'obligations' | 'termination' | 'liability' | 'payment';
  required: boolean;
  level: number;
}

interface GameContractBuilderProps {
  onExit: () => void;
  language: 'es' | 'en';
  level: number;
}

const CONTRACT_CLAUSES: ContractClause[] = [
  {
    id: 'parties',
    titleEs: 'Identificación de Partes',
    titleEn: 'Identification of Parties',
    descriptionEs: 'Define claramente quiénes son las partes del contrato',
    descriptionEn: 'Clearly define who are the parties to the contract',
    category: 'parties',
    required: true,
    level: 1
  },
  {
    id: 'consideration',
    titleEs: 'Contraprestación',
    titleEn: 'Consideration',
    descriptionEs: 'Especifica qué recibe cada parte a cambio',
    descriptionEn: 'Specify what each party receives in exchange',
    category: 'payment',
    required: true,
    level: 1
  },
  {
    id: 'obligations',
    titleEs: 'Obligaciones Mutuas',
    titleEn: 'Mutual Obligations',
    descriptionEs: 'Define las responsabilidades de cada parte',
    descriptionEn: 'Define the responsibilities of each party',
    category: 'obligations',
    required: true,
    level: 1
  },
  {
    id: 'payment-terms',
    titleEs: 'Términos de Pago',
    titleEn: 'Payment Terms',
    descriptionEs: 'Establece plazos y condiciones de pago',
    descriptionEn: 'Establish payment deadlines and conditions',
    category: 'payment',
    required: true,
    level: 2
  },
  {
    id: 'termination',
    titleEs: 'Cláusula de Terminación',
    titleEn: 'Termination Clause',
    descriptionEs: 'Especifica cómo y cuándo puede terminar el contrato',
    descriptionEn: 'Specify how and when the contract can terminate',
    category: 'termination',
    required: true,
    level: 2
  },
  {
    id: 'liability',
    titleEs: 'Limitación de Responsabilidad',
    titleEn: 'Liability Limitation',
    descriptionEs: 'Define límites de responsabilidad por incumplimiento',
    descriptionEn: 'Define liability limits for breach',
    category: 'liability',
    required: false,
    level: 3
  },
  {
    id: 'confidentiality',
    titleEs: 'Confidencialidad',
    titleEn: 'Confidentiality',
    descriptionEs: 'Protege información sensible de las partes',
    descriptionEn: 'Protects sensitive information of the parties',
    category: 'obligations',
    required: false,
    level: 3
  },
  {
    id: 'dispute-resolution',
    titleEs: 'Resolución de Disputas',
    titleEn: 'Dispute Resolution',
    descriptionEs: 'Establece mecanismo para resolver conflictos',
    descriptionEn: 'Establish mechanism to resolve conflicts',
    category: 'termination',
    required: false,
    level: 4
  }
];

export const GameContractBuilder: React.FC<GameContractBuilderProps> = ({ onExit, language, level }) => {
  const { addTokens, addXP } = usePlayer();
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const labels = {
    es: {
      title: 'Constructor de Contratos',
      level: 'Nivel',
      selectClauses: 'Selecciona las cláusulas necesarias',
      required: 'Requerida',
      optional: 'Opcional',
      submit: 'Completar Contrato',
      success: '¡Contrato válido!',
      incomplete: 'Faltan cláusulas requeridas',
      score: 'Puntuación',
      tokens: 'Tokens Ganados',
      backToHub: 'Volver al Hub'
    },
    en: {
      title: 'Contract Builder',
      level: 'Level',
      selectClauses: 'Select the necessary clauses',
      required: 'Required',
      optional: 'Optional',
      submit: 'Complete Contract',
      success: 'Valid contract!',
      incomplete: 'Missing required clauses',
      score: 'Score',
      tokens: 'Tokens Earned',
      backToHub: 'Back to Hub'
    }
  };

  const l = labels[language];
  const availableClauses = CONTRACT_CLAUSES.filter(c => c.level <= level);
  const requiredClauses = availableClauses.filter(c => c.required);

  const handleSelectClause = (clauseId: string) => {
    if (selectedClauses.includes(clauseId)) {
      setSelectedClauses(selectedClauses.filter(id => id !== clauseId));
    } else {
      setSelectedClauses([...selectedClauses, clauseId]);
    }
    playRetroSound('COIN');
  };

  const handleSubmit = () => {
    const hasAllRequired = requiredClauses.every(c => selectedClauses.includes(c.id));
    
    if (!hasAllRequired) {
      setFeedback(l.incomplete);
      playRetroSound('EXPLOSION');
      return;
    }

    const calculatedScore = selectedClauses.length * 20;
    const tokens = Math.floor(calculatedScore * (level / 5));
    const xp = tokens * 2;

    setScore(calculatedScore);
    addTokens(tokens);
    addXP(xp);
    setFeedback(l.success);
    playRetroSound('SUCCESS');
    setTimeout(() => setGameOver(true), 2000);
  };

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-black p-4"
      >
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-cyan-400">CONTRATO COMPLETADO</h2>
          <div className="space-y-2">
            <p className="text-2xl text-white">
              {l.score}: <span className="text-cyan-300">{score}</span>
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
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">{l.title}</h1>
          <p className="text-slate-300">{l.level} {level} - {l.selectClauses}</p>
        </div>

        {/* Clauses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableClauses.map(clause => (
            <motion.button
              key={clause.id}
              onClick={() => handleSelectClause(clause.id)}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 text-left transition ${
                selectedClauses.includes(clause.id)
                  ? 'border-cyan-500 bg-cyan-900/30'
                  : 'border-slate-600 bg-slate-800 hover:border-cyan-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-white">
                  {language === 'es' ? clause.titleEs : clause.titleEn}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  clause.required
                    ? 'bg-red-600/30 text-red-300'
                    : 'bg-blue-600/30 text-blue-300'
                }`}>
                  {clause.required ? l.required : l.optional}
                </span>
              </div>
              <p className="text-sm text-slate-300">
                {language === 'es' ? clause.descriptionEs : clause.descriptionEn}
              </p>
              {selectedClauses.includes(clause.id) && (
                <div className="mt-3 text-cyan-400 text-sm font-bold">✓ Seleccionada</div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-lg text-center font-bold ${
                feedback === l.success
                  ? 'bg-green-900/30 text-green-300 border border-green-500'
                  : 'bg-red-900/30 text-red-300 border border-red-500'
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full px-6 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition"
        >
          {l.submit}
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
