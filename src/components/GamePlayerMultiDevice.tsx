import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Smartphone, Monitor, Gamepad2 } from 'lucide-react';

interface GamePlayerProps {
  gameId: string;
  gameName: string;
  onClose: () => void;
  onGameEnd: (score: number, timeSpent: number) => void;
}

type DispositivoTipo = 'pc' | 'movil' | 'gamepad';

export const GamePlayerMultiDevice: React.FC<GamePlayerProps> = ({
  gameId,
  gameName,
  onClose,
  onGameEnd
}) => {
  const [dispositivoActual, setDispositivoActual] = useState<DispositivoTipo>('pc');
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const tiempoInicio = useRef<number>(Date.now());
  const intervaloTiempo = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Detectar tipo de dispositivo
    const ancho = window.innerWidth;
    if (ancho < 768) {
      setDispositivoActual('movil');
    } else {
      setDispositivoActual('pc');
    }

    // Iniciar contador de tiempo
    intervaloTiempo.current = setInterval(() => {
      const ahora = Date.now();
      const tiempoMs = ahora - tiempoInicio.current;
      setTiempoTranscurrido(Math.floor(tiempoMs / 1000));
    }, 100);

    // Detectar gamepad
    const handleGamepadConnected = () => {
      setDispositivoActual('gamepad');
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);

    return () => {
      if (intervaloTiempo.current) clearInterval(intervaloTiempo.current);
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
    };
  }, []);

  const finalizarJuego = () => {
    if (intervaloTiempo.current) clearInterval(intervaloTiempo.current);
    onGameEnd(puntuacion, tiempoTranscurrido);
  };

  const formatearTiempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const renderizarContenidoJuego = () => {
    switch (gameId) {
      case 'juicio-legal':
        return <JuegoJuicioLegal puntuacion={puntuacion} setPuntuacion={setPuntuacion} />;
      case 'defensor-espacio':
        return <JuegoDefensorEspacio puntuacion={puntuacion} setPuntuacion={setPuntuacion} />;
      case 'tetris-legal':
        return <JuegoTetrisLegal puntuacion={puntuacion} setPuntuacion={setPuntuacion} />;
      case 'memoria-legal':
        return <JuegoMemoriaLegal puntuacion={puntuacion} setPuntuacion={setPuntuacion} />;
      default:
        return <div className="text-white text-center">Juego no disponible</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">{gameName}</h2>
            <div className="flex gap-2">
              {(['pc', 'movil', 'gamepad'] as DispositivoTipo[]).map(tipo => (
                <button
                  key={tipo}
                  className={`p-2 rounded-lg transition-all ${
                    dispositivoActual === tipo
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                  title={tipo === 'pc' ? 'PC' : tipo === 'movil' ? 'Móvil' : 'Gamepad'}
                >
                  {tipo === 'pc' && <Monitor className="w-5 h-5" />}
                  {tipo === 'movil' && <Smartphone className="w-5 h-5" />}
                  {tipo === 'gamepad' && <Gamepad2 className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Puntuación</p>
              <p className="text-3xl font-bold text-yellow-400">{puntuacion}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Tiempo</p>
              <p className="text-3xl font-bold text-blue-400">{formatearTiempo(tiempoTranscurrido)}</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Área de juego */}
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full h-full flex items-center justify-center p-4"
        >
          {renderizarContenidoJuego()}
        </motion.div>
      </div>

      {/* Controles */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-slate-400">
            {dispositivoActual === 'pc' && '⌨️ Usa las flechas del teclado para moverte'}
            {dispositivoActual === 'movil' && '📱 Toca los botones para jugar'}
            {dispositivoActual === 'gamepad' && '🎮 Usa el gamepad para controlar'}
          </div>
          <button
            onClick={finalizarJuego}
            className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all"
          >
            Terminar Juego
          </button>
        </div>
      </div>
    </div>
  );
};

// Componentes de juegos individuales
const JuegoJuicioLegal: React.FC<{ puntuacion: number; setPuntuacion: (p: number) => void }> = ({
  puntuacion,
  setPuntuacion
}) => {
  const [casoActual, setCasoActual] = useState(0);
  const casos = [
    { pregunta: '¿Cuál es el derecho fundamental?', respuestas: ['Vida', 'Dinero', 'Fama'], correcta: 0 },
    { pregunta: '¿Qué es la justicia?', respuestas: ['Equilibrio', 'Poder', 'Dinero'], correcta: 0 },
    { pregunta: '¿Cuál es el deber del abogado?', respuestas: ['Defender', 'Enriquecer', 'Engañar'], correcta: 0 }
  ];

  const responder = (indice: number) => {
    if (indice === casos[casoActual].correcta) {
      setPuntuacion(puntuacion + 10);
    }
    if (casoActual < casos.length - 1) {
      setCasoActual(casoActual + 1);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Caso {casoActual + 1} de {casos.length}</h3>
        <p className="text-xl text-slate-300 mb-8">{casos[casoActual].pregunta}</p>
        <div className="grid grid-cols-1 gap-4">
          {casos[casoActual].respuestas.map((respuesta, index) => (
            <button
              key={index}
              onClick={() => responder(index)}
              className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/20 rounded-lg text-white font-bold hover:border-blue-400/50 hover:bg-blue-500/30 transition-all"
            >
              {respuesta}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const JuegoDefensorEspacio: React.FC<{ puntuacion: number; setPuntuacion: (p: number) => void }> = () => {
  const [posicion, setPosicion] = useState(50);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setPosicion(Math.max(0, posicion - 5));
      if (e.key === 'ArrowRight') setPosicion(Math.min(100, posicion + 5));
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [posicion]);

  return (
    <div className="w-full max-w-4xl h-96 relative bg-gradient-to-b from-slate-900 to-black rounded-2xl border border-white/20 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-center">
          <span className="text-4xl mb-4 block">🚀</span>
          Juego de Arcade - Esquiva los enemigos
        </p>
      </div>
      <div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all"
        style={{ left: `${posicion}%`, transform: 'translateX(-50%)' }}
      >
        <div className="text-4xl">🛸</div>
      </div>
    </div>
  );
};

const JuegoTetrisLegal: React.FC<{ puntuacion: number; setPuntuacion: (p: number) => void }> = () => {
  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Tetris Legal</h3>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {Array(16).fill(0).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-white/20 rounded-lg"
            />
          ))}
        </div>
        <p className="text-slate-300 text-center">Juego en desarrollo</p>
      </div>
    </div>
  );
};

const JuegoMemoriaLegal: React.FC<{ puntuacion: number; setPuntuacion: (p: number) => void }> = ({
  puntuacion,
  setPuntuacion
}) => {
  const [cartas, setCartas] = useState<boolean[]>(Array(12).fill(false));
  const [volteadas, setVolteadas] = useState<number[]>([]);

  const voltearCarta = (indice: number) => {
    if (volteadas.length < 2 && !volteadas.includes(indice)) {
      const nuevasVolteadas = [...volteadas, indice];
      setVolteadas(nuevasVolteadas);

      if (nuevasVolteadas.length === 2) {
        if (nuevasVolteadas[0] % 2 === nuevasVolteadas[1] % 2) {
          setPuntuacion(puntuacion + 10);
          const nuevasCartas = [...cartas];
          nuevasVolteadas.forEach(i => (nuevasCartas[i] = true));
          setCartas(nuevasCartas);
        }
        setTimeout(() => setVolteadas([]), 1000);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Memoria Legal</h3>
        <div className="grid grid-cols-4 gap-3">
          {cartas.map((encontrada, i) => (
            <button
              key={i}
              onClick={() => voltearCarta(i)}
              disabled={encontrada || volteadas.includes(i)}
              className={`aspect-square rounded-lg font-bold text-2xl transition-all ${
                encontrada || volteadas.includes(i)
                  ? 'bg-green-500/30 border-green-400/50'
                  : 'bg-blue-500/30 border-blue-400/50 hover:bg-blue-500/50'
              } border`}
            >
              {encontrada || volteadas.includes(i) ? '⚖️' : '?'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamePlayerMultiDevice;
