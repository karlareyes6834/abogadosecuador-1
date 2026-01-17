import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Gamepad2, Settings, Users, FileText, MessageSquare, Briefcase, BarChart3, ChevronRight } from 'lucide-react';

const AbogadosOSPageProfessional: React.FC = () => {
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const modulos = [
    {
      id: 'servicios',
      nombre: 'Servicios Legales',
      icono: '⚖️',
      descripcion: 'Consultas legales profesionales',
      link: '/servicios',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'juegos',
      nombre: 'Centro de Juegos',
      icono: '🎮',
      descripcion: 'Plataforma de juegos con tokens',
      link: '/games',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'documentos',
      nombre: 'Documentos',
      icono: '📋',
      descripcion: 'Gestión de documentos legales',
      link: '/documentos',
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50'
    },
    {
      id: 'chat',
      nombre: 'Chat Legal',
      icono: '💬',
      descripcion: 'Asesoría legal en tiempo real',
      link: '/chat',
      color: 'from-cyan-600 to-cyan-700',
      bgColor: 'bg-cyan-50'
    },
    {
      id: 'usuarios',
      nombre: 'Usuarios',
      icono: '👥',
      descripcion: 'Administración de usuarios',
      link: '/usuarios',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'reportes',
      nombre: 'Reportes',
      icono: '📊',
      descripcion: 'Estadísticas y análisis',
      link: '/reportes',
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-50'
    },
    {
      id: 'configuracion',
      nombre: 'Configuración',
      icono: '⚙️',
      descripcion: 'Ajustes del sistema',
      link: '/configuracion',
      color: 'from-gray-600 to-gray-700',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col">
      {/* Header Profesional */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">⚖️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Abogados OS</h1>
              <p className="text-xs text-slate-500">v1.0 Professional</p>
            </div>
          </div>

          <button 
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-all"
          >
            {menuAbierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Contenido Principal */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-2">Centro de Control</h2>
          <p className="text-slate-600">Accede a todos los módulos del sistema</p>
        </motion.div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {modulos.map((modulo, i) => (
            <motion.a
              key={modulo.id}
              href={modulo.link}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${modulo.bgColor} border-2 border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all group cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`text-5xl p-3 rounded-xl bg-gradient-to-br ${modulo.color} text-white`}>
                  {modulo.icono}
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-all" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{modulo.nombre}</h3>
              <p className="text-sm text-slate-600 mb-4">{modulo.descripcion}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${modulo.color}`}>
                Acceder →
              </div>
            </motion.a>
          ))}
        </div>

        {/* Información del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md"
        >
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Estado del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-green-700">ESTADO</p>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>
              <p className="text-3xl font-bold text-green-700">Activo</p>
              <p className="text-xs text-green-600 mt-2">Sistema funcionando correctamente</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
              <p className="text-sm font-semibold text-blue-700 mb-3">MÓDULOS</p>
              <p className="text-3xl font-bold text-blue-700">7</p>
              <p className="text-xs text-blue-600 mt-2">Módulos disponibles</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
              <p className="text-sm font-semibold text-purple-700 mb-3">VERSIÓN</p>
              <p className="text-3xl font-bold text-purple-700">1.0</p>
              <p className="text-xs text-purple-600 mt-2">Plataforma Legal Profesional</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Barra Inferior - Taskbar Style */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-t border-slate-200 shadow-lg mt-auto"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">⚖️</span>
            </div>
            <p className="text-sm font-semibold text-slate-700">Abogados OS</p>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
            <p>© 2025 Abg. Wilson Alexander Ipiales Guerrón</p>
            <span>•</span>
            <p>Sistema Legal Profesional v1.0</p>
          </div>

          <a
            href="/"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
          >
            Inicio
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default AbogadosOSPageProfessional;
