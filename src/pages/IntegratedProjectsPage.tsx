import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Scale, 
  Wallet, 
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Layers
} from 'lucide-react';

interface ProjectCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: 'active' | 'beta' | 'coming';
  link: string;
  features: string[];
  stats?: {
    label: string;
    value: string;
  }[];
}

const IntegratedProjectsPage: React.FC = () => {

  const projects: ProjectCard[] = [
    {
      id: 'abogados-os',
      title: 'Abogados OS',
      description: 'Sistema operativo profesional para gestión legal integral',
      icon: <Scale className="w-8 h-8" />,
      color: 'from-indigo-500 to-purple-600',
      status: 'active',
      link: '/abogados-os',
      features: [
        'Gestión de casos legales',
        'Calendario profesional',
        'Explorador de archivos',
        'Navegador web integrado',
        'Calculadora avanzada'
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
      status: 'active',
      link: '/games',
      features: [
        'Juegos interactivos',
        'Sistema de puntuación',
        'Logros y desafíos',
        'Multijugador',
        'Experiencias inmersivas'
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
      status: 'active',
      link: '/crypto-banking',
      features: [
        'Wallet de criptomonedas',
        'Trading en tiempo real',
        'Conversión Fiat ↔ Crypto',
        'Análisis de mercado',
        'Gestión de activos',
        'Notificaciones inteligentes'
      ],
      stats: [
        { label: 'Activos', value: '$2.4M' },
        { label: 'Transacciones', value: '847' },
        { label: 'Usuarios Activos', value: '3.2K' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Proyectos Integrados
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Accede a nuestros sistemas profesionales: gestión legal, entretenimiento y finanzas digitales, todo en una plataforma unificada
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" 
                   style={{
                     backgroundImage: `linear-gradient(135deg, var(--color-start), var(--color-end))`,
                     '--color-start': `rgb(99, 102, 241)`,
                     '--color-end': `rgb(168, 85, 247)`
                   } as any}
              />

              {/* Card Content */}
              <div className="relative bg-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'active' ? 'bg-green-500/20 text-green-300' :
                    project.status === 'beta' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {project.status === 'active' ? '✓ Activo' : 
                     project.status === 'beta' ? 'Beta' : 'Próximamente'}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} p-3 mb-6 text-white`}>
                  {project.icon}
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow">{project.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 mb-3">Características:</h4>
                  <ul className="space-y-2">
                    {project.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-400">
                        <Zap className="w-4 h-4 mr-2 text-purple-400" />
                        {feature}
                      </li>
                    ))}
                    {project.features.length > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        +{project.features.length - 3} más...
                      </li>
                    )}
                  </ul>
                </div>

                {/* Stats */}
                {project.stats && (
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-gray-700/50">
                    {project.stats.map((stat, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-lg font-bold text-purple-400">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  to={project.link}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-semibold flex items-center justify-center gap-2 transition-all duration-300 group/btn"
                >
                  Acceder
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Integration Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Beneficios de la Integración</h2>
          <p className="text-gray-400 text-lg">Una plataforma unificada para todas tus necesidades</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Layers className="w-8 h-8" />,
              title: 'Integración Completa',
              description: 'Todos los sistemas conectados en una sola plataforma'
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Seguridad Profesional',
              description: 'Encriptación de nivel empresarial en todas las transacciones'
            },
            {
              icon: <TrendingUp className="w-8 h-8" />,
              title: 'Análisis Avanzado',
              description: 'Reportes y estadísticas en tiempo real'
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Soporte 24/7',
              description: 'Equipo dedicado para asistirte en todo momento'
            }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-gray-800/30 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
              <div className="text-purple-400 mb-4">{benefit.icon}</div>
              <h3 className="font-bold mb-2">{benefit.title}</h3>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Estado del Sistema</h3>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400">Todos los sistemas operativos</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 bg-gray-700/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} p-2 text-white`}>
                    {project.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{project.title}</div>
                    <div className="text-xs text-gray-500">Operativo</div>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl rounded-2xl p-12 border border-purple-500/20">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Accede a cualquiera de nuestros sistemas integrados y descubre una experiencia profesional sin precedentes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/abogados-os"
              className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 font-semibold transition-colors"
            >
              Ir a Abogados OS
            </Link>
            <Link
              to="/games"
              className="px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold transition-colors"
            >
              Ir a Juegos
            </Link>
            <Link
              to="/crypto-banking"
              className="px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold transition-colors"
            >
              Ir a Finanzas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedProjectsPage;
