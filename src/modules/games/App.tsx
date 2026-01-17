import React, { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// Lazy load game hub
const GameHubProfessional = lazy(() => import('./components/GameHubProfessional').then(m => ({ default: m.GameHubProfessional })));

// Lazy load individual games
const GameWhoWantsToBeALawyer = lazy(() => import('./components/GameWhoWantsToBeALawyer').then(m => ({ default: m.GameWhoWantsToBeALawyer })));
const GameLegalTetris = lazy(() => import('./components/GameLegalTetris').then(m => ({ default: m.GameLegalTetris })));
const GameContractBuilder = lazy(() => import('./components/GameContractBuilder').then(m => ({ default: m.GameContractBuilder })));
const GameCaseManager = lazy(() => import('./components/GameCaseManager').then(m => ({ default: m.GameCaseManager })));
const GameLegalMemory = lazy(() => import('./components/GameLegalMemory').then(m => ({ default: m.GameLegalMemory })));
const GameLegalChess = lazy(() => import('./components/GameLegalChess').then(m => ({ default: m.GameLegalChess })));
const GameLegalCheckers = lazy(() => import('./components/GameLegalCheckers').then(m => ({ default: m.GameLegalCheckers })));
const GameLegalDomino = lazy(() => import('./components/GameLegalDomino').then(m => ({ default: m.GameLegalDomino })));

// Loading component
const LoadingScreen = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 to-black">
    <div className="text-center">
      <div className="mb-4 text-4xl">🎮</div>
      <p className="text-cyan-400 font-bold text-lg">Cargando Juego...</p>
      <div className="mt-4 flex gap-2 justify-center">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  </div>
);

type GameState = 'hub' | 'lawyer-trivia' | 'legal-tetris' | 'contract-builder' | 'case-manager' | 'legal-memory' | 'legal-chess' | 'legal-checkers' | 'legal-domino' | 'intro';

interface GameSelection {
  gameId: string;
  level: number;
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [selectedGame, setSelectedGame] = useState<GameSelection | null>(null);
  const [language] = useState<'es' | 'en'>('es');

  const handleSelectGame = (gameId: string, level: number) => {
    setSelectedGame({ gameId, level });
    setGameState(gameId as GameState);
  };

  const handleExit = () => {
    setGameState('hub');
    setSelectedGame(null);
  };

  const handleStartIntro = () => {
    setGameState('hub');
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-['Orbitron']">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black opacity-80 z-0" />

      {/* Main Content */}
      <div className="relative w-full h-full z-10">
        <Suspense fallback={<LoadingScreen />}>
          {gameState === 'intro' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 cursor-pointer"
              onClick={handleStartIntro}
            >
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <button className="relative px-8 py-4 bg-black rounded-lg border border-cyan-500/50 text-cyan-400 flex items-center gap-3 text-xl font-bold tracking-widest uppercase hover:text-white transition-colors">
                  <Play className="w-6 h-6 fill-current" /> Iniciar Sistema
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'hub' && (
            <GameHubProfessional 
              onSelectGame={handleSelectGame}
              language={language}
            />
          )}

          {gameState === 'lawyer-trivia' && selectedGame && (
            <GameWhoWantsToBeALawyer
              onExit={handleExit}
              language={language}
            />
          )}

          {gameState === 'legal-tetris' && selectedGame && (
            <GameLegalTetris
              onExit={handleExit}
              language={language}
            />
          )}

          {gameState === 'contract-builder' && selectedGame && (
            <GameContractBuilder
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}

          {gameState === 'case-manager' && selectedGame && (
            <GameCaseManager
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}

          {gameState === 'legal-memory' && selectedGame && (
            <GameLegalMemory
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}

          {gameState === 'legal-chess' && selectedGame && (
            <GameLegalChess
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}

          {gameState === 'legal-checkers' && selectedGame && (
            <GameLegalCheckers
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}

          {gameState === 'legal-domino' && selectedGame && (
            <GameLegalDomino
              onExit={handleExit}
              language={language}
              level={selectedGame.level}
            />
          )}
        </Suspense>
      </div>

      {/* Global Vignette/Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-[100] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-20" />
    </div>
  );
};

export default App;
