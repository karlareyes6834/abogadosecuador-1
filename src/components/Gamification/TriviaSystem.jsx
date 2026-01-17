import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaGamepad, FaClock, FaCheckCircle, FaTimesCircle, FaStar, FaLightbulb, FaCoins, FaFire } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const TriviaSystem = ({ courseId, userId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [powerUps, setPowerUps] = useState({
    fiftyFifty: 2,
    skipQuestion: 1,
    extraTime: 1,
    hint: 3
  });
  const [usedPowerUp, setUsedPowerUp] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('classic'); // classic, timeAttack, survival
  const [multiplier, setMultiplier] = useState(1);

  // Preguntas de ejemplo con diferentes niveles de dificultad
  const [questions] = useState([
    {
      id: 1,
      question: "¿Cuál es el plazo para presentar una demanda por daños y perjuicios en Ecuador?",
      options: ["1 año", "2 años", "3 años", "5 años"],
      correct: 1,
      difficulty: "medium",
      category: "Derecho Civil",
      explanation: "Según el Código Civil ecuatoriano, el plazo es de 2 años desde que se produjo el daño.",
      coins: 10,
      hint: "Piensa en un plazo intermedio, no muy corto ni muy largo."
    },
    {
      id: 2,
      question: "¿Qué tipo de contrato requiere necesariamente escritura pública?",
      options: ["Arrendamiento", "Compraventa de inmuebles", "Prestación de servicios", "Compraventa de vehículos"],
      correct: 1,
      difficulty: "easy",
      category: "Derecho Civil",
      explanation: "La compraventa de bienes inmuebles debe realizarse mediante escritura pública ante notario.",
      coins: 5,
      hint: "Los bienes raíces siempre requieren mayor formalidad."
    },
    {
      id: 3,
      question: "¿Cuál es la pena máxima en Ecuador para delitos graves?",
      options: ["25 años", "30 años", "35 años", "40 años"],
      correct: 3,
      difficulty: "hard",
      category: "Derecho Penal",
      explanation: "La pena máxima en Ecuador es de 40 años de privación de libertad para delitos graves.",
      coins: 20,
      hint: "Es la pena más alta permitida por la Constitución."
    },
    {
      id: 4,
      question: "¿Qué documento es obligatorio portar al conducir?",
      options: ["Solo licencia", "Licencia y matrícula", "Licencia, matrícula y SOAT", "Solo matrícula"],
      correct: 2,
      difficulty: "easy",
      category: "Derecho de Tránsito",
      explanation: "Es obligatorio portar licencia de conducir, matrícula del vehículo y SOAT vigente.",
      coins: 5,
      hint: "Son tres documentos esenciales para circular."
    },
    {
      id: 5,
      question: "¿Cuál es el tiempo mínimo de constitución para una empresa en Ecuador?",
      options: ["15 días", "30 días", "45 días", "60 días"],
      correct: 1,
      difficulty: "medium",
      category: "Derecho Comercial",
      explanation: "Con los procesos simplificados actuales, una empresa puede constituirse en aproximadamente 30 días.",
      coins: 10,
      hint: "Aproximadamente un mes con todos los trámites."
    }
  ]);

  // Timer para cada pregunta
  useEffect(() => {
    if (timeLeft > 0 && !showScore && !showCorrectAnswer) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showCorrectAnswer) {
      handleTimeout();
    }
  }, [timeLeft, showScore, showCorrectAnswer]);

  // Cargar leaderboard
  useEffect(() => {
    fetchLeaderboard();
    loadUserAchievements();
  }, []);

  const fetchLeaderboard = async () => {
    // Simulación de leaderboard
    const mockLeaderboard = [
      { rank: 1, name: "María G.", score: 2850, streak: 15 },
      { rank: 2, name: "Carlos R.", score: 2720, streak: 12 },
      { rank: 3, name: "Ana L.", score: 2650, streak: 10 },
      { rank: 4, name: "Juan P.", score: 2400, streak: 8 },
      { rank: 5, name: "Laura M.", score: 2200, streak: 7 }
    ];
    setLeaderboard(mockLeaderboard);
    setUserRank(6);
  };

  const loadUserAchievements = () => {
    // Cargar logros del usuario
    const userAchievements = [
      { id: 1, name: "Primera Victoria", icon: "🏆", unlocked: true },
      { id: 2, name: "Racha de 5", icon: "🔥", unlocked: false },
      { id: 3, name: "Experto Legal", icon: "⚖️", unlocked: false },
      { id: 4, name: "Estudiante Dedicado", icon: "📚", unlocked: true },
      { id: 5, name: "Maestro del Tiempo", icon: "⏱️", unlocked: false }
    ];
    setAchievements(userAchievements);
  };

  const handleTimeout = () => {
    setShowCorrectAnswer(true);
    setStreak(0);
    setMultiplier(1);
    toast.error('¡Se acabó el tiempo!');
    setTimeout(() => nextQuestion(), 2000);
  };

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswer !== null || showCorrectAnswer) return;
    
    setSelectedAnswer(answerIndex);
    setShowCorrectAnswer(true);
    
    const question = questions[currentQuestion];
    const isCorrect = answerIndex === question.correct;
    
    if (isCorrect) {
      const earnedCoins = Math.floor(question.coins * multiplier);
      setScore(score + earnedCoins);
      setTotalCoins(totalCoins + earnedCoins);
      setStreak(streak + 1);
      
      // Aumentar multiplicador cada 3 respuestas correctas seguidas
      if ((streak + 1) % 3 === 0) {
        setMultiplier(Math.min(multiplier + 0.5, 3));
        toast.success(`¡Multiplicador x${Math.min(multiplier + 0.5, 3)}!`);
      }
      
      // Efectos visuales para respuesta correcta
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      toast.success(`¡Correcto! +${earnedCoins} monedas`);
      
      // Verificar logros
      checkAchievements(streak + 1);
    } else {
      setStreak(0);
      setMultiplier(1);
      toast.error('Respuesta incorrecta');
    }
    
    setTimeout(() => nextQuestion(), 3000);
  };

  const nextQuestion = () => {
    const nextQ = currentQuestion + 1;
    if (nextQ < questions.length) {
      setCurrentQuestion(nextQ);
      setSelectedAnswer(null);
      setShowCorrectAnswer(false);
      setTimeLeft(30);
      setUsedPowerUp(false);
    } else {
      setShowScore(true);
      saveResults();
    }
  };

  const checkAchievements = (currentStreak) => {
    // Sistema de logros
    if (currentStreak === 5 && !achievements.find(a => a.id === 2)?.unlocked) {
      const newAchievements = achievements.map(a => 
        a.id === 2 ? { ...a, unlocked: true } : a
      );
      setAchievements(newAchievements);
      toast.success('🏆 ¡Logro desbloqueado: Racha de 5!');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const saveResults = async () => {
    // Guardar resultados en la base de datos
    try {
      const results = {
        userId,
        courseId,
        score,
        totalCoins,
        maxStreak: streak,
        completedAt: new Date().toISOString()
      };
      // API call aquí
      console.log('Guardando resultados:', results);
    } catch (error) {
      console.error('Error al guardar resultados:', error);
    }
  };

  // Power-ups del juego
  const useFiftyFifty = () => {
    if (powerUps.fiftyFifty > 0 && !usedPowerUp && !showCorrectAnswer) {
      const question = questions[currentQuestion];
      const correctAnswer = question.correct;
      const incorrectAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
      
      // Eliminar 2 respuestas incorrectas aleatorias
      const toRemove = incorrectAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
      
      // Marcar las opciones eliminadas
      const options = document.querySelectorAll('.answer-option');
      toRemove.forEach(index => {
        if (options[index]) {
          options[index].style.opacity = '0.3';
          options[index].style.pointerEvents = 'none';
        }
      });
      
      setPowerUps({ ...powerUps, fiftyFifty: powerUps.fiftyFifty - 1 });
      setUsedPowerUp(true);
      toast.success('50/50 activado!');
    }
  };

  const useSkipQuestion = () => {
    if (powerUps.skipQuestion > 0 && !showCorrectAnswer) {
      setPowerUps({ ...powerUps, skipQuestion: powerUps.skipQuestion - 1 });
      nextQuestion();
      toast.info('Pregunta saltada');
    }
  };

  const useExtraTime = () => {
    if (powerUps.extraTime > 0 && !usedPowerUp && !showCorrectAnswer) {
      setTimeLeft(timeLeft + 15);
      setPowerUps({ ...powerUps, extraTime: powerUps.extraTime - 1 });
      setUsedPowerUp(true);
      toast.success('+15 segundos!');
    }
  };

  const useHint = () => {
    if (powerUps.hint > 0 && !showCorrectAnswer) {
      const question = questions[currentQuestion];
      setPowerUps({ ...powerUps, hint: powerUps.hint - 1 });
      toast.info(question.hint, { duration: 5000 });
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
    setTimeLeft(30);
    setStreak(0);
    setMultiplier(1);
    setPowerUps({
      fiftyFifty: 2,
      skipQuestion: 1,
      extraTime: 1,
      hint: 3
    });
    setUsedPowerUp(false);
  };

  if (showScore) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl shadow-2xl p-8 text-white max-w-2xl mx-auto"
      >
        <div className="text-center">
          <FaTrophy className="text-6xl mx-auto mb-4 text-yellow-400" />
          <h2 className="text-3xl font-bold mb-4">¡Trivia Completada!</h2>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm opacity-90">Puntuación Final</p>
                <p className="text-4xl font-bold">{score}</p>
              </div>
              <div>
                <p className="text-sm opacity-90">Monedas Ganadas</p>
                <p className="text-4xl font-bold flex items-center justify-center">
                  <FaCoins className="mr-2 text-yellow-400" />{totalCoins}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xs">Correctas</p>
                <p className="text-xl font-bold">{Math.floor(score/10)}/{questions.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xs">Racha Máxima</p>
                <p className="text-xl font-bold flex items-center justify-center">
                  <FaFire className="mr-1 text-orange-400" />{streak}
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-xs">Precisión</p>
                <p className="text-xl font-bold">{Math.round((score/(questions.length*10))*100)}%</p>
              </div>
            </div>
          </div>

          {/* Tabla de clasificación */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center justify-center">
              <FaTrophy className="mr-2 text-yellow-400" />
              Tabla de Clasificación
            </h3>
            <div className="space-y-2">
              {leaderboard.slice(0, 3).map((player, index) => (
                <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                  <div className="flex items-center">
                    <span className="text-lg font-bold mr-3">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span>{player.name}</span>
                  </div>
                  <span className="font-bold">{player.score}</span>
                </div>
              ))}
              {userRank > 3 && (
                <>
                  <div className="text-center opacity-50">...</div>
                  <div className="flex items-center justify-between bg-white/20 rounded-lg px-3 py-2 border-2 border-white/30">
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-3">#{userRank}</span>
                      <span>Tú</span>
                    </div>
                    <span className="font-bold">{score}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Logros desbloqueados */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Logros</h3>
            <div className="flex justify-center gap-3">
              {achievements.filter(a => a.unlocked).map(achievement => (
                <div key={achievement.id} className="text-center">
                  <div className="text-3xl mb-1">{achievement.icon}</div>
                  <p className="text-xs">{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Jugar de Nuevo
            </button>
            <button
              onClick={() => window.location.href = `/cursos/${courseId}`}
              className="px-6 py-3 bg-purple-800 text-white rounded-lg font-semibold hover:bg-purple-900 transition-colors"
            >
              Volver al Curso
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header con información del juego */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-t-2xl p-4 text-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs opacity-90">Pregunta</p>
              <p className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-90">Puntos</p>
              <p className="text-2xl font-bold">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-90">Racha</p>
              <p className="text-2xl font-bold flex items-center">
                <FaFire className={`mr-1 ${streak >= 3 ? 'text-orange-400' : 'text-gray-300'}`} />
                {streak}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-3xl font-bold ${timeLeft <= 10 ? 'text-red-300 animate-pulse' : ''}`}>
              <FaClock className="inline mr-2" />
              {timeLeft}s
            </div>
            {multiplier > 1 && (
              <p className="text-sm bg-yellow-400 text-purple-900 px-2 py-1 rounded-full mt-1">
                x{multiplier} multiplicador
              </p>
            )}
          </div>
        </div>
        
        {/* Barra de progreso */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div 
            className="bg-gradient-to-r from-yellow-400 to-green-400 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Contenido de la pregunta */}
      <div className="bg-white rounded-b-2xl shadow-2xl p-6">
        {/* Power-ups */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={useFiftyFifty}
            disabled={powerUps.fiftyFifty === 0 || usedPowerUp || showCorrectAnswer}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              powerUps.fiftyFifty > 0 && !usedPowerUp && !showCorrectAnswer
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            50/50 <span className="badge">{powerUps.fiftyFifty}</span>
          </button>
          
          <button
            onClick={useSkipQuestion}
            disabled={powerUps.skipQuestion === 0 || showCorrectAnswer}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              powerUps.skipQuestion > 0 && !showCorrectAnswer
                ? 'bg-purple-500 text-white hover:bg-purple-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Saltar <span className="badge">{powerUps.skipQuestion}</span>
          </button>
          
          <button
            onClick={useExtraTime}
            disabled={powerUps.extraTime === 0 || usedPowerUp || showCorrectAnswer}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              powerUps.extraTime > 0 && !usedPowerUp && !showCorrectAnswer
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            +Tiempo <span className="badge">{powerUps.extraTime}</span>
          </button>
          
          <button
            onClick={useHint}
            disabled={powerUps.hint === 0 || showCorrectAnswer}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
              powerUps.hint > 0 && !showCorrectAnswer
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FaLightbulb /> <span className="badge">{powerUps.hint}</span>
          </button>
        </div>

        {/* Pregunta */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              {question.category}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center">
              <FaCoins className="mr-1" />
              {question.coins * multiplier} monedas
            </span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            {question.question}
          </h3>
          
          {/* Opciones de respuesta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleAnswerClick(index)}
                  disabled={showCorrectAnswer}
                  className={`answer-option p-4 rounded-lg border-2 text-left transition-all ${
                    showCorrectAnswer
                      ? index === question.correct
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : selectedAnswer === index
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : 'bg-gray-50 border-gray-200'
                      : selectedAnswer === index
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showCorrectAnswer && (
                      <>
                        {index === question.correct && <FaCheckCircle className="text-green-500" />}
                        {selectedAnswer === index && index !== question.correct && <FaTimesCircle className="text-red-500" />}
                      </>
                    )}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Explicación de la respuesta */}
          {showCorrectAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded"
            >
              <p className="text-sm text-gray-700">
                <strong>Explicación:</strong> {question.explanation}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriviaSystem;
