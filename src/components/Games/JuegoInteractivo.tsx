import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegoInteractivoProps {
  juegoId: string;
  nombre: string;
  icono: string;
  nivelActual: number;
  totalNiveles: number;
  onAvanzarNivel: () => void;
  onPerder: () => void;
  onVolver: () => void;
}

// Componente para Trivia
const TrivaGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const preguntas = [
    { pregunta: '¿Cuál es la capital de Ecuador?', opciones: ['Quito', 'Guayaquil', 'Cuenca', 'Ambato'], respuesta: 0 },
    { pregunta: '¿En qué año se independizó Ecuador?', opciones: ['1820', '1822', '1825', '1830'], respuesta: 1 },
    { pregunta: '¿Cuál es el código civil ecuatoriano?', opciones: ['Código Penal', 'Código Civil', 'Código Laboral', 'Código Tributario'], respuesta: 1 },
  ];
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const pregunta = preguntas[nivel % preguntas.length];

  const responder = (index: number) => {
    setSeleccionada(index);
    setTimeout(() => {
      if (index === pregunta.respuesta) {
        onGanar();
      } else {
        onPerder();
      }
    }, 500);
  };

  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">{pregunta.pregunta}</h3>
      <div className="grid grid-cols-1 gap-3">
        {pregunta.opciones.map((opcion, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => responder(i)}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              seleccionada === i
                ? i === pregunta.respuesta
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {opcion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

// Componente para Memoria
const MemoriaGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [cartas, setCartas] = useState<{ id: number; valor: string; volteada: boolean; pareada: boolean }[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [parejas, setParajas] = useState(0);

  useEffect(() => {
    const valores = ['⚖️', '📋', '🏛️', '⚖️', '📋', '🏛️', '📝', '⚖️', '📝', '🏛️', '📋', '⚖️'];
    const cartasAleatorias = valores
      .sort(() => Math.random() - 0.5)
      .map((valor, i) => ({ id: i, valor, volteada: false, pareada: false }));
    setCartas(cartasAleatorias);
  }, [nivel]);

  const voltearCarta = (id: number) => {
    if (seleccionadas.length < 2 && !seleccionadas.includes(id) && !cartas[id].pareada) {
      const nuevasSeleccionadas = [...seleccionadas, id];
      setSeleccionadas(nuevasSeleccionadas);

      if (nuevasSeleccionadas.length === 2) {
        if (cartas[nuevasSeleccionadas[0]].valor === cartas[nuevasSeleccionadas[1]].valor) {
          setCartas(cartas.map(c => 
            nuevasSeleccionadas.includes(c.id) ? { ...c, pareada: true } : c
          ));
          setParajas(parejas + 1);
          setSeleccionadas([]);
          if (parejas + 1 === 6) onGanar();
        } else {
          setTimeout(() => setSeleccionadas([]), 600);
        }
      }
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-3 mb-4">
        {cartas.map(carta => (
          <motion.button
            key={carta.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => voltearCarta(carta.id)}
            className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
              seleccionadas.includes(carta.id) || carta.pareada
                ? 'bg-blue-500 text-white'
                : 'bg-slate-300 text-slate-600 hover:bg-slate-400'
            }`}
          >
            {seleccionadas.includes(carta.id) || carta.pareada ? carta.valor : '?'}
          </motion.button>
        ))}
      </div>
      <p className="text-center text-slate-700 font-bold">Parejas encontradas: {parejas}/6</p>
    </div>
  );
};

// Componente para Sopa de Letras
const SopaGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const palabras = ['LEY', 'JUEZ', 'ABOGADO', 'DERECHO', 'CODIGO'];
  const [encontradas, setEncontradas] = useState<string[]>([]);

  useEffect(() => {
    if (encontradas.length === palabras.length) {
      onGanar();
    }
  }, [encontradas]);

  return (
    <div className="p-8 text-center">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Encuentra las palabras:</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {palabras.map(palabra => (
          <motion.button
            key={palabra}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (!encontradas.includes(palabra)) {
                setEncontradas([...encontradas, palabra]);
              }
            }}
            className={`px-4 py-3 rounded-lg font-bold transition-all ${
              encontradas.includes(palabra)
                ? 'bg-green-500 text-white line-through'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {palabra}
          </motion.button>
        ))}
      </div>
      <p className="text-slate-700 font-bold">Encontradas: {encontradas.length}/{palabras.length}</p>
    </div>
  );
};

// Componente para Tetris Simple
const TetrisGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (puntos >= 100) onGanar();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 text-center">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Tetris Legal</h3>
      <div className="bg-slate-200 rounded-lg p-8 mb-6 h-64 flex items-center justify-center">
        <p className="text-slate-600 text-lg">Área de juego - Tetris</p>
      </div>
      <div className="space-y-4">
        <p className="text-xl font-bold text-slate-900">Puntos: {puntos}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPuntos(Math.min(puntos + 50, 200))}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
        >
          Sumar Puntos
        </motion.button>
      </div>
    </div>
  );
};

// Componente Principal
export const JuegoInteractivo: React.FC<JuegoInteractivoProps> = ({
  juegoId,
  nombre,
  icono,
  nivelActual,
  totalNiveles,
  onAvanzarNivel,
  onPerder,
  onVolver,
}) => {
  const [resultado, setResultado] = useState<'ganando' | 'perdiendo' | null>(null);

  const renderizarJuego = () => {
    switch (juegoId) {
      case 'trivia':
        return (
          <TrivaGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'memoria':
        return (
          <MemoriaGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'sopa':
        return (
          <SopaGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'tetris':
        return (
          <TetrisGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      default:
        return <p className="p-8 text-center text-slate-600">Juego no disponible</p>;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto">
      <button
        onClick={onVolver}
        className="flex items-center gap-2 text-blue-600 mb-6 hover:text-blue-700 font-bold"
      >
        <ChevronLeft className="w-5 h-5" />
        Volver a Juegos
      </button>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{icono}</span>
            <div>
              <h2 className="text-2xl font-bold">{nombre}</h2>
              <p className="text-blue-100">Nivel {nivelActual} de {totalNiveles}</p>
            </div>
          </div>
          <div className="w-full bg-blue-900/50 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(nivelActual / totalNiveles) * 100}%` }}
              className="bg-green-400 h-full rounded-full"
            />
          </div>
        </div>

        {/* Contenido del Juego */}
        <div className="bg-slate-50">{renderizarJuego()}</div>

        {/* Resultado */}
        {resultado && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 text-center ${resultado === 'ganando' ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <p className={`text-2xl font-bold mb-4 ${resultado === 'ganando' ? 'text-green-700' : 'text-red-700'}`}>
              {resultado === 'ganando' ? '¡Ganaste! 🎉' : 'Perdiste 😢'}
            </p>
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAvanzarNivel}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                >
                  Siguiente Nivel →
                </motion.button>
              )}
              {resultado === 'ganando' && nivelActual === totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onVolver}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
                >
                  ¡Juego Completado! Volver
                </motion.button>
              )}
              {resultado === 'perdiendo' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setResultado(null)}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600"
                >
                  Reintentar
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default JuegoInteractivo;
