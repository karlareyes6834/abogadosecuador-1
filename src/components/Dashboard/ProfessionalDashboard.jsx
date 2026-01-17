import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaChartLine, FaFileAlt, FaCalendarAlt, FaShoppingCart, 
  FaBook, FaNewspaper, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaEye, FaDownload, FaUpload, FaBell, FaEnvelope, FaWhatsapp,
  FaCreditCard, FaPaypal, FaBitcoin, FaDollarSign, FaBalanceScale,
  FaGavel, FaCar, FaBuilding, FaShip, FaGlobe, FaUserTie
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  getAllLegalServices, 
  getConsultationTypes, 
  getAvailableSchedule,
  generateServiceSummary 
} from '../../services/professionalServices.js';

const ProfessionalDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalRevenue: 45600,
    totalConsultations: 890,
    totalAppointments: 234,
    totalProducts: 45,
    totalCourses: 12,
    totalEbooks: 28,
    totalAffiliates: 67
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'user_registration', user: 'María González', time: '2 min ago', action: 'Nuevo usuario registrado' },
    { id: 2, type: 'consultation', user: 'Carlos Ruiz', time: '5 min ago', action: 'Consulta completada' },
    { id: 3, type: 'payment', user: 'Ana López', time: '10 min ago', action: 'Pago recibido - $150' },
    { id: 4, type: 'appointment', user: 'Roberto Silva', time: '15 min ago', action: 'Cita programada' },
    { id: 5, type: 'course_purchase', user: 'Laura Torres', time: '20 min ago', action: 'Curso comprado' }
  ]);

  const [services, setServices] = useState([]);
  const [consultationTypes, setConsultationTypes] = useState({});
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    // Cargar datos del sistema
    const loadSystemData = async () => {
      try {
        const servicesData = getAllLegalServices();
        const consultationData = getConsultationTypes();
        const scheduleData = getAvailableSchedule();
        const summary = generateServiceSummary();

        setServices(servicesData);
        setConsultationTypes(consultationData);
        setSchedule(scheduleData);

        console.log('Resumen del sistema:', summary);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar datos del sistema');
      }
    };

    loadSystemData();
  }, []);

  const quickActions = [
    { title: 'Agregar Usuario', icon: FaUsers, action: () => setActiveTab('users'), color: 'bg-blue-500' },
    { title: 'Crear Producto', icon: FaShoppingCart, action: () => setActiveTab('products'), color: 'bg-green-500' },
    { title: 'Nuevo Curso', icon: FaBook, action: () => setActiveTab('courses'), color: 'bg-purple-500' },
    { title: 'Publicar Blog', icon: FaFileAlt, action: () => setActiveTab('blog'), color: 'bg-orange-500' },
    { title: 'Gestionar Citas', icon: FaCalendarAlt, action: () => setActiveTab('appointments'), color: 'bg-red-500' },
    { title: 'Configuración', icon: FaCog, action: () => setActiveTab('settings'), color: 'bg-gray-500' }
  ];

  // Overview Tab
  const OverviewTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+8%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalConsultations}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaFileAlt className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+15%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAppointments}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaCalendarAlt className="text-orange-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+22%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>
      </div>

      {/* Servicios Legales */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Servicios Legales Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{service.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.price}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
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
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <FaPlus className="inline mr-2" />
            Nuevo Servicio
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{service.icon}</span>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
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
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            <FaPlus className="inline mr-2" />
            Nueva Cita
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaBalanceScale className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Abogado Wilson</h1>
                <p className="text-sm text-gray-600">Panel de Administración Profesional</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <FaBell className="text-xl" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <FaEnvelope className="text-xl" />
              </button>
              <button className="text-gray-600 hover:text-gray-900">
                <FaWhatsapp className="text-xl" />
              </button>
              <button className="text-red-600 hover:text-red-800">
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', name: 'Vista General', icon: FaChartLine },
              { id: 'services', name: 'Servicios', icon: FaGavel },
              { id: 'appointments', name: 'Citas', icon: FaCalendarAlt },
              { id: 'users', name: 'Usuarios', icon: FaUsers },
              { id: 'courses', name: 'Cursos', icon: FaBook },
              { id: 'blog', name: 'Blog', icon: FaNewspaper },
              { id: 'settings', name: 'Configuración', icon: FaCog }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
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
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'services' && <ServicesTab />}
        {activeTab === 'appointments' && <AppointmentsTab />}
        {activeTab === 'users' && <div className="text-center py-12 text-gray-500">Gestión de Usuarios - En desarrollo</div>}
        {activeTab === 'courses' && <div className="text-center py-12 text-gray-500">Gestión de Cursos - En desarrollo</div>}
        {activeTab === 'blog' && <div className="text-center py-12 text-gray-500">Gestión de Blog - En desarrollo</div>}
        {activeTab === 'settings' && <div className="text-center py-12 text-gray-500">Configuración - En desarrollo</div>}
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
