/**
 * Dashboard de Cliente Mejorado
 * Incluye historial de compras, cursos, consultas y más
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ordersService from '../../services/ordersService';
import courseProgressService from '../../services/courseProgressService';
import FloatingCard3D from '../Effects/FloatingCard3D';
import { 
  ShoppingCartIcon, 
  BookOpenIcon, 
  CalendarIcon,
  BellIcon,
  AwardIcon,
  ChartBarIcon
} from '../icons/InterfaceIcons';

const EnhancedClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'courses' | 'certificates'>('overview');

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Cargar órdenes
      const { data: ordersData } = await ordersService.getUserOrders(user!.id);
      setOrders(ordersData || []);

      // Cargar cursos con progreso
      const { data: coursesData } = await courseProgressService.getUserCoursesWithProgress(user!.id);
      setCourses(coursesData || []);

      // Cargar certificados
      const { data: certsData } = await courseProgressService.getUserCertificates(user!.id);
      setCertificates(certsData || []);

      // TODO: Cargar notificaciones
      // const { data: notifsData } = await notificationService.getUserNotifications(user!.id);
      // setNotifications(notifsData || []);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: 'Compras Totales',
      value: orders.length,
      icon: ShoppingCartIcon,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      label: 'Cursos Activos',
      value: courses.filter(c => c.progress < 100).length,
      icon: BookOpenIcon,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      label: 'Certificados',
      value: certificates.length,
      icon: AwardIcon,
      color: 'bg-green-500',
      change: '+3'
    },
    {
      label: 'Progreso Promedio',
      value: courses.length > 0 
        ? `${Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%`
        : '0%',
      icon: ChartBarIcon,
      color: 'bg-orange-500',
      change: '+8%'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Bienvenido, {user?.user_metadata?.full_name || user?.email}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Aquí está un resumen de tu actividad
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <FloatingCard3D key={index} intensity={10}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </FloatingCard3D>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Resumen' },
              { id: 'orders', label: 'Mis Compras' },
              { id: 'courses', label: 'Mis Cursos' },
              { id: 'certificates', label: 'Certificados' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Cursos en Progreso</h3>
                <div className="space-y-3">
                  {courses.filter(c => c.progress < 100).slice(0, 3).map(course => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={course.thumbnail || '/placeholder-course.jpg'} 
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                          <p className="text-sm text-gray-500">{course.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{course.progress}%</p>
                        <p className="text-xs text-gray-500">{course.completed_lessons}/{course.total_lessons} lecciones</p>
                      </div>
                    </div>
                  ))}
                  {courses.filter(c => c.progress < 100).length === 0 && (
                    <p className="text-gray-500 text-center py-8">No tienes cursos en progreso</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Últimas Compras</h3>
                <div className="space-y-3">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Orden #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">${order.total_amount.toFixed(2)}</p>
                        <span className={`
                          inline-block px-2 py-1 text-xs rounded-full
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}
                        `}>
                          {order.status === 'completed' ? 'Completado' :
                           order.status === 'pending' ? 'Pendiente' : 'Fallido'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No tienes compras registradas</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Historial de Compras</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.payment_method}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`
                            px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'}
                          `}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900">Ver Detalles</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Mis Cursos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div key={course.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={course.thumbnail || '/placeholder-course.jpg'} 
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">{course.category}</p>
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        {course.progress === 100 ? 'Revisar' : 'Continuar'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div>
              <h3 className="text-xl font-semibold mb-6">Mis Certificados</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map(cert => (
                  <div key={cert.id} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <AwardIcon className="h-8 w-8 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{cert.course_title}</h4>
                        <p className="text-sm text-gray-500">
                          Emitido el {new Date(cert.issued_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={cert.certificate_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Descargar
                    </a>
                  </div>
                ))}
                {certificates.length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <AwardIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aún no tienes certificados</p>
                    <p className="text-sm text-gray-400 mt-2">Completa un curso para obtener tu primer certificado</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedClientDashboard;
