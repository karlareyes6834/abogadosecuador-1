import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Scale, 
  Gamepad2, 
  Wallet, 
  ArrowRight,
  Zap,
  CheckCircle,
  Sparkles
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  status: 'active' | 'beta' | 'coming';
  link: string;
  features: string[];
  stats: { label: string; value: string }[];
}

const ProjectsHubPage: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const projects: Project[] = [
    {
      id: 'abogados-os',
      title: 'Abogados OS',
      description: 'Sistema operativo profesional para gestión legal integral',
      icon: <Scale className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-600',
      gradient: 'from-indigo-500/20 to-purple-600/20',
      status: 'active',
      link: '/abogados-os',
      features: [
        'Gestión de casos legales',
        'Calendario profesional',
        'Explorador de archivos',
        'Navegador web integrado'
      ],
      stats: [
        { label: 'Casos Activos', value: '24' },
        { label: 'Documentos', value: '156' },
        { label: 'Clientes', value: '42' }
      ]
    },
    {
      id: 'games',
      title: 'Intro Wilex Game Station',
      description: 'Plataforma de entretenimiento con juegos y experiencias interactivas',
      icon: <Gamepad2 className="w-8 h-8" />,
      color: 'from-cyan-500 to-blue-600',
      gradient: 'from-cyan-500/20 to-blue-600/20',
      status: 'active',
      link: '/games',
      features: [
        'Juegos interactivos',
        'Sistema de puntuación',
        'Logros y desafíos',
        'Multijugador'
      ],
      stats: [
        { label: 'Juegos', value: '12' },
        { label: 'Jugadores', value: '1.2K' },
        { label: 'Puntos Totales', value: '2.5M' }
      ]
    },
    {
      id: 'crypto-banking',
      title: 'WI Global Banking & Crypto',
      description: 'Plataforma integral de banca digital, wallet y trading de criptomonedas',
      icon: <Wallet className="w-8 h-8" />,
      color: 'from-emerald-500 to-teal-600',
      gradient: 'from-emerald-500/20 to-teal-600/20',
      status: 'active',
      link: '/crypto-banking',
      features: [
        'Wallet de criptomonedas',
        'Trading en tiempo real',
        'Conversión Fiat ↔ Crypto',
        'Análisis de mercado'
      ],
      stats: [
        { label: 'Activos', value: '$2.4M' },
        { label: 'Transacciones', value: '847' },
        { label: 'Usuarios Activos', value: '3.2K' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Plataforma Integrada Profesional</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Proyectos Integrados
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Accede a nuestros sistemas profesionales: gestión legal, entretenimiento y finanzas digitales, todo en una plataforma unificada
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative h-full"
              >
                {/* Animated Background Glow */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${project.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  animate={hoveredProject === project.id ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Card */}
                <motion.div
                  className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 group-hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Status Badge */}
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                      project.status === 'active' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/50' 
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50'
                    }`}>
                      {project.status === 'active' && <CheckCircle className="w-3 h-3" />}
                      {project.status === 'active' ? 'Activo' : 'Beta'}
                    </span>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} p-3 mb-6 text-white`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {project.icon}
                  </motion.div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 flex-grow">{project.description}</p>

                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    {project.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={hoveredProject === project.id ? { opacity: 1, x: 0 } : { opacity: 0.6, x: -10 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <Zap className="w-3 h-3 text-purple-400" />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-gray-700/50">
                    {project.stats.map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={hoveredProject === project.id ? { opacity: 1 } : { opacity: 0.7 }}
                        className="text-center"
                      >
                        <div className="text-lg font-bold text-purple-400">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link to={project.link}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      Acceder
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">¿No tienes cuenta?</h2>
            <p className="text-gray-300 mb-6">Regístrate ahora para acceder a todos nuestros servicios profesionales</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Crear Cuenta
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-purple-500/50 hover:border-purple-500 text-purple-300 hover:text-purple-200 font-semibold rounded-lg transition-all duration-300"
                >
                  Iniciar Sesión
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsHubPage;
