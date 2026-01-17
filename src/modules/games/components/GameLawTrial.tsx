import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CaseOption {
  id: string;
  text: string;
  correct: boolean;
}

interface CaseItem {
  id: string;
  title: string;
  description: string;
  options: CaseOption[];
}

interface GameLawTrialProps {
  onExit: () => void;
}

const CASES: CaseItem[] = [
  {
    id: 'equal-start',
    title: 'FAIR START',
    description:
      'Dos jugadores desean entrar a un torneo. Uno tiene mucha experiencia, el otro es principiante. ¿Qué regla favorece un acceso más justo?',
    options: [
      {
        id: 'a',
        text: 'Permitir que ambos jueguen, pero ofrecer tutorial y práctica guiada al principiante.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Negar la entrada al principiante hasta que gane experiencia en otros torneos.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Permitir solo al jugador con más puntos previos, sin explicar el criterio.',
        correct: false,
      },
    ],
  },
  {
    id: 'transparent-rule',
    title: 'REGLAS CLARAS',
    description:
      'La administración cambia las reglas de puntuación a mitad de una temporada sin avisar. ¿Qué decisión se alinea mejor con principios de seguridad jurídica?',
    options: [
      {
        id: 'a',
        text: 'Aplicar las nuevas reglas solo a partir de la siguiente temporada, comunicándolo de forma clara.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Aplicar las reglas nuevas de forma retroactiva sin explicación.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Aplicar reglas distintas para cada jugador según conveniencia.',
        correct: false,
      },
    ],
  },
  {
    id: 'appeal-system',
    title: 'POSIBILIDAD DE RECLAMO',
    description:
      'Un jugador es expulsado del servidor por una supuesta infracción, pero no se le dio oportunidad de explicar lo ocurrido. ¿Qué ajuste mejora el sistema?',
    options: [
      {
        id: 'a',
        text: 'Crear un canal de apelación donde pueda exponer su versión de los hechos.',
        correct: true,
      },
      {
        id: 'b',
        text: 'Mantener las expulsiones automáticas sin registro ni revisión.',
        correct: false,
      },
      {
        id: 'c',
        text: 'Permitir expulsiones solo por decisión secreta de un único jugador veterano.',
        correct: false,
      },
    ],
  },
];

export const GameLawTrial: React.FC<GameLawTrialProps> = ({ onExit }) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answeredId, setAnsweredId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  const current = CASES[index];

  const handleSelect = (opt: CaseOption) => {
    if (answeredId || finished) return;
    setAnsweredId(opt.id);
    if (opt.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= CASES.length) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setAnsweredId(null);
  };

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setAnsweredId(null);
    setFinished(false);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center select-none">
      <div className="mb-4 flex items-center justify-between w-full max-w-xl px-4 text-[10px] md:text-xs font-['Share_Tech_Mono'] tracking-[0.35em] text-purple-200">
        <span>WILEX // JUSTICE CHAMBER</span>
        <span>
          SCORE {score}/{CASES.length}
        </span>
      </div>

      <div className="relative w-full max-w-xl rounded-2xl border border-purple-500/50 bg-slate-950/70 backdrop-blur-2xl overflow-hidden shadow-[0_0_32px_rgba(168,85,247,0.75)] p-4 md:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(88,28,135,0.5),transparent_60%)] opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(15,23,42,0.7)_40%,transparent_90%)]" />

        <div className="relative flex flex-col gap-3 md:gap-4">
          {!finished && (
            <>
              <div className="text-[11px] md:text-xs font-['Orbitron'] tracking-[0.3em] text-purple-200/90">
                CASE {(index + 1).toString().padStart(2, '0')}
              </div>
              <h2 className="text-sm md:text-base font-['Orbitron'] tracking-[0.2em] text-cyan-100">
                {current.title}
              </h2>
              <p className="text-[11px] md:text-sm text-slate-100/90 leading-relaxed">
                {current.description}
              </p>

              <div className="mt-2 flex flex-col gap-2">
                {current.options.map((opt) => {
                  const isSelected = answeredId === opt.id;
                  const isCorrect = opt.correct;
                  const showState = !!answeredId;

                  let borderColor = 'border-slate-500/50';
                  let bgColor = 'bg-slate-900/60';
                  if (showState && isSelected && isCorrect) {
                    borderColor = 'border-emerald-400/70';
                    bgColor = 'bg-emerald-900/40';
                  } else if (showState && isSelected && !isCorrect) {
                    borderColor = 'border-red-400/70';
                    bgColor = 'bg-red-900/40';
                  } else if (showState && !isSelected && isCorrect) {
                    borderColor = 'border-emerald-300/50';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(opt)}
                      className={`relative text-left w-full px-3 py-2 rounded-xl border ${borderColor} ${bgColor} backdrop-blur-md text-[11px] md:text-sm text-slate-100 hover:bg-slate-800/70 transition-colors`}
                    >
                      <span className="font-['Share_Tech_Mono'] mr-2 text-cyan-300/80">{opt.id.toUpperCase()}.</span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] md:text-xs font-['Share_Tech_Mono'] text-slate-300/80">
                <span>PRINCIPIOS · IGUALDAD · TRANSPARENCIA · RECLAMO</span>
                <button
                  onClick={handleNext}
                  disabled={!answeredId}
                  className="px-3 py-1 rounded-full border border-purple-400/70 bg-black/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/30"
                >
                  {index + 1 >= CASES.length ? 'FINALIZE' : 'NEXT CASE'}
                </button>
              </div>
            </>
          )}

          {finished && (
            <div className="flex flex-col items-center justify-center gap-3 py-6">
              <div className="text-xs md:text-sm font-['Orbitron'] tracking-[0.3em] text-emerald-300">
                SESSION SUMMARY
              </div>
              <div className="text-[12px] md:text-base font-['Share_Tech_Mono'] text-slate-100">
                YOU PASSED {score} / {CASES.length} JUSTICE CHECKPOINTS
              </div>
              <div className="text-[10px] md:text-xs text-slate-300/80 text-center max-w-sm">
                Este módulo no es asesoría legal real, pero entrena intuición sobre igualdad, reglas claras y derecho a ser oído.
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={resetGame}
                  className="px-3 py-1 rounded-full border border-cyan-400/70 bg-black/50 text-[10px] md:text-xs text-cyan-100 hover:bg-cyan-500/20"
                >
                  RESTART MODULE
                </button>
                <button
                  onClick={onExit}
                  className="px-3 py-1 rounded-full border border-slate-500/70 bg-black/40 text-[10px] md:text-xs text-slate-100 hover:bg-slate-700/40"
                >
                  BACK TO HUB
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between w-full max-w-xl px-4 text-[9px] md:text-[10px] font-['Share_Tech_Mono'] text-slate-300/80">
        <span>SELECT ANSWERS · NO HAY RESPUESTAS SECRETAS</span>
        <button
          onClick={onExit}
          className="px-3 py-1 rounded-full border border-slate-500/60 bg-black/40 hover:bg-slate-800/60"
        >
          EXIT HUB
        </button>
      </div>
    </div>
  );
};
