import React, { useState } from 'react';
import { PlusIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const CalendarDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const appointments = [
    {
      id: 1,
      client: 'María González',
      service: 'Consulta Civil',
      date: '2024-01-15',
      time: '10:00',
      duration: '1 hora',
      status: 'confirmada'
    },
    {
      id: 2,
      client: 'Carlos Rodríguez',
      service: 'Consulta Penal',
      date: '2024-01-15',
      time: '14:00',
      duration: '1.5 horas',
      status: 'pendiente'
    },
    {
      id: 3,
      client: 'Ana Martínez',
      service: 'Consulta de Tránsito',
      date: '2024-01-16',
      time: '09:00',
      duration: '45 minutos',
      status: 'confirmada'
    }
  ];

  const todayAppointments = appointments.filter(apt => 
    apt.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Citas</h1>
          <p className="text-gray-600">Gestiona tus consultas y citas programadas</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Cita
        </button>
      </div>

      {/* Calendario simple */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24*60*60*1000))}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Anterior
            </button>
            <button 
              onClick={() => setSelectedDate(new Date())}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Hoy
            </button>
            <button 
              onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24*60*60*1000))}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
            date.setDate(date.getDate() + i - date.getDay());
            const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasAppointments = appointments.some(apt => apt.date === date.toISOString().split('T')[0]);
            
            return (
              <div
                key={i}
                className={`p-2 text-center border border-gray-200 min-h-[60px] ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'bg-blue-100 border-blue-300' : ''}`}
              >
                <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {date.getDate()}
                </div>
                {hasAppointments && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Citas del día */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Citas para {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((appointment) => (
              <div key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.client}</p>
                      <p className="text-sm text-gray-500">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{appointment.time}</span>
                      <span className="text-sm text-gray-500">({appointment.duration})</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay citas programadas para este día</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDashboard;
