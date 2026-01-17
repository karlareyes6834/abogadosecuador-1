import React, { useState, useEffect } from 'react';
import { FaTrophy, FaRedo, FaBrain } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

// Preguntas legales para jugar
const LEGAL_QUESTIONS = [
  { q: '¿Qué código regula el derecho penal?', a: 'COIP', wrong: ['Código Civil', 'Código de Trabajo'] },
  { q: '¿Cuántos días de vacaciones por año?', a: '15 días', wrong: ['20 días', '30 días'] },
  { q: '¿Edad de mayoría de edad en Ecuador?', a: '18 años', wrong: ['16 años', '21 años'] },
  { q: '¿Capital mínimo para Cía. Ltda.?', a: '$400', wrong: ['$100', '$800'] },
  { q: '¿Qué es RUC?', a: 'Registro Único de Contribuyentes', wrong: ['Reglamento', 'Requisito'] },
  { q: '¿Jornada laboral semanal?', a: '40 horas', wrong: ['48 horas', '35 horas'] },
  { q: '¿Hasta qué edad se paga pensión alimenticia?', a: '21 años', wrong: ['18 años', '25 años'] },
  { q: '¿Qué es la flagrancia?', a: 'Sorprender en delito', wrong: ['Tipo de pena', 'Un recurso'] },
  { q: '¿Recargo por horas extras?', a: '50%', wrong: ['25%', '100%'] },
  { q: '¿Pena máxima de prisión?', a: '40 años', wrong: ['25 años', '30 años'] }
];

const LegalTicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, ai: 0, draws: 0 });
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameMode, setGameMode] = useState('question'); // 'question' or 'classic'

  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6] // Diagonales
  ];

  const checkWinner = (currentBoard) => {
    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], combo };
      }
    }
    if (!currentBoard.includes(null)) return { winner: 'draw' };
    return null;
  };

  const makeAIMove = (currentBoard) => {
    // IA con estrategia básica
    const emptyCells = currentBoard.map((cell, index) => cell === null ? index : null).filter(i => i !== null);
    
    // 1. Intentar ganar
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = 'O';
      if (checkWinner(testBoard)?.winner === 'O') return cell;
    }

    // 2. Bloquear al jugador
    for (const cell of emptyCells) {
      const testBoard = [...currentBoard];
      testBoard[cell] = 'X';
      if (checkWinner(testBoard)?.winner === 'X') return cell;
    }

    // 3. Tomar el centro
    if (emptyCells.includes(4)) return 4;

    // 4. Tomar esquinas
    const corners = [0, 2, 6, 8].filter(i => emptyCells.includes(i));
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

    // 5. Cualquier celda vacía
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner && !showQuestion) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board);
        handleMove(aiMove, false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, board, winner, showQuestion]);

  const handleCellClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;

    if (gameMode === 'question') {
      // Mostrar pregunta antes de permitir el movimiento
      setSelectedCell(index);
      const randomQ = LEGAL_QUESTIONS[Math.floor(Math.random() * LEGAL_QUESTIONS.length)];
      setCurrentQuestion(randomQ);
      setShowQuestion(true);
    } else {
      // Modo clásico - movimiento directo
      handleMove(index, true);
    }
  };

  const handleAnswer = (answer) => {
    const correct = answer === currentQuestion.a;
    
    if (correct) {
      toast.success('¡Correcto! Puedes hacer tu movimiento');
      handleMove(selectedCell, true);
    } else {
      toast.error('Incorrecto. Pierdes tu turno');
      setIsPlayerTurn(false);
    }
    
    setShowQuestion(false);
    setCurrentQuestion(null);
    setSelectedCell(null);
  };

  const handleMove = (index, isPlayer) => {
    const newBoard = [...board];
    newBoard[index] = isPlayer ? 'X' : 'O';
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      if (result.winner === 'X') {
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast.success('¡Ganaste! 🎉');
      } else if (result.winner === 'O') {
        setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
        toast.error('La IA ganó 🤖');
      } else {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
        toast.info('¡Empate!');
      }
    } else {
      setIsPlayerTurn(!isPlayer);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    setShowQuestion(false);
    setCurrentQuestion(null);
    setSelectedCell(null);
  };

  const getCellIcon = (value) => {
    if (value === 'X') return '⚖️'; // Balanza de justicia para jugador
    if (value === 'O') return '🤖'; // Robot para IA
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Tres en Raya Legal
          </h1>
          
          {/* Selector de modo */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => { setGameMode('question'); resetGame(); }}
              className={`flex-1 py-3 rounded-lg transition ${
                gameMode === 'question'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaBrain className="inline mr-2" />
              Modo Pregunta
            </button>
            <button
              onClick={() => { setGameMode('classic'); resetGame(); }}
              className={`flex-1 py-3 rounded-lg transition ${
                gameMode === 'classic'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Modo Clásico
            </button>
          </div>

          {/* Marcador */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-green-600">{scores.player}</p>
              <p className="text-sm text-gray-600">Tú ⚖️</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-600">{scores.draws}</p>
              <p className="text-sm text-gray-600">Empates</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-2xl font-bold text-red-600">{scores.ai}</p>
              <p className="text-sm text-gray-600">IA 🤖</p>
            </div>
          </div>
        </div>

        {/* Tablero */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {board.map((cell, index) => {
              const isWinningCell = winner?.combo?.includes(index);
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: cell || winner ? 1 : 1.05 }}
                  whileTap={{ scale: cell || winner ? 1 : 0.95 }}
                  onClick={() => handleCellClick(index)}
                  disabled={!!cell || !!winner || !isPlayerTurn}
                  className={`aspect-square rounded-xl text-6xl font-bold transition-all ${
                    isWinningCell
                      ? 'bg-yellow-200 border-4 border-yellow-500'
                      : cell
                      ? 'bg-gray-100'
                      : 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200'
                  } ${!cell && isPlayerTurn && !winner ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  {getCellIcon(cell)}
                </motion.button>
              );
            })}
          </div>

          {/* Status */}
          <div className="text-center mt-6">
            {winner ? (
              <div>
                <p className="text-2xl font-bold mb-4">
                  {winner.winner === 'X' ? '🎉 ¡Ganaste!' :
                   winner.winner === 'O' ? '🤖 La IA ganó' :
                   '🤝 Empate'}
                </p>
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2 mx-auto"
                >
                  <FaRedo /> Jugar de Nuevo
                </button>
              </div>
            ) : (
              <p className="text-xl font-semibold">
                {isPlayerTurn ? 'Tu turno ⚖️' : 'Turno de la IA 🤖'}
              </p>
            )}
          </div>
        </div>

        {/* Modal de Pregunta */}
        <AnimatePresence>
          {showQuestion && currentQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowQuestion(false);
                setSelectedCell(null);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Responde para hacer tu movimiento:
                </h3>
                <p className="text-lg text-gray-700 mb-6">{currentQuestion.q}</p>
                <div className="space-y-3">
                  {[currentQuestion.a, ...currentQuestion.wrong]
                    .sort(() => Math.random() - 0.5)
                    .map((answer, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(answer)}
                        className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition border-2 border-blue-200 hover:border-blue-400"
                      >
                        {answer}
                      </button>
                    ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instrucciones */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-3">Cómo Jugar:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Modo Pregunta:</strong> Responde correctamente para hacer tu movimiento</li>
            <li>• <strong>Modo Clásico:</strong> Juego tradicional sin preguntas</li>
            <li>• Consigue 3 en línea (horizontal, vertical o diagonal) para ganar</li>
            <li>• La IA es inteligente y bloqueará tus intentos</li>
            <li>• ⚖️ Tú juegas con la balanza de la justicia</li>
            <li>• 🤖 La IA juega con su emoji</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LegalTicTacToe;
