import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2, Menu, Clock, Wifi, Battery, Volume2, Calculator, FileText, MessageSquare, ShoppingCart, BookOpen, Users } from 'lucide-react';

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

const AbogadosOSCompleto: React.FC = () => {
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
    { id: 'tienda', nombre: 'Tienda Legal', icono: '🛍️', link: '/tienda' },
    { id: 'suscripciones', nombre: 'Planes', icono: '💎', link: '/planes' },
    { id: 'blog', nombre: 'Blog Legal', icono: '📚', link: '/blog' },
    { id: 'consultas', nombre: 'Consultas', icono: '💬', link: '/consultas' },
    { id: 'calculadora', nombre: 'Calculadora', icono: '🧮', link: '#' },
    { id: 'documentos', nombre: 'Documentos', icono: '📁', link: '/documentos' },
    { id: 'chat', nombre: 'Chat Legal', icono: '💭', link: '/chat' },
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥', link: '/usuarios' },
    { id: 'reportes', nombre: 'Reportes', icono: '📊', link: '/reportes' },
    { id: 'configuracion', nombre: 'Configuración', icono: '⚙️', link: '/configuracion' },
  ];

  const openWindow = (app: typeof desktopApps[0]) => {
    if (windows.some(w => w.id === app.id)) {
      setActiveWindow(app.id);
      return;
    }

    let content: React.ReactNode;

    switch (app.id) {
      case 'servicios':
        content = (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Servicios Legales Profesionales</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Derecho Penal', 'Derecho Civil', 'Derecho Laboral', 'Derecho de Tránsito', 'Derecho Comercial', 'Derecho Aduanero'].map((servicio) => (
                <div key={servicio} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-bold text-slate-900">{servicio}</p>
                  <p className="text-sm text-slate-600">Desde $400</p>
                </div>
              ))}
            </div>
            <a href="/servicios" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
              Ver Todos los Servicios →
            </a>
          </div>
        );
        break;

      case 'tienda':
        content = (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Tienda Legal</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Plantillas Legales', 'Cursos Online', 'Libros Digitales', 'Consultas Premium'].map((producto) => (
                <div key={producto} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-bold text-slate-900">{producto}</p>
                  <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-700">
                    Comprar
                  </button>
                </div>
              ))}
            </div>
            <a href="/tienda" className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">
              Ir a la Tienda →
            </a>
          </div>
        );
        break;

      case 'suscripciones':
        content = (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Planes de Suscripción</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { nombre: 'Normal', precio: '$29.99/mes', features: ['2 consultas/mes', 'Blog acceso'] },
                { nombre: 'Intermedio', precio: '$49.99/mes', features: ['4 consultas/mes', 'Cursos premium'] },
                { nombre: 'Premium', precio: '$99.99/mes', features: ['Ilimitado', 'Soporte 24/7'] },
              ].map((plan) => (
                <div key={plan.nombre} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="font-bold text-slate-900">{plan.nombre}</p>
                  <p className="text-lg font-bold text-purple-600 my-2">{plan.precio}</p>
                  <ul className="text-sm text-slate-600 space-y-1">
                    {plan.features.map((f) => <li key={f}>✓ {f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <a href="/planes" className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700">
              Ver Planes →
            </a>
          </div>
        );
        break;

      case 'blog':
        content = (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Blog Legal</h2>
            <div className="space-y-4">
              {[
                { titulo: 'Guía Completa sobre Procesos Penales en Ecuador', fecha: '2023-12-10' },
                { titulo: 'Derechos y Obligaciones en Accidentes de Tránsito', fecha: '2023-12-08' },
                { titulo: 'Actualización: Nueva Ley de Empresas en Ecuador', fecha: '2023-12-05' },
              ].map((post) => (
                <div key={post.titulo} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-bold text-slate-900">{post.titulo}</p>
                  <p className="text-sm text-slate-600">{post.fecha}</p>
                </div>
              ))}
            </div>
            <a href="/blog" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700">
              Ver Blog Completo →
            </a>
          </div>
        );
        break;

      case 'calculadora':
        content = (
          <div className="p-8 flex flex-col items-center justify-center h-full">
            <div className="bg-slate-100 p-8 rounded-lg">
              <div className="bg-slate-900 text-white p-4 rounded mb-4 text-right text-3xl font-bold">0</div>
              <div className="grid grid-cols-4 gap-2">
                {['7', '8', '9', '/'].map((btn) => (
                  <button key={btn} className="p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">{btn}</button>
                ))}
                {['4', '5', '6', '*'].map((btn) => (
                  <button key={btn} className="p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">{btn}</button>
                ))}
                {['1', '2', '3', '-'].map((btn) => (
                  <button key={btn} className="p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">{btn}</button>
                ))}
                {['0', '.', '=', '+'].map((btn) => (
                  <button key={btn} className="p-4 bg-blue-600 text-white rounded font-bold hover:bg-blue-700">{btn}</button>
                ))}
              </div>
            </div>
          </div>
        );
        break;

      case 'consultas':
        content = (
          <div className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Consulta de Procesos Judiciales</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Tipo de Búsqueda</label>
                <select className="w-full p-2 border border-slate-300 rounded">
                  <option>Número de Causa</option>
                  <option>Nombre de Demandante</option>
                  <option>Nombre de Demandado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Provincia</label>
                <select className="w-full p-2 border border-slate-300 rounded">
                  <option>Imbabura</option>
                  <option>Pichincha</option>
                  <option>Guayas</option>
                </select>
              </div>
              <input type="text" placeholder="Ingrese el valor a buscar" className="w-full p-2 border border-slate-300 rounded" />
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
                Buscar
              </button>
            </div>
          </div>
        );
        break;

      default:
        content = (
          <div className="p-8 text-center">
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
        );
    }

    const newWindow: Window = {
      id: app.id,
      title: app.nombre,
      icon: app.icono,
      content,
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
              win.isMaximized ? 'inset-0 m-0' : 'w-[600px] h-[500px]'
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
            <span className="text-sm font-bold">Abg. Wilson</span>
          </button>

          {/* Aplicaciones Abiertas */}
          <div className="flex gap-2 flex-wrap">
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

      {/* Footer */}
      <div className="bg-slate-950 text-slate-400 text-xs px-4 py-2 text-center">
        © 2025 Abg. Wilson Alexander Ipiales Guerrón - Sistema Operativo Legal Profesional v1.0
      </div>
    </div>
  );
};

export default AbogadosOSCompleto;
