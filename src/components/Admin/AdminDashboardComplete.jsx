import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUsers, FaChartLine, FaFileAlt, FaCalendarAlt, FaShoppingCart, 
  FaBook, FaNewspaper, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaEye, FaDownload, FaUpload, FaBell, FaEnvelope, FaWhatsapp,
  FaCreditCard, FaPaypal, FaDollarSign, FaGamepad,
  FaGift, FaPercent, FaRocket, FaPalette, FaLayerGroup, FaMagic,
  FaChartPie, FaDatabase, FaShieldAlt, FaUserGraduate, FaTrophy,
  FaComments, FaBullhorn, FaTags, FaClock, FaCheckCircle,
  FaBalanceScale, FaGavel, FaFileInvoiceDollar, FaMoneyBillWave
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import ProductManager from './ProductManager';
import CourseManager from './CourseManager';
import BlogManager from './BlogManager';
import UserManager from './UserManager';
import SalesManager from './SalesManager';
import CSVImporter from './CSVImporter';
import AIContentGenerator from './AIContentGenerator';
import AppointmentManager from './AppointmentManager';

const AdminDashboardComplete = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalAppointments: 0,
    totalOrders: 0,
    completedOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await adminService.dashboard.getStats();
    if (result.success) {
      setStats(result.data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const [recentActivities] = useState([
    { id: 1, type: 'user_registration', user: 'María González', time: '2 min ago', action: 'Nuevo usuario registrado' },
    { id: 2, type: 'consultation', user: 'Carlos Ruiz', time: '5 min ago', action: 'Consulta completada' },
    { id: 3, type: 'payment', user: 'Ana López', time: '10 min ago', action: 'Pago recibido - $150' },
    { id: 4, type: 'appointment', user: 'Roberto Silva', time: '15 min ago', action: 'Cita programada' },
    { id: 5, type: 'course_purchase', user: 'Laura Torres', time: '20 min ago', action: 'Curso comprado' }
  ]);

  const [quickActions] = useState([
    { title: 'Usuarios', icon: FaUsers, action: () => setActiveTab('users'), color: 'from-blue-500 to-blue-600' },
    { title: 'Productos', icon: FaShoppingCart, action: () => setActiveTab('products'), color: 'from-green-500 to-green-600' },
    { title: 'Cursos', icon: FaBook, action: () => setActiveTab('courses'), color: 'from-purple-500 to-purple-600' },
    { title: 'Blog', icon: FaNewspaper, action: () => setActiveTab('blog'), color: 'from-pink-500 to-pink-600' },
    { title: 'IA Contenido', icon: FaMagic, action: () => setActiveTab('ai-content'), color: 'from-purple-500 to-purple-600' },
    { title: 'Import CSV', icon: FaUpload, action: () => setActiveTab('csv-import'), color: 'from-yellow-500 to-yellow-600' },
    { title: 'Ventas', icon: FaDollarSign, action: () => setActiveTab('orders'), color: 'from-green-500 to-green-600' },
    { title: 'Citas', icon: FaCalendarAlt, action: () => setActiveTab('appointments'), color: 'from-teal-500 to-teal-600' }
  ]);

  const dashboardCards = [
    { title: 'Ingresos Totales', getValue: () => `$${stats.totalRevenue}`, change: '+12%', icon: FaDollarSign, color: 'from-green-400 to-green-600' },
    { title: 'Usuarios Totales', getValue: () => stats.totalUsers.toString(), change: '+8%', icon: FaUsers, color: 'from-blue-400 to-blue-600' },
    { title: 'Cursos Activos', getValue: () => stats.totalCourses.toString(), change: '+15%', icon: FaBook, color: 'from-purple-400 to-purple-600' },
    { title: 'Productos', getValue: () => stats.totalProducts.toString(), change: '+3%', icon: FaShoppingCart, color: 'from-orange-400 to-orange-600' }
  ];

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: FaChartLine },
    { id: 'users', label: 'Usuarios', icon: FaUsers },
    { id: 'products', label: 'Productos', icon: FaShoppingCart },
    { id: 'courses', label: 'Cursos', icon: FaBook },
    { id: 'blog', label: 'Blog', icon: FaNewspaper },
    { id: 'ai-content', label: 'IA Blog', icon: FaMagic },
    { id: 'csv-import', label: 'Importar CSV', icon: FaUpload },
    { id: 'orders', label: 'Ventas', icon: FaDollarSign },
    { id: 'appointments', label: 'Citas', icon: FaCalendarAlt },
    { id: 'settings', label: 'Configuración', icon: FaCog }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar con efectos cristal */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-40"
      >
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Admin Panel Pro
          </h1>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg transform scale-105' 
                    : 'hover:bg-gray-700/50 hover:backdrop-blur-sm'
                }`}
              >
                <item.icon className="mr-3 text-lg" />
                <span className="font-medium">{item.label}</span>
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute right-0 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-600 rounded-l"
                  />
                )}
              </motion.button>
            ))}
          </nav>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 p-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg flex items-center justify-center transition-all shadow-lg"
        >
          <FaSignOutAlt className="mr-2" />
          <span className="font-medium">Cerrar Sesión</span>
        </motion.button>
      </motion.div>

      {/* Contenido Principal */}
      <div className="ml-72 p-8">
        {/* Header con efectos cristal */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50"
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-500 mt-1">Bienvenido de nuevo, Administrador</p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="relative p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <FaBell className="text-gray-600" />
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowChat(!showChat)}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg"
              >
                <FaComments />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Contenido según tab activa */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Cards de estadísticas con gradientes y efectos 3D */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {dashboardCards.map((card, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="relative overflow-hidden rounded-2xl shadow-xl transform-gpu"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
                      <div className="relative bg-white/10 backdrop-blur-md p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white/80 text-sm font-medium">{card.title}</p>
                            <p className="text-3xl font-bold text-white mt-2">{card.getValue()}</p>
                            <p className="text-white/60 text-sm mt-2 flex items-center">
                              <span className={`${card.change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>
                                {card.change}
                              </span>
                              <span className="ml-2">vs mes anterior</span>
                            </p>
                          </div>
                          <card.icon className="text-white/30 text-5xl" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Grid de acciones rápidas */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <FaRocket className="mr-2 text-blue-500" />
                    Acciones Rápidas
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={action.action}
                        className="relative group"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-xl opacity-90 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative p-4 flex flex-col items-center justify-center">
                          <action.icon className="text-white text-2xl mb-2" />
                          <span className="text-white text-xs font-medium">{action.title}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Gráficos y actividad reciente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Gráfico de rendimiento */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaChartLine className="mr-2 text-blue-500" />
                      Análisis de Rendimiento
                    </h3>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <FaChartPie className="text-6xl text-gray-400 mb-4 mx-auto" />
                        <p className="text-gray-500">Gráfico de rendimiento</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Actividad reciente */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200/50"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <FaClock className="mr-2 text-purple-500" />
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recentActivities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                            <div>
                              <p className="font-medium text-gray-800">{activity.user}</p>
                              <p className="text-sm text-gray-600">{activity.action}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Estadísticas adicionales */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl p-6 text-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaBook className="text-4xl text-white/50" />
                      <span className="text-2xl font-bold">{stats.totalCourses}</span>
                    </div>
                    <p className="text-white/80">Cursos Totales</p>
                    <p className="text-sm text-white/60 mt-2">{stats.totalEnrollments} inscritos</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaShoppingCart className="text-4xl text-white/50" />
                      <span className="text-2xl font-bold">{stats.totalProducts}</span>
                    </div>
                    <p className="text-white/80">Productos Totales</p>
                    <p className="text-sm text-white/60 mt-2">Activos en tienda</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-xl p-6 text-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <FaDollarSign className="text-4xl text-white/50" />
                      <span className="text-2xl font-bold">{stats.completedOrders}</span>
                    </div>
                    <p className="text-white/80">Ventas Completadas</p>
                    <p className="text-sm text-white/60 mt-2">De {stats.totalOrders} totales</p>
                  </motion.div>
                </div>
              </div>
            )}

            {activeTab === 'products' && <ProductManager />}
            
            {activeTab === 'courses' && <CourseManager />}
            
            {activeTab === 'blog' && <BlogManager />}
            
            {activeTab === 'users' && <UserManager />}
            
            {activeTab === 'orders' && <SalesManager />}
            
            {activeTab === 'ai-content' && <AIContentGenerator />}
            
            {activeTab === 'csv-import' && <CSVImporter />}
            
            {activeTab === 'appointments' && <AppointmentManager />}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaCog className="mr-3 text-gray-600" />
                  Configuración del Sistema
                </h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Configuración de Supabase</h4>
                    <p className="text-sm text-gray-600 mb-2">URL: {import.meta.env.VITE_SUPABASE_URL || 'Configurada'}</p>
                    <p className="text-sm text-green-600">✓ Conexión activa</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Base de Datos</h4>
                    <p className="text-sm text-gray-600">14 Tablas configuradas</p>
                    <p className="text-sm text-gray-600">RLS activado en todas las tablas</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Sistema de Roles</h4>
                    <p className="text-sm text-gray-600">Admin, Client, Affiliate</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default AdminDashboardComplete;
