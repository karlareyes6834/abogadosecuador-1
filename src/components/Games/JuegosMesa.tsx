import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosMesaProps {
  juegoId: string;
  nombre: string;
  icono: string;
  nivelActual: number;
  totalNiveles: number;
  onAvanzarNivel: () => void;
  onPerder: () => void;
  onVolver: () => void;
  tokens: number;
  onTokensChange: (tokens: number) => void;
}

// Damas Chinas
const DamasChinas: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [tablero, setTablero] = useState(
    Array(13).fill(null).map((_, i) => {
      if (i < 3) return Array(i + 1).fill('🔴').concat(Array(13 - i - 1).fill(null));
      if (i === 3) return Array(4).fill('🔴').concat(Array(9).fill(null));
      if (i < 6) return Array(4).fill('🔴').concat(Array(9).fill(null));
      if (i === 6) return Array(4).fill('🔴').concat(Array(9).fill(null));
      if (i < 9) return Array(4).fill('🟡').concat(Array(9).fill(null));
      if (i === 9) return Array(4).fill('🟡').concat(Array(9).fill(null));
      if (i < 12) return Array(i - 8).fill('🟡').concat(Array(13 - (i - 8)).fill(null));
      return Array(4).fill('🟡').concat(Array(9).fill(null));
    })
  );
  const [seleccionado, setSeleccionado] = useState<[number, number] | null>(null);
  const [movimientos, setMovimientos] = useState(0);
  const [puntos, setPuntos] = useState(0);

  const hacerMovimiento = (fila: number, col: number) => {
    if (!seleccionado) {
      if (tablero[fila]?.[col]) {
        setSeleccionado([fila, col]);
      }
    } else {
      const [sF, sC] = seleccionado;
      if (tablero[fila]?.[col] === null) {
        const nuevoTablero = tablero.map(r => [...r]);
        nuevoTablero[fila][col] = nuevoTablero[sF][sC];
        nuevoTablero[sF][sC] = null;
        setTablero(nuevoTablero);
        setMovimientos(movimientos + 1);
        setPuntos(puntos + 10);
        setSeleccionado(null);

        if (movimientos >= 15 + nivel * 2) onGanar();
        if (movimientos >= 30) onPerder();
      } else {
        setSeleccionado([fila, col]);
      }
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-4 inline-block mx-auto">
        {tablero.map((fila, f) => (
          <div key={f} className="flex justify-center gap-1 mb-1">
            {fila.map((celda, c) => (
              <motion.button
                key={`${f}-${c}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => hacerMovimiento(f, c)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                  seleccionado?.[0] === f && seleccionado?.[1] === c
                    ? 'ring-4 ring-blue-500 scale-110'
                    : celda
                    ? 'bg-white shadow-md hover:shadow-lg'
                    : 'bg-green-300'
                }`}
              >
                {celda}
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-red-600">{puntos}</p>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Movimientos</p>
          <p className="text-2xl font-bold text-blue-600">{movimientos}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Meta</p>
          <p className="text-2xl font-bold text-green-600">{15 + nivel * 2}</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">Mueve tus fichas al lado opuesto</p>
    </div>
  );
};

// Memoria Profesional Mejorada
const MemoriaProfesional: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const totalParejas = 6 + nivel;
  const [cartas, setCartas] = useState<{ id: number; valor: string; volteada: boolean; pareada: boolean }[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [parejas, setParajas] = useState(0);
  const [tiempo, setTiempo] = useState(60 + nivel * 10);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    const valores = ['⚖️', '📋', '🏛️', '📝', '💼', '🔨', '📜', '🎯', '✍️', '📚', '🏆', '⚡'];
    const cartasAleatorias = [...valores.slice(0, totalParejas), ...valores.slice(0, totalParejas)]
      .sort(() => Math.random() - 0.5)
      .map((valor, i) => ({ id: i, valor, volteada: false, pareada: false }));
    setCartas(cartasAleatorias);
  }, [nivel, totalParejas]);

  useEffect(() => {
    if (tiempo <= 0) {
      if (parejas === totalParejas) onGanar();
      else onPerder();
      return;
    }
    const timer = setInterval(() => setTiempo(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempo, parejas, totalParejas]);

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
          setPuntos(puntos + 20);
          setSeleccionadas([]);
          if (parejas + 1 === totalParejas) onGanar();
        } else {
          setPuntos(Math.max(0, puntos - 5));
          setTimeout(() => setSeleccionadas([]), 600);
        }
      }
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className={`grid gap-3 mb-4`} style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cartas.length))}, 1fr)` }}>
        {cartas.map(carta => (
          <motion.button
            key={carta.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => voltearCarta(carta.id)}
            className={`aspect-square rounded-lg font-bold text-3xl transition-all shadow-md ${
              seleccionadas.includes(carta.id) || carta.pareada
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                : 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-600 hover:shadow-lg'
            }`}
          >
            {seleccionadas.includes(carta.id) || carta.pareada ? carta.valor : '?'}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2">
        <div className="bg-blue-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Parejas</p>
          <p className="text-xl font-bold text-blue-600">{parejas}/{totalParejas}</p>
        </div>
        <div className="bg-red-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Tiempo</p>
          <p className="text-xl font-bold text-red-600">{tiempo}s</p>
        </div>
        <div className="bg-green-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Puntos</p>
          <p className="text-xl font-bold text-green-600">{puntos}</p>
        </div>
        <div className="bg-yellow-100 rounded p-2 text-center">
          <p className="text-xs text-slate-700">Precisión</p>
          <p className="text-xl font-bold text-yellow-600">{Math.round((parejas / totalParejas) * 100)}%</p>
        </div>
      </div>
    </div>
  );
};

// Ajedrez Simplificado
const AjedrezSimple: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [turno, setTurno] = useState('blanco');
  const [puntos, setPuntos] = useState(0);
  const [movimientos, setMovimientos] = useState(0);

  const hacerMovimiento = () => {
    setMovimientos(movimientos + 1);
    setPuntos(puntos + 10);
    setTurno(turno === 'blanco' ? 'negro' : 'blanco');

    if (movimientos >= 20 + nivel * 3) onGanar();
    if (movimientos >= 40) onPerder();
  };

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-4 inline-block mx-auto">
        <div className="grid grid-cols-8 gap-0 border-4 border-amber-900">
          {Array(64).fill(null).map((_, i) => {
            const fila = Math.floor(i / 8);
            const col = i % 8;
            const esBlanco = (fila + col) % 2 === 0;
            return (
              <div
                key={i}
                className={`w-12 h-12 flex items-center justify-center text-2xl ${
                  esBlanco ? 'bg-amber-50' : 'bg-amber-700'
                }`}
              >
                {i === 4 && fila === 7 ? '♔' : i === 4 && fila === 0 ? '♚' : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Turno</p>
          <p className="text-2xl font-bold text-blue-600">{turno === 'blanco' ? '⚪' : '⚫'}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Movimientos</p>
          <p className="text-2xl font-bold text-green-600">{movimientos}</p>
        </div>
        <div className="bg-yellow-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-yellow-600">{puntos}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={hacerMovimiento}
        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg"
      >
        Hacer Movimiento
      </motion.button>

      <p className="text-xs text-slate-600 text-center">Juega contra la IA, haz {20 + nivel * 3} movimientos para ganar</p>
    </div>
  );
};

// Componente Principal
export const JuegosMesa: React.FC<JuegosMesaProps> = ({
  juegoId,
  nombre,
  icono,
  nivelActual,
  totalNiveles,
  onAvanzarNivel,
  onPerder,
  onVolver,
  tokens,
  onTokensChange,
}) => {
  const [resultado, setResultado] = useState<'ganando' | 'perdiendo' | null>(null);

  const renderizarJuego = () => {
    switch (juegoId) {
      case 'damas-chinas':
        return (
          <DamasChinas
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'memoria-pro':
        return (
          <MemoriaProfesional
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'ajedrez-simple':
        return (
          <AjedrezSimple
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{icono}</span>
              <div>
                <h2 className="text-2xl font-bold">{nombre}</h2>
                <p className="text-blue-100">Nivel {nivelActual} de {totalNiveles}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Tokens</p>
              <p className="text-3xl font-bold text-yellow-300">{tokens}</p>
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
            {resultado === 'ganando' && (
              <p className="text-lg font-bold text-green-700 mb-4">+90 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 90);
                    setResultado(null);
                    onAvanzarNivel();
                  }}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600"
                >
                  Siguiente Nivel →
                </motion.button>
              )}
              {resultado === 'ganando' && nivelActual === totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 180);
                    onVolver();
                  }}
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

export default JuegosMesa;
