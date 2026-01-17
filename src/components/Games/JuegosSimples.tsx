import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosSimlesProps {
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

// 2048 Game
const Juego2048: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [tablero, setTablero] = useState(Array(16).fill(0).map((_, i) => i < 2 ? Math.pow(2, Math.floor(Math.random() * 2) + 1) : 0));
  const [puntos, setPuntos] = useState(0);
  const [movimientos, setMovimientos] = useState(0);

  const mover = (direccion: string) => {
    let nuevoTablero = [...tablero];
    let cambio = false;

    // Lógica simplificada de movimiento
    if (direccion === 'izquierda') {
      for (let i = 0; i < 4; i++) {
        const fila = nuevoTablero.slice(i * 4, (i + 1) * 4);
        const filtrada = fila.filter(x => x !== 0);
        for (let j = 0; j < filtrada.length - 1; j++) {
          if (filtrada[j] === filtrada[j + 1]) {
            filtrada[j] *= 2;
            filtrada.splice(j + 1, 1);
            setPuntos(p => p + filtrada[j]);
          }
        }
        const nueva = [...filtrada, ...Array(4 - filtrada.length).fill(0)];
        nuevoTablero.splice(i * 4, 4, ...nueva);
        cambio = true;
      }
    }

    if (cambio) {
      const vacio = nuevoTablero.findIndex(x => x === 0);
      if (vacio !== -1) {
        nuevoTablero[vacio] = Math.random() > 0.9 ? 4 : 2;
      }
      setTablero(nuevoTablero);
      setMovimientos(movimientos + 1);

      if (puntos >= 100 + nivel * 50) onGanar();
      if (movimientos >= 20) onPerder();
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-4 rounded-lg">
        {tablero.map((valor, i) => (
          <div
            key={i}
            className={`aspect-square rounded-lg flex items-center justify-center font-bold text-white transition-all ${
              valor === 0 ? 'bg-gray-200' :
              valor === 2 ? 'bg-blue-400' :
              valor === 4 ? 'bg-blue-500' :
              valor === 8 ? 'bg-blue-600' :
              valor === 16 ? 'bg-purple-500' :
              'bg-purple-700'
            }`}
          >
            {valor !== 0 && valor}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-blue-600">{puntos}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Movimientos</p>
          <p className="text-2xl font-bold text-green-600">{movimientos}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => mover('izquierda')} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          ← Izquierda
        </button>
        <button onClick={() => mover('derecha')} className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">
          Derecha →
        </button>
      </div>

      <p className="text-xs text-slate-600 text-center">Combina números para llegar a 2048</p>
    </div>
  );
};

// Clicker Game
const ClickerGame: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [puntos, setPuntos] = useState(0);
  const [multiplicador, setMultiplicador] = useState(1);
  const [tiempo, setTiempo] = useState(30 + nivel * 5);

  useEffect(() => {
    if (tiempo <= 0) {
      if (puntos >= 500 + nivel * 100) onGanar();
      else onPerder();
      return;
    }

    const timer = setInterval(() => setTiempo(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempo, puntos, nivel]);

  const click = () => {
    setPuntos(p => p + (1 * multiplicador));
  };

  return (
    <div className="p-8 space-y-6 text-center">
      <div className="text-6xl font-bold text-slate-900">{puntos}</div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={click}
        className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 text-white rounded-full font-bold text-4xl hover:shadow-lg transition-all"
      >
        👆
      </motion.button>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-100 rounded p-3">
          <p className="text-sm text-slate-700">Tiempo</p>
          <p className="text-2xl font-bold text-yellow-600">{tiempo}s</p>
        </div>
        <div className="bg-blue-100 rounded p-3">
          <p className="text-sm text-slate-700">Multiplicador</p>
          <p className="text-2xl font-bold text-blue-600">x{multiplicador}</p>
        </div>
        <div className="bg-green-100 rounded p-3">
          <p className="text-sm text-slate-700">Meta</p>
          <p className="text-2xl font-bold text-green-600">{500 + nivel * 100}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMultiplicador(m => m + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
        >
          Mejorar x{multiplicador + 1}
        </button>
        <button
          onClick={() => setPuntos(p => p + 50)}
          className="px-4 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700"
        >
          Bonus +50
        </button>
      </div>

      <p className="text-xs text-slate-600">Haz clic lo más rápido posible en {tiempo}s</p>
    </div>
  );
};

// Memoria Avanzada
const MemoriaAvanzada: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [cartas, setCartas] = useState<{ id: number; valor: string; volteada: boolean; pareada: boolean }[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<number[]>([]);
  const [parejas, setParajas] = useState(0);
  const totalParejas = 8 + nivel;

  React.useEffect(() => {
    const valores = Array.from({ length: totalParejas }, (_, i) => {
      const emojis = ['🎓', '📋', '⚖️', '🏛️', '📝', '💼', '🔨', '📜', '🎯', '✍️', '📚', '🏆'];
      return emojis[i % emojis.length];
    });
    const cartasAleatorias = [...valores, ...valores]
      .sort(() => Math.random() - 0.5)
      .map((valor, i) => ({ id: i, valor, volteada: false, pareada: false }));
    setCartas(cartasAleatorias);
  }, [nivel, totalParejas]);

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
          if (parejas + 1 === totalParejas) onGanar();
        } else {
          setTimeout(() => setSeleccionadas([]), 600);
        }
      }
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className={`grid gap-2 mb-4`} style={{ gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cartas.length))}, 1fr)` }}>
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
      <p className="text-center font-bold text-slate-900">Parejas: {parejas}/{totalParejas}</p>
    </div>
  );
};

// Componente Principal
export const JuegosSimples: React.FC<JuegosSimlesProps> = ({
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
      case '2048':
        return (
          <Juego2048
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'clicker':
        return (
          <ClickerGame
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'memoria-avanzada':
        return (
          <MemoriaAvanzada
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
              <p className="text-lg font-bold text-green-700 mb-4">+80 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 80);
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
                    onTokensChange(tokens + 160);
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

export default JuegosSimples;
