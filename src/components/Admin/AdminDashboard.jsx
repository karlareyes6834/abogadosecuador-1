import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUsers, FaChartLine, FaFileAlt, FaCalendarAlt, FaShoppingCart, 
  FaBook, FaNewspaper, FaCog, FaSignOutAlt, FaPlus, FaEdit, FaTrash,
  FaEye, FaDownload, FaUpload, FaBell, FaEnvelope, FaWhatsapp,
  FaCreditCard, FaPaypal, FaDollarSign, FaGamepad,
  FaGift, FaPercent, FaRocket, FaPalette, FaLayerGroup, FaMagic,
  FaChartPie, FaDatabase, FaShieldAlt, FaUserGraduate, FaTrophy,
  FaComments, FaBullhorn, FaTags, FaClock, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import TriviaSystem from '../Gamification/TriviaSystem';
import DragDropEditor from '../Editor/DragDropEditor';
import PromotionsManager from '../Promotions/PromotionsManager';
import LiveChat from '../Chat/LiveChat';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showChat, setShowChat] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalRevenue: 45600,
    totalConsultations: 890,
    totalAppointments: 234,
    totalProducts: 45,
    totalCourses: 12,
    totalEbooks: 28,
    totalAffiliates: 67,
    activePromotions: 8,
    completedGames: 342,
    pagesCreated: 23,
    totalMessages: 1567
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'user_registration', user: 'María González', time: '2 min ago', action: 'Nuevo usuario registrado' },
    { id: 2, type: 'consultation', user: 'Carlos Ruiz', time: '5 min ago', action: 'Consulta completada' },
    { id: 3, type: 'payment', user: 'Ana López', time: '10 min ago', action: 'Pago recibido - $150' },
    { id: 4, type: 'appointment', user: 'Roberto Silva', time: '15 min ago', action: 'Cita programada' },
    { id: 5, type: 'course_purchase', user: 'Laura Torres', time: '20 min ago', action: 'Curso comprado' }
  ]);

  const [quickActions] = useState([
    { title: 'Agregar Usuario', icon: FaUsers, action: () => setActiveTab('users'), color: 'bg-blue-500' },
    { title: 'Crear Producto', icon: FaShoppingCart, action: () => setActiveTab('products'), color: 'bg-green-500' },
    { title: 'Nuevo Curso', icon: FaBook, action: () => setActiveTab('courses'), color: 'bg-purple-500' },
    { title: 'Editor de Páginas', icon: FaPalette, action: () => setActiveTab('editor'), color: 'bg-pink-500' },
    { title: 'Promociones', icon: FaGift, action: () => setActiveTab('promotions'), color: 'bg-yellow-500' },
    { title: 'Gamificación', icon: FaGamepad, action: () => setActiveTab('gamification'), color: 'bg-indigo-500' },
    { title: 'Chat en Vivo', icon: FaComments, action: () => setShowChat(true), color: 'bg-teal-500' },
    { title: 'Configuración', icon: FaCog, action: () => setActiveTab('settings'), color: 'bg-gray-500' }
  ]);

  const [dashboardCards] = useState([
    { title: 'Ventas del Mes', value: '$45,600', change: '+12%', icon: FaDollarSign, color: 'from-green-400 to-green-600' },
    { title: 'Usuarios Activos', value: '1,250', change: '+8%', icon: FaUsers, color: 'from-blue-400 to-blue-600' },
    { title: 'Cursos Completados', value: '342', change: '+15%', icon: FaUserGraduate, color: 'from-purple-400 to-purple-600' },
    { title: 'Tasa de Conversión', value: '24.8%', change: '+3%', icon: FaChartPie, color: 'from-orange-400 to-orange-600' }
  ]);

  // Overview Tab con diseño mejorado
  const OverviewTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Cards con gradientes y efectos cristal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-2xl shadow-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`} />
            <div className="relative bg-white/10 backdrop-blur-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                  <p className="text-white/60 text-sm mt-2">
                    <span className="text-green-300">{card.change}</span> vs mes anterior
                  </p>
                </div>
                <card.icon className="text-white/30 text-5xl" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Gráficos y estadísticas con efectos 3D */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-blue-500" />
            Análisis de Rendimiento
          </h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
            <p className="text-gray-500">Gráfico de rendimiento aquí</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FaTrophy className="mr-2 text-yellow-500" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {i}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Usuario {i}</p>
                    <p className="text-sm text-gray-500">Nivel Experto</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{1000 - i * 100} pts</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Cards originales mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaUsers className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
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
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
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
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
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
            <span className="text-red-600 text-sm font-medium">-3%</span>
            <span className="text-gray-600 text-sm ml-2">vs mes anterior</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center`}
            >
              <action.icon className="text-2xl mb-2" />
              <span className="text-sm font-medium">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Users Management Tab
  const UsersTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <FaPlus className="mr-2" /> Agregar Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="px-4 py-2 border border-gray-300 rounded-lg w-64"
            />
            <div className="flex space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Filtrar
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <FaDownload className="mr-2" /> Exportar
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { id: 1, name: 'María González', email: 'maria@email.com', role: 'Cliente', status: 'Activo', date: '2024-01-15' },
              { id: 2, name: 'Carlos Ruiz', email: 'carlos@email.com', role: 'Cliente', status: 'Activo', date: '2024-01-14' },
              { id: 3, name: 'Ana López', email: 'ana@email.com', role: 'Admin', status: 'Activo', date: '2024-01-10' },
              { id: 4, name: 'Roberto Silva', email: 'roberto@email.com', role: 'Cliente', status: 'Inactivo', date: '2024-01-08' }
            ].map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <span className="ml-3 font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Products Management Tab
  const ProductsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Productos</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          <FaPlus className="mr-2" /> Nuevo Producto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, name: 'Consulta Legal Básica', price: 50, category: 'Consultas', status: 'Activo' },
          { id: 2, name: 'Patrocinio Legal Completo', price: 500, category: 'Servicios', status: 'Activo' },
          { id: 3, name: 'Certificado Digital', price: 25, category: 'Documentos', status: 'Activo' },
          { id: 4, name: 'Ebook Derecho Civil', price: 15, category: 'Ebooks', status: 'Activo' },
          { id: 5, name: 'Curso Online Penal', price: 100, category: 'Cursos', status: 'Activo' },
          { id: 6, name: 'Masterclass Legal', price: 200, category: 'Cursos', status: 'Inactivo' }
        ].map(product => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{product.category}</p>
            <p className="text-2xl font-bold text-green-600 mb-4">${product.price}</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <FaEdit className="mr-2" /> Editar
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 flex items-center justify-center">
                <FaTrash className="mr-2" /> Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Courses Management Tab
  const CoursesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Cursos</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center">
          <FaPlus className="mr-2" /> Nuevo Curso
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, title: 'Derecho Penal Básico', instructor: 'Dr. Wilson Ipiales', students: 45, price: 100, duration: '8 semanas' },
          { id: 2, title: 'Derecho Civil Avanzado', instructor: 'Dr. Wilson Ipiales', students: 32, price: 150, duration: '12 semanas' },
          { id: 3, title: 'Derecho Comercial', instructor: 'Dr. Wilson Ipiales', students: 28, price: 120, duration: '10 semanas' },
          { id: 4, title: 'Derecho de Tránsito', instructor: 'Dr. Wilson Ipiales', students: 56, price: 80, duration: '6 semanas' },
          { id: 5, title: 'Derecho Laboral', instructor: 'Dr. Wilson Ipiales', students: 38, price: 110, duration: '9 semanas' },
          { id: 6, title: 'Derecho de Familia', instructor: 'Dr. Wilson Ipiales', students: 42, price: 95, duration: '7 semanas' }
        ].map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">{course.students} estudiantes</span>
              <span className="text-sm text-gray-600">{course.duration}</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mb-4">${course.price}</p>
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <FaEdit className="mr-2" /> Editar
              </button>
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 flex items-center justify-center">
                <FaEye className="mr-2" /> Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Blog Management Tab
  const BlogTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión del Blog</h2>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center">
          <FaPlus className="mr-2" /> Nuevo Artículo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Autor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { id: 1, title: 'Nuevas Leyes de Tránsito 2024', category: 'Tránsito', author: 'Dr. Wilson', status: 'Publicado', date: '2024-01-15' },
              { id: 2, title: 'Guía Completa de Derecho Penal', category: 'Penal', author: 'Dr. Wilson', status: 'Borrador', date: '2024-01-14' },
              { id: 3, title: 'Cambios en el Código Civil', category: 'Civil', author: 'Dr. Wilson', status: 'Publicado', date: '2024-01-12' },
              { id: 4, title: 'Derechos Laborales Actualizados', category: 'Laboral', author: 'Dr. Wilson', status: 'Revisión', date: '2024-01-10' }
            ].map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{article.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    article.status === 'Publicado' ? 'bg-green-100 text-green-800' :
                    article.status === 'Borrador' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{article.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Appointments Management Tab
  const AppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Citas</h2>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center">
          <FaPlus className="mr-2" /> Nueva Cita
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[
              { id: 1, client: 'María González', date: '2024-01-20', time: '14:00', type: 'Consulta Inicial', status: 'Confirmada' },
              { id: 2, client: 'Carlos Ruiz', date: '2024-01-21', time: '10:30', type: 'Seguimiento', status: 'Pendiente' },
              { id: 3, client: 'Ana López', date: '2024-01-22', time: '16:00', type: 'Consulta Legal', status: 'Cancelada' },
              { id: 4, client: 'Roberto Silva', date: '2024-01-23', time: '11:00', type: 'Patrocinio', status: 'Confirmada' }
            ].map(appointment => (
              <tr key={appointment.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{appointment.client}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{appointment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{appointment.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{appointment.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'Confirmada' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <FaBell />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Settings Tab
  const SettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Configuración del Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Configuración General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Sitio</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" defaultValue="Abogado Wilson" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de Contacto</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md" defaultValue="contacto@abogadowilson.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" className="w-full p-2 border border-gray-300 rounded-md" defaultValue="+593 98 883 5269" />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Configuración de Pagos</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaPaypal className="text-blue-600 mr-2" />
                <span>PayPal</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCreditCard className="text-green-600 mr-2" />
                <span>Tarjetas de Crédito</span>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaBitcoin className="text-orange-600 mr-2" />
                <span>Criptomonedas</span>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Notificaciones</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">Notificaciones por correo</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-gray-600">Mensajes de WhatsApp</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-gray-600">Mensajes de texto</p>
              </div>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">Apariencia</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Claro</option>
                <option>Oscuro</option>
                <option>Automático</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Principal</label>
              <div className="flex space-x-2">
                <button className="w-8 h-8 bg-blue-600 rounded-full border-2 border-blue-800"></button>
                <button className="w-8 h-8 bg-green-600 rounded-full"></button>
                <button className="w-8 h-8 bg-purple-600 rounded-full"></button>
                <button className="w-8 h-8 bg-red-600 rounded-full"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          </div>
        </div>
      </div>
      
      {/* Estilos para los switches */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 24px;
        }
        
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
        }
        
        .slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
        }
        
        input:checked + .slider {
          background-color: #2563EB;
        }
        
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        
        .slider.round {
          border-radius: 24px;
        }
        
        .slider.round:before {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
