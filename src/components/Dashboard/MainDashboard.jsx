import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaChartLine, FaFileAlt, FaCalendarAlt, FaShoppingCart, 
  FaBook, FaNewspaper, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaEye, FaDownload, FaUpload, FaBell, FaEnvelope, FaWhatsapp,
  FaCreditCard, FaPaypal, FaBitcoin, FaDollarSign, FaBalanceScale,
  FaGavel, FaCar, FaBuilding, FaShip, FaGlobe, FaUserTie, FaLightbulb,
  FaRocket, FaStar, FaTrophy, FaAward, FaCertificate, FaGraduationCap,
  FaHandshake, FaChartBar, FaPieChart, FaTable, FaList, FaThumbsUp
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllLegalServices, 
  getConsultationTypes, 
  getAvailableSchedule,
  generateServiceSummary 
} from '../../services/professionalServices.js';
import { dataService } from '../../services/apiService';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalConsultations: 0,
    totalAppointments: 0,
    totalProducts: 0,
    totalCourses: 0,
    totalEbooks: 0,
    totalAffiliates: 0,
    totalCampaigns: 0,
    totalDocuments: 0
  });
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState({});
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const loadSystemData = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, we would fetch data from the backend
        // const usersResponse = await dataService.getAll('users');
        // const paymentsResponse = await dataService.getAll('payments');
        // const consultationsResponse = await dataService.getAll('consultations');
        // const appointmentsResponse = await dataService.getAll('appointments');
        // const productsResponse = await dataService.getAll('products');
        // const coursesResponse = await dataService.getAll('courses');
        // const ebooksResponse = await dataService.getAll('ebooks');
        
        // For now, we'll use sample data with a delay to simulate API calls
        setTimeout(() => {
          const servicesData = getAllLegalServices();
          const consultationData = getConsultationTypes();
          const scheduleData = getAvailableSchedule();
          const summary = generateServiceSummary();
          
          setServices(servicesData);
          setConsultationTypes(consultationData);
          setSchedule(scheduleData);
          
          // Update stats with real data
          setStats({
            totalUsers: 1250,
            totalRevenue: 45600,
            totalConsultations: 890,
            totalAppointments: 234,
            totalProducts: 45,
            totalCourses: 12,
            totalEbooks: 28,
            totalAffiliates: 67,
            totalCampaigns: 23,
            totalDocuments: 156
          });
          
          console.log('Resumen del sistema:', summary);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar datos del sistema');
        setLoading(false);
      }
    };

    loadSystemData();
  }, []);

  const quickActions = [
    { title: 'Agregar Usuario', icon: FaUsers, action: () => setActiveTab('users'), color: 'bg-blue-500', description: 'Registrar nuevo usuario' },
    { title: 'Crear Producto', icon: FaShoppingCart, action: () => setActiveTab('products'), color: 'bg-green-500', description: 'Agregar nuevo producto' },
    { title: 'Nuevo Curso', icon: FaBook, action: () => setActiveTab('courses'), color: 'bg-purple-500', description: 'Crear curso legal' },
    { title: 'Publicar Blog', icon: FaNewspaper, action: () => setActiveTab('blog'), color: 'bg-orange-500', description: 'Escribir artículo' },
    { title: 'Gestionar Citas', icon: FaCalendarAlt, action: () => setActiveTab('appointments'), color: 'bg-red-500', description: 'Programar citas' },
    { title: 'Configuración', icon: FaCog, action: () => setActiveTab('settings'), color: 'bg-gray-500', description: 'Ajustes del sistema' }
  ];

  // Overview Tab
  const OverviewTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={action.action}
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Usuarios</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-400 rounded-full">
                  <FaUsers className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-blue-100 text-sm font-medium">+12%</span>
                <span className="text-blue-200 text-sm ml-2">vs mes anterior</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Ingresos Totales</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-400 rounded-full">
                  <FaDollarSign className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-green-100 text-sm font-medium">+8%</span>
                <span className="text-green-200 text-sm ml-2">vs mes anterior</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">Consultas</p>
                  <p className="text-3xl font-bold">{stats.totalConsultations}</p>
                </div>
                <div className="p-3 bg-purple-400 rounded-full">
                  <FaFileAlt className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-purple-100 text-sm font-medium">+15%</span>
                <span className="text-purple-200 text-sm ml-2">vs mes anterior</span>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-100">Citas</p>
                  <p className="text-3xl font-bold">{stats.totalAppointments}</p>
                </div>
                <div className="p-3 bg-orange-400 rounded-full">
                  <FaCalendarAlt className="text-xl" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-orange-100 text-sm font-medium">+22%</span>
                <span className="text-orange-200 text-sm ml-2">vs mes anterior</span>
              </div>
            </motion.div>
          </div>

          {/* Servicios Legales */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Servicios Legales Disponibles</h3>
              <span className="text-sm text-gray-500">{services.length} servicios activos</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-600">{service.price}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500">{service.duration}</span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Ver detalles
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );

  // Services Tab
  const ServicesTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Servicios</h3>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <FaPlus />
            <span>Nuevo Servicio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{service.icon}</span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded">
                    <FaTrash />
                  </button>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{service.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-medium">{service.price}</span>
                <span className="text-gray-500 text-sm">{service.duration}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Appointments Tab
  const AppointmentsTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Citas</h3>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <FaPlus />
            <span>Nueva Cita</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horarios Disponibles */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Horarios Disponibles</h4>
            <div className="space-y-2">
              {Object.entries(schedule).map(([day, config]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="capitalize font-medium">{day}</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    config.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {config.available ? `${config.start} - ${config.end}` : 'Cerrado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de Cita */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Tipos de Cita</h4>
            <div className="space-y-3">
              {Object.entries(consultationTypes).map(([key, type]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-3">
                  <h5 className="font-medium text-gray-900">{type.name}</h5>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-green-600 font-medium">{type.price}</span>
                    <span className="text-gray-500 text-sm">{type.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FaBalanceScale className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Abogado Wilson</h1>
                <p className="text-sm text-gray-600">Panel de Administración Profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaBell className="text-xl" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaEnvelope className="text-xl" />
              </button>
              <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FaWhatsapp className="text-xl" />
              </button>
              <button className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors">
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Vista General', icon: FaChartLine },
              { id: 'services', name: 'Servicios', icon: FaGavel },
              { id: 'appointments', name: 'Citas', icon: FaCalendarAlt },
              { id: 'users', name: 'Usuarios', icon: FaUsers },
              { id: 'courses', name: 'Cursos', icon: FaBook },
              { id: 'blog', name: 'Blog', icon: FaNewspaper },
              { id: 'campaigns', name: 'Campañas', icon: FaRocket },
              { id: 'settings', name: 'Configuración', icon: FaCog }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab key="overview" />}
          {activeTab === 'services' && <ServicesTab key="services" />}
          {activeTab === 'appointments' && <AppointmentsTab key="appointments" />}
          {activeTab === 'users' && <div key="users" className="text-center py-12 text-gray-500">Gestión de Usuarios - En desarrollo</div>}
          {activeTab === 'courses' && <div key="courses" className="text-center py-12 text-gray-500">Gestión de Cursos - En desarrollo</div>}
          {activeTab === 'blog' && <div key="blog" className="text-center py-12 text-gray-500">Gestión de Blog - En desarrollo</div>}
          {activeTab === 'campaigns' && <div key="campaigns" className="text-center py-12 text-gray-500">Gestión de Campañas - En desarrollo</div>}
          {activeTab === 'settings' && <div key="settings" className="text-center py-12 text-gray-500">Configuración - En desarrollo</div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainDashboard;
