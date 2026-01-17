import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaShoppingBag, FaCalendarAlt, FaFileAlt, FaChartLine, FaSignOutAlt, FaPlay, FaDownload, FaClock, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import clientService from '../../services/clientService';

const EnhancedClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    
    // Cargar cursos inscritos
    const coursesResult = await clientService.courses.getEnrolled(user.id);
    if (coursesResult.success) {
      setEnrolledCourses(coursesResult.data);
    }

    // Cargar productos comprados
    const productsResult = await clientService.products.getPurchased(user.id);
    if (productsResult.success) {
      setPurchasedProducts(productsResult.data);
    }

    // Cargar citas
    const appointmentsResult = await clientService.appointments.getAll(user.id);
    if (appointmentsResult.success) {
      setAppointments(appointmentsResult.data);
    }

    // Cargar órdenes
    const ordersResult = await clientService.purchases.getOrders(user.id);
    if (ordersResult.success) {
      setOrders(ordersResult.data);
    }

    setLoading(false);
  };

  const handleContinueCourse = (courseId) => {
    navigate(`/dashboard/course/${courseId}`);
  };

  const handleDownloadProduct = async (product) => {
    // Registrar acceso
    await clientService.products.recordAccess(user.id, product.product_id);
    
    if (product.product?.file_url) {
      window.open(product.product.file_url, '_blank');
      toast.success('Descargando producto...');
    } else {
      toast.error('URL de descarga no disponible');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: FaChartLine },
    { id: 'courses', label: 'Mis Cursos', icon: FaBook },
    { id: 'products', label: 'Mis Productos', icon: FaShoppingBag },
    { id: 'appointments', label: 'Citas', icon: FaCalendarAlt },
    { id: 'orders', label: 'Historial', icon: FaFileAlt }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-40">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Mi Dashboard</h2>
          <p className="text-sm text-gray-600 mb-6">Bienvenido, {user?.full_name || user?.email}</p>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <item.icon className="mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <button 
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Resumen de tu Cuenta</h1>
              
              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <FaBook className="text-3xl mb-2" />
                  <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                  <p className="text-blue-100">Cursos Activos</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <FaShoppingBag className="text-3xl mb-2" />
                  <p className="text-2xl font-bold">{purchasedProducts.length}</p>
                  <p className="text-green-100">Productos Comprados</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <FaCalendarAlt className="text-3xl mb-2" />
                  <p className="text-2xl font-bold">{appointments.length}</p>
                  <p className="text-purple-100">Citas Programadas</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white"
                >
                  <FaFileAlt className="text-3xl mb-2" />
                  <p className="text-2xl font-bold">{orders.length}</p>
                  <p className="text-orange-100">Órdenes Totales</p>
                </motion.div>
              </div>

              {/* Cursos recientes */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Continúa Aprendiendo</h2>
                {enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrolledCourses.slice(0, 2).map((enrollment) => (
                      <div key={enrollment.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-800 mb-2">{enrollment.course?.title}</h3>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleContinueCourse(enrollment.course_id)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                        >
                          <FaPlay className="mr-2" /> Continuar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No tienes cursos inscritos aún.</p>
                )}
              </div>
            </div>
          )}

          {/* Mis Cursos */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Mis Cursos</h1>
              
              {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((enrollment) => (
                    <motion.div
                      key={enrollment.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      {enrollment.course?.thumbnail && (
                        <img 
                          src={enrollment.course.thumbnail} 
                          alt={enrollment.course.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {enrollment.course?.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {enrollment.course?.short_description}
                        </p>
                        
                        {/* Progreso */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progreso</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Estado */}
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            enrollment.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {enrollment.status === 'completed' ? 'Completado' : 'En Progreso'}
                          </span>
                          {enrollment.status === 'completed' && (
                            <FaCheckCircle className="text-green-500" />
                          )}
                        </div>

                        <button
                          onClick={() => handleContinueCourse(enrollment.course_id)}
                          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                        >
                          <FaPlay className="mr-2" />
                          {enrollment.progress === 0 ? 'Comenzar' : 'Continuar'}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <FaBook className="text-6xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">No tienes cursos inscritos</p>
                  <Link
                    to="/cursos"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Explorar Cursos
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mis Productos */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Mis Productos</h1>
              
              {purchasedProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedProducts.map((userProduct) => (
                    <motion.div
                      key={userProduct.id}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                      {userProduct.product?.thumbnail && (
                        <img 
                          src={userProduct.product.thumbnail} 
                          alt={userProduct.product.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {userProduct.product?.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {userProduct.product?.short_description}
                        </p>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          <p>Descargas: {userProduct.download_count || 0}</p>
                          <p>Comprado: {new Date(userProduct.purchased_at).toLocaleDateString()}</p>
                        </div>

                        <button
                          onClick={() => handleDownloadProduct(userProduct)}
                          className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                        >
                          <FaDownload className="mr-2" />
                          Descargar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <FaShoppingBag className="text-6xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">No has comprado productos aún</p>
                  <Link
                    to="/tienda"
                    className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    Ir a la Tienda
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Citas */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Mis Citas</h1>
                <Link
                  to="/agendar-cita"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Agendar Nueva Cita
                </Link>
              </div>
              
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="bg-white rounded-lg shadow-lg p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{appointment.title}</h3>
                          <p className="text-gray-600 mt-1">{appointment.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center">
                              <FaClock className="mr-2" />
                              {new Date(appointment.start_time).toLocaleString()}
                            </span>
                            <span>Tipo: {appointment.type}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <FaCalendarAlt className="text-6xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-600 mb-4">No tienes citas programadas</p>
                  <Link
                    to="/agendar-cita"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Agendar Cita
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Historial */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Historial de Compras</h1>
              
              {orders.length > 0 ? (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${order.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                  <FaFileAlt className="text-6xl text-gray-300 mb-4 mx-auto" />
                  <p className="text-gray-600">No tienes compras registradas</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedClientDashboard;
