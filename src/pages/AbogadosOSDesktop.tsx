import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, Menu, Clock, Wifi, Battery, Volume2 } from 'lucide-react';

interface Window {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
}

const AbogadosOSDesktop: React.FC = () => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [time, setTime] = useState(new Date());
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const desktopApps = [
    { id: 'servicios', nombre: 'Servicios Legales', icono: '⚖️', link: '/servicios' },
    { id: 'juegos', nombre: 'Centro de Juegos', icono: '🎮', link: '/games' },
    { id: 'documentos', nombre: 'Documentos', icono: '📁', link: '/documentos' },
    { id: 'chat', nombre: 'Chat Legal', icono: '💬', link: '/chat' },
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥', link: '/usuarios' },
    { id: 'reportes', nombre: 'Reportes', icono: '📊', link: '/reportes' },
    { id: 'configuracion', nombre: 'Configuración', icono: '⚙️', link: '/configuracion' },
  ];

  const openWindow = (app: typeof desktopApps[0]) => {
    const newWindow: Window = {
      id: app.id,
      title: app.nombre,
      icon: app.icono,
      content: (
        <div className="p-6 text-center">
          <p className="text-6xl mb-4">{app.icono}</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{app.nombre}</h2>
          <p className="text-slate-600 mb-6">Módulo: {app.nombre}</p>
          <a
            href={app.link}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Abrir Módulo →
          </a>
        </div>
      ),
      isMinimized: false,
      isMaximized: false,
      x: Math.random() * 200,
      y: Math.random() * 200,
    };

    setWindows([...windows, newWindow]);
    setActiveWindow(app.id);
  };

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const toggleMaximize = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col overflow-hidden">
      {/* Escritorio */}
      <div className="flex-1 p-8 overflow-auto relative">
        {/* Iconos del Escritorio */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-fit">
          {desktopApps.map((app) => (
            <motion.button
              key={app.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openWindow(app)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-white/20 transition-all"
            >
              <div className="text-6xl drop-shadow-lg">{app.icono}</div>
              <p className="text-white text-sm font-semibold text-center drop-shadow-md">{app.nombre}</p>
            </motion.button>
          ))}
        </div>

        {/* Ventanas Abiertas */}
        {windows.map((win) => (
          <motion.div
            key={win.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`absolute bg-white rounded-lg shadow-2xl overflow-hidden ${
              win.isMaximized ? 'inset-0 m-0' : 'w-96 h-96'
            }`}
            style={{
              left: win.isMaximized ? 0 : `${win.x}px`,
              top: win.isMaximized ? 0 : `${win.y}px`,
              zIndex: activeWindow === win.id ? 50 : 10,
            }}
          >
            {/* Barra de Título */}
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex justify-between items-center cursor-move"
              onMouseDown={() => setActiveWindow(win.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{win.icon}</span>
                <h3 className="font-bold">{win.title}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleMinimize(win.id)}
                  className="p-1 hover:bg-white/20 rounded transition-all"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleMaximize(win.id)}
                  className="p-1 hover:bg-white/20 rounded transition-all"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => closeWindow(win.id)}
                  className="p-1 hover:bg-red-500 rounded transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido */}
            {!win.isMinimized && (
              <div className="h-full overflow-auto bg-white">
                {win.content}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Barra de Tareas (Taskbar) */}
      <div className="bg-slate-900 border-t border-slate-700 px-4 py-3 flex justify-between items-center shadow-2xl">
        {/* Botón Inicio */}
        <div className="flex items-center gap-4">
          <button className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
            <Menu className="w-5 h-5" />
            <span className="text-sm font-bold">Inicio</span>
          </button>

          {/* Aplicaciones Abiertas */}
          <div className="flex gap-2">
            {windows.map((win) => (
              <button
                key={win.id}
                onClick={() => {
                  setActiveWindow(win.id);
                  setWindows(windows.map(w => 
                    w.id === win.id ? { ...w, isMinimized: false } : w
                  ));
                }}
                className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                  activeWindow === win.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {win.icon} {win.title}
              </button>
            ))}
          </div>
        </div>

        {/* Reloj y Sistema */}
        <div className="flex items-center gap-4 text-white">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <Battery className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">
              {time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbogadosOSDesktop;
