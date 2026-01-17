import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface JuegosSimpleProProps {
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

// Pintura de Colores
const PinturaColores: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [celdas, setCeldas] = useState(Array(16).fill(false));
  const [colorActual, setColorActual] = useState('bg-blue-500');
  const [pintadas, setPintadas] = useState(0);
  const colores = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];

  const pintar = (index: number) => {
    if (!celdas[index]) {
      const nuevasCeldas = [...celdas];
      nuevasCeldas[index] = true;
      setCeldas(nuevasCeldas);
      setPintadas(pintadas + 1);

      if (pintadas + 1 >= 12 + nivel) onGanar();
      if (pintadas >= 20) onPerder();
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="grid grid-cols-4 gap-2 mb-4">
        {celdas.map((pintada, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => pintar(i)}
            className={`aspect-square rounded-lg transition-all ${
              pintada ? colorActual : 'bg-gray-300 hover:bg-gray-400'
            }`}
          ></motion.button>
        ))}
      </div>

      <div className="flex gap-2 justify-center">
        {colores.map((color) => (
          <button
            key={color}
            onClick={() => setColorActual(color)}
            className={`w-8 h-8 rounded-full ${color} ${colorActual === color ? 'ring-4 ring-white' : ''}`}
          ></button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Pintadas</p>
          <p className="text-2xl font-bold text-blue-600">{pintadas}/{12 + nivel}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Progreso</p>
          <p className="text-2xl font-bold text-green-600">{Math.round((pintadas / (12 + nivel)) * 100)}%</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">Pinta todas las celdas con los colores</p>
    </div>
  );
};

// Rompecabezas
const Rompecabezas: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [piezas, setPiezas] = useState(
    Array.from({ length: 9 + nivel }, (_, i) => ({ id: i, colocada: false }))
      .sort(() => Math.random() - 0.5)
  );
  const [colocadas, setColocadas] = useState(0);
  const totalPiezas = 9 + nivel;

  const colocarPieza = (id: number) => {
    setPiezas(piezas.map(p => p.id === id ? { ...p, colocada: true } : p));
    setColocadas(colocadas + 1);

    if (colocadas + 1 === totalPiezas) onGanar();
  };

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {Array(totalPiezas).fill(null).map((_, i) => (
            <div key={i} className="aspect-square bg-purple-300 rounded-lg border-2 border-purple-500"></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {piezas.map((pieza) => (
          <motion.button
            key={pieza.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => colocarPieza(pieza.id)}
            className={`aspect-square rounded-lg transition-all ${
              pieza.colocada
                ? 'bg-green-500 text-white opacity-50'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
          >
            {pieza.id + 1}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Colocadas</p>
          <p className="text-2xl font-bold text-purple-600">{colocadas}/{totalPiezas}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Falta</p>
          <p className="text-2xl font-bold text-green-600">{totalPiezas - colocadas}</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">Coloca todas las piezas del rompecabezas</p>
    </div>
  );
};

// Estacionamiento
const Estacionamiento: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [espacios, setEspacios] = useState(Array(12).fill(false));
  const [estacionados, setEstacionados] = useState(0);
  const [intentos, setIntentos] = useState(0);

  const estacionar = (index: number) => {
    if (!espacios[index]) {
      const nuevosEspacios = [...espacios];
      nuevosEspacios[index] = true;
      setEspacios(nuevosEspacios);
      setEstacionados(estacionados + 1);
      setIntentos(intentos + 1);

      if (estacionados + 1 >= 8 + nivel) onGanar();
      if (intentos >= 15) onPerder();
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg p-4">
        <div className="grid grid-cols-4 gap-2">
          {espacios.map((ocupado, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => estacionar(i)}
              className={`aspect-square rounded-lg transition-all border-2 ${
                ocupado
                  ? 'bg-red-500 border-red-700'
                  : 'bg-white border-gray-400 hover:border-gray-600'
              }`}
            >
              {ocupado ? '🚗' : ''}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Estacionados</p>
          <p className="text-2xl font-bold text-red-600">{estacionados}</p>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Intentos</p>
          <p className="text-2xl font-bold text-blue-600">{intentos}</p>
        </div>
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Meta</p>
          <p className="text-2xl font-bold text-green-600">{8 + nivel}</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">Estaciona los autos en los espacios disponibles</p>
    </div>
  );
};

// Carrera de Obstáculos
const CarreraObstaculos: React.FC<{ nivel: number; onGanar: () => void; onPerder: () => void }> = ({ nivel, onGanar, onPerder }) => {
  const [posicion, setPosicion] = useState(0);
  const [tiempo, setTiempo] = useState(30 + nivel * 5);
  const [puntos, setPuntos] = useState(0);

  useEffect(() => {
    if (tiempo <= 0) {
      if (posicion >= 100) onGanar();
      else onPerder();
      return;
    }
    const timer = setInterval(() => setTiempo(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [tiempo, posicion]);

  const avanzar = () => {
    const avance = Math.floor(Math.random() * 15) + 5;
    const nuevaPosicion = Math.min(posicion + avance, 100);
    setPosicion(nuevaPosicion);
    setPuntos(puntos + avance);

    if (nuevaPosicion >= 100) onGanar();
  };

  return (
    <div className="p-8 space-y-4">
      <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-4">
        <div className="w-full bg-gray-300 rounded-full h-8 mb-2">
          <motion.div
            animate={{ width: `${posicion}%` }}
            className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full flex items-center justify-center text-white font-bold"
          >
            {posicion > 10 && `${posicion}%`}
          </motion.div>
        </div>
        <p className="text-center font-bold text-slate-900">Distancia: {posicion}m / 100m</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Tiempo</p>
          <p className="text-2xl font-bold text-green-600">{tiempo}s</p>
        </div>
        <div className="bg-blue-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Puntos</p>
          <p className="text-2xl font-bold text-blue-600">{puntos}</p>
        </div>
        <div className="bg-yellow-100 rounded p-3 text-center">
          <p className="text-sm text-slate-700">Velocidad</p>
          <p className="text-2xl font-bold text-yellow-600">⚡</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={avanzar}
        className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-bold hover:shadow-lg"
      >
        🏃 Avanzar
      </motion.button>

      <p className="text-xs text-slate-600 text-center">Llega a 100m antes de que se acabe el tiempo</p>
    </div>
  );
};

// Componente Principal
export const JuegosSimplesPro: React.FC<JuegosSimpleProProps> = ({
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
      case 'pintura':
        return (
          <PinturaColores
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'rompecabezas':
        return (
          <Rompecabezas
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'estacionamiento':
        return (
          <Estacionamiento
            nivel={nivelActual}
            onGanar={() => setResultado('ganando')}
            onPerder={() => setResultado('perdiendo')}
          />
        );
      case 'carrera':
        return (
          <CarreraObstaculos
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
              <p className="text-lg font-bold text-green-700 mb-4">+70 Tokens 🪙</p>
            )}
            <div className="flex gap-4 justify-center">
              {resultado === 'ganando' && nivelActual < totalNiveles && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onTokensChange(tokens + 70);
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
                    onTokensChange(tokens + 140);
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

export default JuegosSimplesPro;
