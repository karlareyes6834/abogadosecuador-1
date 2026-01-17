import React from 'react';
import { UsersIcon, CurrencyDollarIcon, DocumentTextIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DashboardMain = () => {
  const stats = [
    { name: 'Clientes Activos', value: '1,234', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Ingresos del Mes', value: '$45,678', icon: CurrencyDollarIcon, color: 'bg-green-500' },
    { name: 'Casos Activos', value: '89', icon: DocumentTextIcon, color: 'bg-purple-500' },
    { name: 'Citas Programadas', value: '23', icon: CalendarIcon, color: 'bg-orange-500' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Bienvenido de vuelta, Dr. Wilson</p>
        </div>
        <Link to="/calendar/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nueva Consulta
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMain;
