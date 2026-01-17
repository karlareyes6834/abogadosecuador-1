import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  UsersIcon,
  CurrencyDollarIcon,
  GiftIcon,
  HomeIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
  stats?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  icon, 
  link, 
  color, 
  stats 
}) => {
  return (
    <Link 
      to={link} 
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${color} p-6 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
    >
      <div className="relative z-10">
        <div className="mb-4 inline-flex rounded-lg bg-white/20 p-3">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="mb-4 text-sm opacity-90">{description}</p>
        {stats && (
          <div className="text-2xl font-bold">{stats}</div>
        )}
      </div>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
    </Link>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'client';
  const userName = localStorage.getItem('userName') || 'Usuario';

  const clientCards = [
    {
      title: 'Mis Cursos',
      description: 'Accede a tus cursos y continúa aprendiendo',
      icon: <AcademicCapIcon className="h-8 w-8" />,
      link: '/dashboard/mis-cursos',
      color: 'from-blue-500 to-blue-600',
      stats: '3 activos'
    },
    {
      title: 'Mis E-books',
      description: 'Biblioteca digital con tus libros comprados',
      icon: <BookOpenIcon className="h-8 w-8" />,
      link: '/dashboard/mis-ebooks',
      color: 'from-purple-500 to-purple-600',
      stats: '12 libros'
    },
    {
      title: 'Citas Agendadas',
      description: 'Gestiona tus citas y consultas programadas',
      icon: <CalendarIcon className="h-8 w-8" />,
      link: '/dashboard/citas',
      color: 'from-green-500 to-green-600',
      stats: '2 próximas'
    },
    {
      title: 'Consultas',
      description: 'Historial y estado de tus consultas legales',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      link: '/dashboard/consultas',
      color: 'from-yellow-500 to-yellow-600',
      stats: '5 resueltas'
    },
    {
      title: 'Historial de Compras',
      description: 'Revisa todas tus transacciones y facturas',
      icon: <CreditCardIcon className="h-8 w-8" />,
      link: '/dashboard/historial-compras',
      color: 'from-red-500 to-red-600',
      stats: '$450 total'
    },
    {
      title: 'Mis Tokens',
      description: 'Gestiona tus tokens y beneficios',
      icon: <CurrencyDollarIcon className="h-8 w-8" />,
      link: '/dashboard/tokens',
      color: 'from-indigo-500 to-indigo-600',
      stats: '250 tokens'
    },
    {
      title: 'Programa de Referidos',
      description: 'Invita amigos y gana recompensas',
      icon: <UserGroupIcon className="h-8 w-8" />,
      link: '/dashboard/referidos',
      color: 'from-pink-500 to-pink-600',
      stats: '3 referidos'
    },
    {
      title: 'Mi Perfil',
      description: 'Actualiza tu información personal',
      icon: <UsersIcon className="h-8 w-8" />,
      link: '/dashboard/perfil',
      color: 'from-gray-500 to-gray-600',
      stats: '90% completo'
    }
  ];

  const adminCards = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administra usuarios y permisos',
      icon: <UsersIcon className="h-8 w-8" />,
      link: '/admin/usuarios',
      color: 'from-blue-600 to-blue-700',
      stats: '156 usuarios'
    },
    {
      title: 'Productos y Servicios',
      description: 'Gestiona el catálogo de productos',
      icon: <ShoppingBagIcon className="h-8 w-8" />,
      link: '/admin/productos',
      color: 'from-green-600 to-green-700',
      stats: '48 productos'
    },
    {
      title: 'Gestión de Cursos',
      description: 'Crea y administra cursos online',
      icon: <AcademicCapIcon className="h-8 w-8" />,
      link: '/admin/cursos',
      color: 'from-purple-600 to-purple-700',
      stats: '12 cursos'
    },
    {
      title: 'Blog y Contenido',
      description: 'Publica y edita artículos del blog',
      icon: <DocumentTextIcon className="h-8 w-8" />,
      link: '/admin/blog',
      color: 'from-yellow-600 to-yellow-700',
      stats: '34 artículos'
    },
    {
      title: 'Calendario de Citas',
      description: 'Gestiona todas las citas del sistema',
      icon: <CalendarIcon className="h-8 w-8" />,
      link: '/admin/citas',
      color: 'from-red-600 to-red-700',
      stats: '18 hoy'
    },
    {
      title: 'Sistema de Afiliados',
      description: 'Administra el programa de afiliados',
      icon: <UserGroupIcon className="h-8 w-8" />,
      link: '/admin/afiliados',
      color: 'from-indigo-600 to-indigo-700',
      stats: '24 activos'
    },
    {
      title: 'Analíticas',
      description: 'Estadísticas y reportes del sistema',
      icon: <ChartBarIcon className="h-8 w-8" />,
      link: '/admin/analiticas',
      color: 'from-pink-600 to-pink-700',
      stats: '+15% mes'
    },
    {
      title: 'Configuración',
      description: 'Ajustes generales del sistema',
      icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
      link: '/admin/configuracion',
      color: 'from-gray-600 to-gray-700',
      stats: 'Actualizado'
    }
  ];

  const cards = userRole === 'admin' ? adminCards : clientCards;
  const dashboardTitle = userRole === 'admin' ? 'Panel de Administración' : 'Mi Dashboard';
  const welcomeMessage = userRole === 'admin' 
    ? `Bienvenido al panel de control, ${userName}`
    : `Hola ${userName}, ¿qué deseas hacer hoy?`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{dashboardTitle}</h1>
              <p className="mt-2 text-lg text-gray-600">{welcomeMessage}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
            >
              <HomeIcon className="h-5 w-5" />
              Volver al inicio
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Gastado</p>
                <p className="text-2xl font-bold text-gray-900">$1,234</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cursos Activos</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Citas Este Mes</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tokens Disponibles</p>
                <p className="text-2xl font-bold text-gray-900">250</p>
              </div>
              <GiftIcon className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              link={card.link}
              color={card.color}
              stats={card.stats}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Actividad Reciente</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Nueva cita agendada</p>
                  <p className="text-sm text-gray-500">Consulta legal - 15 de enero, 10:00 AM</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Hace 2 horas</span>
            </div>
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <BookOpenIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">E-book descargado</p>
                  <p className="text-sm text-gray-500">Guía de Derecho Penal 2024</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Ayer</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AcademicCapIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Curso completado</p>
                  <p className="text-sm text-gray-500">Introducción al Derecho Civil - 100% completado</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">Hace 3 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;