import React, { useState, useEffect } from 'react';

interface GameBrickBreakerProps {
  onClose: () => void;
}

export const GameBrickBreaker: React.FC<GameBrickBreakerProps> = ({ onClose }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);
  const [paletaPosicion, setPaletaPosicion] = useState(50);
  const [ladrillos, setLadrillos] = useState<Array<{ id: number; x: number; y: number; activo: boolean }>>([]);
  const tiempoInicio = React.useRef<number>(Date.now());

  useEffect(() => {
    // Inicializar ladrillos
    const nuevosLadrillos = Array(20).fill(null).map((_, i) => ({
      id: i,
      x: (i % 5) * 20,
      y: Math.floor(i / 5) * 15,
      activo: true
    }));
    setLadrillos(nuevosLadrillos);

    const intervalo = setInterval(() => {
      setTiempoTranscurrido(Math.floor((Date.now() - tiempoInicio.current) / 1000));
    }, 100);

    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('game-area')?.getBoundingClientRect();
      if (rect) {
        const posicion = ((e.clientX - rect.left) / rect.width) * 100;
        setPaletaPosicion(Math.max(0, Math.min(100, posicion)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const romperLadrillo = (id: number) => {
    setLadrillos(prev => prev.map(l => l.id === id ? { ...l, activo: false } : l));
    setPuntuacion(puntuacion + 10);
  };

  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="backdrop-blur-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/20 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Rompe Ladrillos Legal</h3>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs">Puntuación</p>
              <p className="text-2xl font-bold text-yellow-400">{puntuacion}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-xs">Tiempo</p>
              <p className="text-2xl font-bold text-blue-400">{formatearTiempo(tiempoTranscurrido)}</p>
            </div>
          </div>
        </div>

        {/* Área de Juego */}
        <div
          id="game-area"
          className="relative w-full h-96 bg-gradient-to-b from-slate-900 to-black rounded-lg border border-white/20 overflow-hidden mb-6"
        >
          {/* Ladrillos */}
          <div className="absolute inset-0 p-4">
            <div className="grid grid-cols-5 gap-2 h-full">
              {ladrillos.map(ladrillo => (
                ladrillo.activo && (
                  <button
                    key={ladrillo.id}
                    onClick={() => romperLadrillo(ladrillo.id)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 rounded hover:from-orange-400 hover:to-red-400 transition-all transform hover:scale-110"
                  />
                )
              ))}
            </div>
          </div>

          {/* Paleta */}
          <div
            className="absolute bottom-4 h-2 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-75"
            style={{ left: `${paletaPosicion}%`, transform: 'translateX(-50%)' }}
          />

          {/* Instrucciones */}
          <div className="absolute top-4 left-4 text-xs text-slate-300">
            <p>🖱️ Mueve el ratón para controlar la paleta</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">Ladrillos activos: {ladrillos.filter(l => l.activo).length}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-red-300 rounded-lg transition-all"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameBrickBreaker;
