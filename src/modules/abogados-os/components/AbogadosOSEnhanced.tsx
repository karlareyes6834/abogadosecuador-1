import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Briefcase, Users, Shield, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

interface WindowState {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export const AbogadosOSEnhanced: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'legal-info',
      title: 'Abg. Wilson - Información Legal',
      x: 100,
      y: 100,
      width: 600,
      height: 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: 1
    }
  ]);
  const [maxZIndex, setMaxZIndex] = useState(1);

  const handleFocus = (id: string) => {
    setMaxZIndex(maxZIndex + 1);
    setWindows(windows.map(w => 
      w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
    ));
  };

  const handleClose = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
  };

  const handleMinimize = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
    ));
  };

  const handleMaximize = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  };

  const handleMove = (id: string, x: number, y: number) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, x, y } : w
    ));
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black overflow-hidden relative">
      {/* Topbar Mac-style */}
      <div className="fixed top-0 inset-x-0 h-8 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center px-4 z-50">
        <div className="flex items-center gap-4 flex-1">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Abogados OS - Abg. Wilson</span>
        </div>
        <div className="text-xs text-slate-400">
          {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Desktop Background */}
      <div className="absolute inset-0 mt-8 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.1),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1),transparent_50%)]" />

      {/* Windows */}
      {windows.map(window => (
        !window.isMinimized && (
          <motion.div
            key={window.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute flex flex-col bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden"
            style={{
              left: window.isMaximized ? 0 : window.x,
              top: window.isMaximized ? 32 : window.y,
              width: window.isMaximized ? '100%' : window.width,
              height: window.isMaximized ? 'calc(100% - 32px)' : window.height,
              zIndex: window.zIndex
            }}
            onMouseDown={() => handleFocus(window.id)}
          >
            {/* Title Bar */}
            <div className="h-10 bg-gradient-to-r from-slate-700 to-slate-800 border-b border-slate-600/50 flex items-center justify-between px-4 cursor-move group"
              onMouseDown={(e) => {
                const startX = e.clientX - window.x;
                const startY = e.clientY - window.y;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  handleMove(window.id, moveEvent.clientX - startX, moveEvent.clientY - startY);
                };
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <span className="text-sm font-semibold text-slate-100">{window.title}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleMinimize(window.id)}
                  className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition"
                  title="Minimizar"
                />
                <button
                  onClick={() => handleMaximize(window.id)}
                  className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition"
                  title="Maximizar"
                />
                <button
                  onClick={() => handleClose(window.id)}
                  className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition"
                  title="Cerrar"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 text-slate-100">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                    <Scale className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Abg. Wilson Alexander Ipiales Guerrón</h1>
                    <p className="text-sm text-slate-400">Especialista en Derecho Penal, Civil, Laboral y Tránsito</p>
                    <p className="text-xs text-cyan-400 mt-1">15+ años de experiencia | 250+ casos ganados | 500+ clientes satisfechos</p>
                  </div>
                </div>

                {/* Servicios */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Shield, title: 'Derecho Penal', desc: 'Defensa especializada' },
                    { icon: Briefcase, title: 'Derecho Civil', desc: 'Conflictos civiles' },
                    { icon: Users, title: 'Derecho Laboral', desc: 'Relaciones laborales' },
                    { icon: CheckCircle, title: 'Derecho Tránsito', desc: 'Infracciones viales' }
                  ].map((service, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50 transition">
                      <service.icon className="w-5 h-5 text-cyan-400 mb-2" />
                      <p className="text-sm font-semibold">{service.title}</p>
                      <p className="text-xs text-slate-400">{service.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Contacto */}
                <div className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-cyan-400" />
                    <span>+593 988 835 269</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>alexip2@hotmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Ibarra, Imbabura, Ecuador</span>
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white font-semibold transition">
                  Agendar Consulta Gratuita
                </button>
              </div>
            </div>
          </motion.div>
        )
      ))}

      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-3 px-4 py-3 rounded-full bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 z-40">
        {[
          { icon: Scale, label: 'Servicios' },
          { icon: Briefcase, label: 'Casos' },
          { icon: Users, label: 'Clientes' },
          { icon: Mail, label: 'Contacto' }
        ].map((item, idx) => (
          <button
            key={idx}
            className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600 flex items-center justify-center transition group"
            title={item.label}
          >
            <item.icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
          </button>
        ))}
      </div>
    </div>
  );
};
