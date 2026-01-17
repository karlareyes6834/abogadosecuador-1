import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrophy, FaStar, FaFire, FaLightbulb, FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';

const TRIVIA_QUESTIONS = [
  // Derecho Penal
  { id: 1, category: 'Derecho Penal', difficulty: 'easy', question: '¿Cuál es la pena máxima de prisión en Ecuador?', options: ['25 años', '40 años', '30 años', 'Cadena perpetua'], correct: 1, explanation: 'El Código Orgánico Integral Penal establece 40 años como pena máxima.' },
  { id: 2, category: 'Derecho Penal', difficulty: 'medium', question: '¿Qué es la flagrancia?', options: ['Un tipo de delito', 'Cuando se sorprende a alguien cometiendo un delito', 'Una pena adicional', 'Un recurso legal'], correct: 1, explanation: 'La flagrancia es cuando una persona es sorprendida en el momento de cometer un delito.' },
  { id: 3, category: 'Derecho Penal', difficulty: 'hard', question: '¿Cuánto tiempo tiene la Fiscalía para presentar cargos desde la detención?', options: ['12 horas', '24 horas', '48 horas', '72 horas'], correct: 1, explanation: 'La Fiscalía tiene 24 horas para formular cargos o solicitar ampliación de plazo.' },
  
  // Derecho Laboral
  { id: 4, category: 'Derecho Laboral', difficulty: 'easy', question: '¿Cuántos días de vacaciones corresponden por año?', options: ['15 días', '20 días', '30 días', '10 días'], correct: 0, explanation: 'El Código de Trabajo establece 15 días de vacaciones por año trabajado.' },
  { id: 5, category: 'Derecho Laboral', difficulty: 'medium', question: '¿Qué es el visto bueno?', options: ['Un permiso laboral', 'Una forma de terminar el contrato', 'Un aumento salarial', 'Una promoción'], correct: 1, explanation: 'El visto bueno es un trámite para dar por terminado un contrato laboral por causa legal.' },
  { id: 6, category: 'Derecho Laboral', difficulty: 'hard', question: '¿Qué porcentaje se paga por horas extras?', options: ['25%', '50%', '75%', '100%'], correct: 1, explanation: 'Las horas extras se pagan con un recargo del 50% sobre el valor de la hora normal.' },
  
  // Derecho Civil
  { id: 7, category: 'Derecho Civil', difficulty: 'easy', question: '¿A qué edad se alcanza la mayoría de edad en Ecuador?', options: ['16 años', '18 años', '21 años', '25 años'], correct: 1, explanation: 'La mayoría de edad se alcanza a los 18 años según el Código Civil.' },
  { id: 8, category: 'Derecho Civil', difficulty: 'medium', question: '¿Qué es la capacidad jurídica?', options: ['Ser abogado', 'Aptitud para ser titular de derechos', 'Tener dinero', 'Ser mayor de edad'], correct: 1, explanation: 'La capacidad jurídica es la aptitud para ser titular de derechos y obligaciones.' },
  { id: 9, category: 'Derecho Civil', difficulty: 'hard', question: '¿Qué tipo de bien es una casa?', options: ['Mueble', 'Inmueble', 'Fungible', 'Consumible'], correct: 1, explanation: 'Los bienes raíces como casas y terrenos son bienes inmuebles.' },
  
  // Derecho de Familia
  { id: 10, category: 'Familia', difficulty: 'easy', question: '¿A partir de qué edad un menor puede ser escuchado en juicio?', options: ['10 años', '12 años', '14 años', '16 años'], correct: 1, explanation: 'Los menores de 12 años pueden ser escuchados en procesos que les afecten.' },
  { id: 11, category: 'Familia', difficulty: 'medium', question: '¿Qué es la patria potestad?', options: ['Un tipo de pena', 'Derechos y deberes de los padres', 'Un trámite legal', 'Una pensión'], correct: 1, explanation: 'La patria potestad son los derechos y deberes que tienen los padres sobre sus hijos.' },
  { id: 12, category: 'Familia', difficulty: 'hard', question: '¿Hasta qué edad se paga pensión alimenticia?', options: ['18 años', '21 años', '25 años si estudia', '30 años'], correct: 2, explanation: 'La pensión alimenticia se extiende hasta los 21 años, o 25 si el hijo continúa estudios superiores.' },
  
  // Derecho Comercial
  { id: 13, category: 'Comercial', difficulty: 'easy', question: '¿Cuál es el capital mínimo para una Cía. Ltda.?', options: ['$100', '$400', '$800', '$1000'], correct: 1, explanation: 'El capital mínimo para constituir una Compañía Limitada es $400.' },
  { id: 14, category: 'Comercial', difficulty: 'medium', question: '¿Qué es el RUC?', options: ['Registro Único de Contribuyentes', 'Registro de Usuarios', 'Requisito Único', 'Reglamento'], correct: 0, explanation: 'RUC es el Registro Único de Contribuyentes, obligatorio para actividades económicas.' },
  { id: 15, category: 'Comercial', difficulty: 'hard', question: '¿Cuántos socios mínimo requiere una S.A.?', options: ['1', '2', '3', '5'], correct: 1, explanation: 'Una Sociedad Anónima requiere mínimo 2 accionistas.' },
  
  // Más preguntas variadas
  { id: 16, category: 'Derecho Penal', difficulty: 'easy', question: '¿Qué es un delito?', options: ['Una falta leve', 'Conducta típica, antijurídica y culpable', 'Un error', 'Una costumbre'], correct: 1, explanation: 'Un delito es una conducta típica (descrita en ley), antijurídica y culpable.' },
  { id: 17, category: 'Derecho Laboral', difficulty: 'easy', question: '¿Cuánto es el décimo tercer sueldo?', options: ['Un sueldo básico', 'La doceava parte de lo ganado', 'Dos sueldos', 'Media mensualidad'], correct: 1, explanation: 'El décimo tercer sueldo equivale a la doceava parte de las remuneraciones del año.' },
  { id: 18, category: 'Derecho Civil', difficulty: 'medium', question: '¿Qué es una obligación de dar?', options: ['Dar clases', 'Transferir dominio', 'Dar consejos', 'Dar tiempo'], correct: 1, explanation: 'La obligación de dar consiste en transferir el dominio de una cosa.' },
  { id: 19, category: 'Familia', difficulty: 'easy', question: '¿Qué es la custodia compartida?', options: ['Vivir juntos', 'Ambos padres cuidan al hijo', 'Solo fines de semana', 'Custodia del Estado'], correct: 1, explanation: 'La custodia compartida es cuando ambos padres tienen tiempo de convivencia con el hijo.' },
  { id: 20, category: 'Comercial', difficulty: 'easy', question: '¿Qué es una marca comercial?', options: ['Un sello', 'Signo distintivo de productos', 'Un tipo de empresa', 'Un impuesto'], correct: 1, explanation: 'Una marca es un signo que distingue productos o servicios en el mercado.' }
];

