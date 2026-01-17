import React from 'react';
import { 
  CalendarIcon, 
  BookOpenIcon, 
  ShoppingCartIcon, 
  DownloadIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const userData = {
    name: 'María González',
    credits: 150,
    membership: 'Premium'
  };

  const myCourses = [
    {
      id: 1,
      name: 'Derecho Civil Completo',
      progress: 75,
      lastLesson: 'Contratos Civiles - Lección 8'
    },
    {
      id: 2,
      name: 'Derecho Penal Avanzado',
      progress: 45,
      lastLesson: 'Teoría del Delito - Lección 5'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bienvenido, {userData.name} 👋</h1>
            <p className="text-blue-100 mt-2">Tu portal legal personal</p>
          </div>
          <div className="text-right">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <p className="text-sm text-blue-100">Créditos Disponibles</p>
              <p className="text-2xl font-bold">{userData.credits}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <BookOpenIcon className="w-6 h-6 mr-2 text-blue-600" />
            Mis Cursos
          </h2>
          <Link to="/courses" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Ver Todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCourses.map((course) => (
            <div key={course.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{course.name}</h3>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">{course.lastLesson}</p>
              <Link to={`/course-detail/${course.id}`} className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                Continuar →
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/calendar/new" className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
            <CalendarIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Nueva Cita</span>
          </Link>
          <Link to="/courses" className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
            <BookOpenIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Explorar Cursos</span>
          </Link>
          <Link to="/products" className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
            <ShoppingCartIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Tienda</span>
          </Link>
          <Link to="/profile" className="text-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
            <UserIcon className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Mi Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
