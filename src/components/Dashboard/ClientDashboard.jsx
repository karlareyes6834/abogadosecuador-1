import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaFileAlt, FaCreditCard, FaUser, FaBell, FaSignOutAlt, FaArrowRight, FaChartBar, FaShoppingCart, FaGraduationCap } from 'react-icons/fa';
import { dataService } from '../../services/supabaseService';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('inicio');
  const [userData, setUserData] = useState({
    nombre: 'Usuario',
    apellido: 'Ejemplo',
    creditos: 0,
    consultas: [],
    citas: [],
    compras: [],
    cursos: []
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConsultas: 0,
    totalCursos: 0,
    totalCompras: 0,
    totalCitas: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        
        // Obtener perfil del usuario
        const { data: profile } = await dataService.getById('profiles', user.id);
        
        // Obtener consultas del usuario
        const { data: consultations } = await dataService.query(
          'consultations',
          (query) => query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        );
        
        // Obtener citas del usuario
        const { data: appointments } = await dataService.query(
          'appointments',
          (query) => query.eq('user_id', user.id).gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(10)
        );
        
        // Obtener compras del usuario
        const { data: purchases } = await dataService.query(
          'purchases',
          (query) => query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        );
        
        // Obtener cursos inscritos
        const { data: enrollments } = await dataService.query(
          'course_enrollments',
          (query) => query.eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
        );
        
        // Formatear datos del usuario
        const fullName = profile?.full_name || user.email || 'Usuario';
        const nameParts = fullName.split(' ');
        
        setUserData({
          nombre: nameParts[0] || 'Usuario',
          apellido: nameParts.slice(1).join(' ') || '',
          creditos: profile?.credits || 0,
          consultas: (consultations || []).map(c => ({
            id: c.id,
            fecha: c.created_at,
            tipo: c.subject || c.type,
            estado: c.status === 'completed' ? 'Completada' : 'Pendiente'
          })),
          citas: (appointments || []).map(a => ({
            id: a.id,
            fecha: a.start_time,
            tipo: a.title,
            abogado: 'Wilson Ipiales',
            status: a.status
          })),
          compras: (purchases || []).map(p => ({
            id: p.id,
            producto: p.product_name,
            fecha: p.created_at,
            estado: p.status === 'active' ? 'Completado' : p.status,
            amount: p.amount
          })),
          cursos: (enrollments || []).map(e => ({
            id: e.id,
            titulo: e.course_id,
            progreso: e.progress || 0,
            completado: e.status === 'completed'
          }))
        });
        
        setStats({
          totalConsultas: consultations?.length || 0,
          totalCursos: enrollments?.length || 0,
          totalCompras: purchases?.length || 0,
          totalCitas: appointments?.length || 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Error al cargar la información del usuario');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  // Función para reprogramar cita
  const handleRescheduleAppointment = async (appointmentId) => {
    try {
      // Redirigir a página de calendario con el ID de la cita
      navigate(`/calendario?reschedule=${appointmentId}`);
      toast.info('Seleccione una nueva fecha para su cita');
    } catch (error) {
      console.error('Error al reprogramar cita:', error);
      toast.error('Error al reprogramar la cita');
    }
  };

  // Función para cancelar cita
  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('¿Está seguro de que desea cancelar esta cita?')) {
      return;
    }

    try {
      const { error } = await dataService.update('appointments', appointmentId, {
        status: 'cancelled'
      });

      if (error) throw error;

      toast.success('Cita cancelada exitosamente');
      
      // Actualizar la lista de citas
      setUserData(prev => ({
        ...prev,
        citas: prev.citas.filter(c => c.id !== appointmentId)
      }));
      
      setStats(prev => ({
        ...prev,
        totalCitas: prev.totalCitas - 1
      }));
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error('Error al cancelar la cita');
    }
  };

  // Función para actualizar perfil
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await dataService.update('profiles', user.id, {
        full_name: `${userData.nombre} ${userData.apellido}`.trim()
      });

      if (error) throw error;

      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  // Componente para la sección de inicio
  const InicioTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bienvenido, {userData.nombre}</h2>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Consultas Realizadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultas}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaFileAlt className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cursos Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCursos}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaGraduationCap className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compras Realizadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCompras}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaShoppingCart className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citas Programadas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCitas}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FaCalendarAlt className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Créditos Disponibles</h3>
            <span className="text-3xl font-bold text-blue-600">{userData.creditos}</span>
          </div>
          <p className="text-gray-600 mt-2">Utilice sus créditos para consultas y servicios</p>
          <Link to="/comprar-creditos" className="mt-4 text-blue-600 flex items-center hover:underline">
            Comprar más créditos <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Próxima Cita</h3>
          </div>
          {userData.citas.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">
                {new Date(userData.citas[0].fecha).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <p className="text-gray-600">{userData.citas[0].tipo}</p>
              <Link to="/calendario" className="mt-2 text-blue-600 flex items-center hover:underline">
                Ver agenda completa <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-600">No tiene citas programadas</p>
              <Link to="/calendario" className="mt-2 text-blue-600 flex items-center hover:underline">
                Agendar una cita <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Consultas Recientes</h3>
          </div>
          {userData.consultas.length > 0 ? (
            <div className="mt-2">
              <p className="font-medium">{userData.consultas[0].tipo}</p>
              <p className="text-gray-600">Estado: {userData.consultas[0].estado}</p>
              <Link to="/consultas" className="mt-2 text-blue-600 flex items-center hover:underline">
                Ver todas las consultas <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-gray-600">No tiene consultas recientes</p>
              <Link to="/servicios" className="mt-2 text-blue-600 flex items-center hover:underline">
                Solicitar una consulta <FaArrowRight className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Servicios Recomendados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Consulta Legal', description: 'Obtenga asesoría legal personalizada para su caso', url: '/servicios/consulta' },
            { title: 'Patrocinio Legal', description: 'Representación completa en su caso desde $500', url: '/servicios/patrocinio' },
            { title: 'Certificados Digitales', description: 'Genere certificados legales mediante IA', url: '/servicios/certificados' }
          ].map((servicio, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-bold mb-2">{servicio.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{servicio.description}</p>
              <Link to={servicio.url} className="text-blue-600 text-sm flex items-center hover:underline">
                Saber más <FaArrowRight className="ml-1 text-xs" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Componente para la sección de citas
  const CitasTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Citas</h2>
        <Link to="/calendario" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaCalendarAlt className="mr-2" /> Agendar Nueva Cita
        </Link>
      </div>
      
      {userData.citas.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abogado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.citas.map(cita => (
                <tr key={cita.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(cita.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{cita.abogado}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleRescheduleAppointment(cita.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Reprogramar
                    </button>
                    <button 
                      onClick={() => handleCancelAppointment(cita.id)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Cancelar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tiene citas programadas</p>
          <Link to="/calendario" className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors">
            <FaCalendarAlt className="mr-2" /> Agendar Ahora
          </Link>
        </div>
      )}
    </div>
  );

  // Componente para la sección de consultas
  const ConsultasTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mis Consultas</h2>
        <Link to="/servicios" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <FaFileAlt className="mr-2" /> Nueva Consulta
        </Link>
      </div>
      
      {userData.consultas.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.consultas.map(consulta => (
                <tr key={consulta.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(consulta.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{consulta.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      consulta.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {consulta.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800">Ver detalles</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">No tiene consultas realizadas</p>
          <Link to="/servicios" className="bg-blue-600 text-white px-6 py-2 rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors">
            <FaFileAlt className="mr-2" /> Solicitar Consulta
          </Link>
        </div>
      )}
    </div>
  );

  // Componente para la sección de perfil
  const PerfilTab = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Información Personal</h3>
        
        <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={userData.nombre}
              onChange={(e) => setUserData({...userData, nombre: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={userData.apellido}
              onChange={(e) => setUserData({...userData, apellido: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input 
              type="email" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              value={user?.email || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input 
              type="tel" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="+593 XXXXXXXXX"
            />
          </div>
          
          <div className="col-span-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Actualizar Información
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="font-bold text-lg mb-4">Cambiar Contraseña</h3>
        
        <form className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              className="w-full p-2 border border-gray-300 rounded-md" 
              placeholder="••••••••"
            />
          </div>
          
          <div className="mt-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Cambiar Contraseña
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="font-bold text-lg mb-4">Notificaciones</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Actualizaciones por correo</p>
              <p className="text-sm text-gray-600">Recibir novedades sobre servicios y promociones</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Recordatorios de citas</p>
              <p className="text-sm text-gray-600">Recibir notificaciones sobre citas próximas</p>
            </div>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Alertas de SMS</p>
              <p className="text-sm text-gray-600">Recibir notificaciones importantes por SMS</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="mb-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUser className="text-blue-600 text-4xl" />
                </div>
                <h3 className="font-bold text-lg">{userData.nombre} {userData.apellido}</h3>
              </div>
              
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('inicio')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'inicio' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3" /> Inicio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('citas')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'citas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaCalendarAlt className="mr-3" /> Mis Citas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('consultas')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'consultas' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaFileAlt className="mr-3" /> Mis Consultas
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('perfil')} 
                    className={`w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center ${
                      activeTab === 'perfil' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FaUser className="mr-3" /> Mi Perfil
                  </button>
                </li>
                <li>
                  <Link to="/logout" className="w-full text-left py-2 px-4 rounded-lg transition-colors flex items-center text-red-600 hover:bg-red-50">
                    <FaSignOutAlt className="mr-3" /> Cerrar Sesión
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-600 text-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-lg mb-3">¿Necesita ayuda?</h3>
              <p className="text-blue-100 mb-4">Nuestro equipo está disponible para asistirle con cualquier duda o problema.</p>
              <a 
                href="tel:+593988835269" 
                className="bg-white text-blue-600 hover:bg-blue-50 block text-center py-2 rounded-lg font-bold transition-colors"
              >
                Contáctenos
              </a>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="md:col-span-3">
            {activeTab === 'inicio' && <InicioTab />}
            {activeTab === 'citas' && <CitasTab />}
            {activeTab === 'consultas' && <ConsultasTab />}
            {activeTab === 'perfil' && <PerfilTab />}
          </div>
        </div>
      </div>
      
      {/* Estilos adicionales para los botones de toggle */}
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

export default ClientDashboard;