const LegalTrivia = () => {
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  useEffect(() => {
    loadNewQuestion();
  }, []);

  useEffect(() => {
    // Calcular nivel basado en XP
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success(`¡Subiste al nivel ${newLevel}!`);
    }
  }, [xp]);

  const loadNewQuestion = () => {
    const availableQuestions = TRIVIA_QUESTIONS.filter(
      q => !questionsAnswered.includes(q.id)
    );

    if (availableQuestions.length === 0) {
      // Reiniciar preguntas
      setQuestionsAnswered([]);
      setCurrentQuestion(TRIVIA_QUESTIONS[Math.floor(Math.random() * TRIVIA_QUESTIONS.length)]);
    } else {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      setCurrentQuestion(availableQuestions[randomIndex]);
    }
    
    setSelectedAnswer(null);
    setShowResult(false);
    setUsedHint(false);
  };

  const handleAnswer = (index) => {
    if (showResult) return;
    
    setSelectedAnswer(index);
    const correct = index === currentQuestion.correct;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = usedHint ? 5 : 10;
      const xpGain = currentQuestion.difficulty === 'hard' ? 30 : 
                     currentQuestion.difficulty === 'medium' ? 20 : 10;
      
      setScore(score + points);
      setXp(xp + xpGain);
      setStreak(streak + 1);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      toast.success(`¡Correcto! +${points} puntos`);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);
      
      if (newLives === 0) {
        setGameOver(true);
        toast.error('¡Game Over! Te quedaste sin vidas');
      } else {
        toast.error(`Incorrecto. Te quedan ${newLives} vidas`);
      }
    }

    setQuestionsAnswered([...questionsAnswered, currentQuestion.id]);

    setTimeout(() => {
      if (lives > 1 || correct) {
        loadNewQuestion();
      }
    }, 3000);
  };

  const useHint = () => {
    if (usedHint) return;
    
    setUsedHint(true);
    toast.info('Pista: Se han eliminado 2 respuestas incorrectas');
  };

  const resetGame = () => {
    setLives(5);
    setScore(0);
    setStreak(0);
    setQuestionsAnswered([]);
    setGameOver(false);
    loadNewQuestion();
  };

  const addLife = () => {
    if (score >= 50) {
      setScore(score - 50);
      setLives(lives + 1);
      toast.success('¡Compraste una vida extra!');
    } else {
      toast.error('Necesitas 50 puntos para comprar una vida');
    }
  };

  if (!currentQuestion) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header con stats */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            {/* Vidas */}
            <div className="flex items-center gap-2">
              <FaHeart className="text-red-500 text-2xl" />
              <span className="text-2xl font-bold">{lives}</span>
              {lives < 5 && (
                <button
                  onClick={addLife}
                  className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Comprar (+50pts)
                </button>
              )}
            </div>

            {/* Nivel y XP */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <FaStar className="text-yellow-500 text-2xl mx-auto" />
                <p className="text-sm font-semibold">Nivel {level}</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${(xp % 100)}%` }}
                />
              </div>
              <span className="text-sm">{xp % 100}/100 XP</span>
            </div>

            {/* Puntuación */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <FaTrophy className="text-yellow-600 text-2xl mx-auto" />
                <p className="text-xl font-bold">{score}</p>
              </div>
              {streak > 0 && (
                <div className="text-center">
                  <FaFire className="text-orange-500 text-2xl mx-auto" />
                  <p className="text-sm font-semibold">{streak}x</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {!gameOver ? (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-xl p-8"
          >
            {/* Categoría y dificultad */}
            <div className="flex justify-between items-center mb-6">
              <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                {currentQuestion.category}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                 currentQuestion.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </span>
            </div>

            {/* Pregunta */}
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
              {currentQuestion.question}
            </h2>

            {/* Opciones */}
            <div className="space-y-4 mb-6">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrectAnswer = currentQuestion.correct === index;
                const shouldHide = usedHint && !isCorrectAnswer && 
                                 index !== currentQuestion.correct && 
                                 Math.random() > 0.5;

                if (shouldHide && !showResult) return null;

                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showResult ? 1 : 1.02 }}
                    whileTap={{ scale: showResult ? 1 : 0.98 }}
                    onClick={() => handleAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      !showResult
                        ? 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200'
                        : isSelected
                        ? isCorrect
                          ? 'bg-green-100 border-2 border-green-500'
                          : 'bg-red-100 border-2 border-red-500'
                        : isCorrectAnswer
                        ? 'bg-green-100 border-2 border-green-500'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showResult && isCorrectAnswer && (
                        <FaCheck className="text-green-600 text-xl" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <FaTimes className="text-red-600 text-xl" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Explicación */}
            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-lg ${
                    isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-800">
                    <strong>Explicación:</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Botón de pista */}
            {!showResult && !usedHint && (
              <button
                onClick={useHint}
                className="mt-4 w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
              >
                <FaLightbulb /> Usar Pista (reduce puntos a la mitad)
              </button>
            )}
          </motion.div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">¡Game Over!</h2>
            <FaHeart className="text-red-500 text-6xl mx-auto mb-6" />
            <p className="text-xl mb-2">Puntuación Final: <strong>{score}</strong></p>
            <p className="text-lg mb-2">Nivel Alcanzado: <strong>{level}</strong></p>
            <p className="text-lg mb-6">Preguntas Respondidas: <strong>{questionsAnswered.length}</strong></p>
            <button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
            >
              Jugar de Nuevo
            </button>
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-3">Cómo Jugar:</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Responde correctamente para ganar puntos y XP</li>
            <li>• Cada respuesta incorrecta te quita una vida ❤️</li>
            <li>• Usa pistas para eliminar respuestas incorrectas 💡</li>
            <li>• Mantén un streak para multiplicar tus puntos 🔥</li>
            <li>• Sube de nivel cada 100 XP ⭐</li>
            <li>• Compra vidas extra con tus puntos</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LegalTrivia;
