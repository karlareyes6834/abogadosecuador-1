import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, 
  FaCheck, FaTimes, FaEye, FaTrash, FaFilter, FaSearch
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { dataService } from '../../services/supabaseService';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await dataService.getAll('appointments');
      
      if (error) {
        console.error('Error al cargar citas:', error);
        toast.error('Error al cargar las citas');
        return;
      }

      // Ordenar por fecha más reciente
      const sortedAppointments = (data || []).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      setAppointments(sortedAppointments);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      const { error } = await dataService.update('appointments', id, {
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      if (error) {
        throw error;
      }

      toast.success('Estado actualizado correctamente');
      loadAppointments();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta cita?')) {
      return;
    }

    try {
      const { error } = await dataService.delete('appointments', id);

      if (error) {
        throw error;
      }

      toast.success('Cita eliminada correctamente');
      loadAppointments();
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Programada' },
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' }
    };

    const badge = badges[status] || badges.scheduled;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(appointment => {
    // Filtro por estado
    if (filter !== 'all' && appointment.status !== filter) {
      return false;
    }

    // Filtro por búsqueda
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        appointment.name?.toLowerCase().includes(search) ||
        appointment.email?.toLowerCase().includes(search) ||
        appointment.phone?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-4">
          <FaCalendarAlt className="mr-3 text-blue-600" />
          Gestión de Citas
        </h2>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600">Programadas</p>
            <p className="text-2xl font-bold text-blue-800">{stats.scheduled}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600">Confirmadas</p>
            <p className="text-2xl font-bold text-green-800">{stats.confirmed}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Completadas</p>
            <p className="text-2xl font-bold text-gray-800">{stats.completed}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600">Canceladas</p>
            <p className="text-2xl font-bold text-red-800">{stats.cancelled}</p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg ${filter === 'scheduled' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Programadas
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg ${filter === 'confirmed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Confirmadas
            </button>
          </div>
        </div>
      </div>

      {/* Lista de citas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha & Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No se encontraron citas
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <FaEnvelope className="text-xs" /> {appointment.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <FaPhone className="text-xs" /> {appointment.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <FaClock className="text-xs" /> {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {appointment.service === 'consulta-general' && 'Consulta General'}
                      {appointment.service === 'derecho-civil' && 'Derecho Civil'}
                      {appointment.service === 'derecho-penal' && 'Derecho Penal'}
                      {appointment.service === 'derecho-transito' && 'Derecho de Tránsito'}
                      {appointment.service === 'derecho-laboral' && 'Derecho Laboral'}
                      {appointment.service === 'derecho-aduanero' && 'Derecho Aduanero'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(appointment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <FaEye />
                      </button>
                      {appointment.status === 'scheduled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                          className="text-green-600 hover:text-green-900"
                          title="Confirmar"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                          className="text-gray-600 hover:text-gray-900"
                          title="Marcar como completada"
                        >
                          <FaCheck />
                        </button>
                      )}
                      {appointment.status !== 'cancelled' && (
                        <button
                          onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                          title="Cancelar"
                        >
                          <FaTimes />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalles */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  Detalles de la Cita
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Cliente</label>
                    <p className="mt-1 text-gray-900">{selectedAppointment.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Estado</label>
                    <p className="mt-1">{getStatusBadge(selectedAppointment.status)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-gray-900">{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                    <p className="mt-1 text-gray-900">{selectedAppointment.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Fecha</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedAppointment.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Hora</label>
                    <p className="mt-1 text-gray-900">{selectedAppointment.time}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Servicio</label>
                    <p className="mt-1 text-gray-900">
                      {selectedAppointment.service === 'consulta-general' && 'Consulta General'}
                      {selectedAppointment.service === 'derecho-civil' && 'Derecho Civil'}
                      {selectedAppointment.service === 'derecho-penal' && 'Derecho Penal'}
                      {selectedAppointment.service === 'derecho-transito' && 'Derecho de Tránsito'}
                      {selectedAppointment.service === 'derecho-laboral' && 'Derecho Laboral'}
                      {selectedAppointment.service === 'derecho-aduanero' && 'Derecho Aduanero'}
                    </p>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-600">Notas</label>
                      <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Cambiar Estado</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'confirmed');
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'completed');
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Completada
                    </button>
                    <button
                      onClick={() => {
                        updateAppointmentStatus(selectedAppointment.id, 'cancelled');
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
