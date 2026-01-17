import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaUser, FaVideo, FaMapMarkerAlt,
  FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaPlus,
  FaChevronLeft, FaChevronRight, FaBell, FaEdit, FaTrash,
  FaPhone, FaEnvelope, FaWhatsapp, FaCalendarCheck
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AppointmentCalendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('consultation');
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    type: 'consultation',
    mode: 'presencial',
    description: '',
    duration: 60
  });

  const appointmentTypes = [
    { id: 'consultation', name: 'Consulta Legal', duration: 60, price: 150, color: 'blue' },
    { id: 'advisory', name: 'Asesoría Express', duration: 30, price: 75, color: 'green' },
    { id: 'mediation', name: 'Mediación', duration: 90, price: 200, color: 'purple' },
    { id: 'document', name: 'Revisión Documentos', duration: 45, price: 100, color: 'orange' },
    { id: 'representation', name: 'Representación Legal', duration: 120, price: 500, color: 'red' }
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00'
  ];

  // Citas de ejemplo
  useEffect(() => {
    const sampleAppointments = [
      {
        id: 1,
        date: new Date(2024, 0, 15, 10, 0),
        name: 'Juan Pérez',
        type: 'consultation',
        status: 'confirmed',
        mode: 'presencial'
      },
      {
        id: 2,
        date: new Date(2024, 0, 15, 14, 30),
        name: 'María García',
        type: 'advisory',
        status: 'pending',
        mode: 'virtual'
      },
      {
        id: 3,
        date: new Date(2024, 0, 16, 11, 0),
        name: 'Carlos López',
        type: 'mediation',
        status: 'confirmed',
        mode: 'presencial'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push({ date: prevMonthDay, isCurrentMonth: false });
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Días del mes siguiente
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const isTimeSlotAvailable = (date, time) => {
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(date);
    slotDate.setHours(parseInt(hours), parseInt(minutes));
    
    return !appointments.some(apt => {
      const aptTime = new Date(apt.date);
      return aptTime.getTime() === slotDate.getTime();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handleTimeSlotClick = (time) => {
    if (!selectedDate) return;
    
    const [hours, minutes] = time.split(':');
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    
    if (isTimeSlotAvailable(selectedDate, time)) {
      setSelectedTimeSlot(time);
      setShowModal(true);
    } else {
      toast.error('Este horario no está disponible');
    }
  };

  const handleBookAppointment = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Por favor complete todos los campos requeridos');
      return;
    }
    
    const newAppointment = {
      id: Date.now(),
      date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 
                     parseInt(selectedTimeSlot.split(':')[0]), parseInt(selectedTimeSlot.split(':')[1])),
      ...formData,
      status: 'pending'
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowModal(false);
    setSelectedTimeSlot(null);
    toast.success('¡Cita agendada exitosamente! Le enviaremos una confirmación por email.');
    
    // Resetear formulario
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      type: 'consultation',
      mode: 'presencial',
      description: '',
      duration: 60
    });
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-3 text-blue-600" />
            Calendario de Citas
          </h2>
          <p className="text-gray-600 mt-1">Agende su consulta legal</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Hoy
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 rounded-l-lg ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 rounded-r-lg ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Día
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => changeMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaChevronLeft />
        </button>
        
        <h3 className="text-xl font-semibold">
          {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </h3>
        
        <button
          onClick={() => changeMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar Grid */}
      {viewMode === 'month' && (
        <>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth(currentDate).map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day.date);
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString();
              
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => day.isCurrentMonth && handleDateClick(day.date)}
                  className={`
                    min-h-[80px] p-2 rounded-lg cursor-pointer transition-all
                    ${!day.isCurrentMonth ? 'text-gray-400 bg-gray-50' : 'bg-white hover:bg-blue-50'}
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    ${isSelected ? 'bg-blue-100' : ''}
                    ${day.date.getDay() === 0 || day.date.getDay() === 6 ? 'bg-gray-50' : ''}
                  `}
                >
                  <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                  {dayAppointments.length > 0 && (
                    <div className="space-y-1">
                      {dayAppointments.slice(0, 2).map(apt => (
                        <div
                          key={apt.id}
                          className={`text-xs px-1 py-0.5 rounded ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}
                        >
                          {new Date(apt.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayAppointments.length - 2} más</div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {/* Day View */}
      {viewMode === 'day' && selectedDate && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">
            {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h4>
          
          {/* Appointment Types */}
          <div className="mb-6">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Tipo de Cita</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {appointmentTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setAppointmentType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    appointmentType === type.id
                      ? `border-${type.color}-500 bg-${type.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">{type.name}</p>
                  <p className="text-xs text-gray-500">{type.duration} min - ${type.price}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Time Slots */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Horarios Disponibles</h5>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map(time => {
                const isAvailable = isTimeSlotAvailable(selectedDate, time);
                return (
                  <button
                    key={time}
                    onClick={() => handleTimeSlotClick(time)}
                    disabled={!isAvailable}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      isAvailable
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FaClock className="inline mr-1" />
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Existing Appointments */}
          {getAppointmentsForDate(selectedDate).length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Citas Agendadas</h5>
              <div className="space-y-2">
                {getAppointmentsForDate(selectedDate).map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FaUser className="text-gray-400" />
                      <div>
                        <p className="font-medium">{apt.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(apt.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {appointmentTypes.find(t => t.id === apt.type)?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmada' :
                         apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
                      </span>
                      {apt.mode === 'virtual' && <FaVideo className="text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Agendar Cita</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Modalidad</label>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setFormData({...formData, mode: 'presencial'})}
                      className={`flex-1 p-2 rounded-lg border ${
                        formData.mode === 'presencial' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <FaMapMarkerAlt className="inline mr-1" />
                      Presencial
                    </button>
                    <button
                      onClick={() => setFormData({...formData, mode: 'virtual'})}
                      className={`flex-1 p-2 rounded-lg border ${
                        formData.mode === 'virtual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <FaVideo className="inline mr-1" />
                      Virtual
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describa brevemente su consulta..."
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Resumen de Cita</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                    {' a las '}{selectedTimeSlot}
                  </p>
                  <p className="text-sm text-blue-600">
                    {appointmentTypes.find(t => t.id === appointmentType)?.name}
                    {' - '}
                    {appointmentTypes.find(t => t.id === appointmentType)?.duration} minutos
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Confirmar Cita
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentCalendar;
