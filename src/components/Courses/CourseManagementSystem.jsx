import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaPlus, FaEdit, FaTrash, FaEye, FaDownload, FaUpload,
  FaGraduationCap, FaCertificate, FaUsers, FaClock, FaStar,
  FaPlay, FaPause, FaStop, FaCheck, FaTimes, FaExclamationTriangle,
  FaLightbulb, FaRocket, FaTrophy, FaAward, FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CourseManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Fundamentos del Derecho Civil',
      description: 'Curso completo sobre los principios básicos del derecho civil ecuatoriano',
      category: 'Derecho Civil',
      level: 'Principiante',
      duration: '8 semanas',
      price: 99,
      students: 45,
      rating: 4.8,
      status: 'active',
      instructor: 'Dr. Wilson',
      modules: 12,
      lessons: 48,
      certificates: true,
      language: 'Español',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400'
    },
    {
      id: 2,
      title: 'Derecho Penal Avanzado',
      description: 'Especialización en derecho penal y procedimientos penales',
      category: 'Derecho Penal',
      level: 'Avanzado',
      duration: '12 semanas',
      price: 149,
      students: 32,
      rating: 4.9,
      status: 'active',
      instructor: 'Dr. Wilson',
      modules: 16,
      lessons: 64,
      certificates: true,
      language: 'Español',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400'
    },
    {
      id: 3,
      title: 'Derecho Comercial y Empresarial',
      description: 'Todo sobre derecho comercial, contratos y constitución de empresas',
      category: 'Derecho Comercial',
      level: 'Intermedio',
      duration: '10 semanas',
      price: 129,
      students: 28,
      rating: 4.7,
      status: 'draft',
      instructor: 'Dr. Wilson',
      modules: 14,
      lessons: 56,
      certificates: true,
      language: 'Español',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400'
    }
  ]);

  const [categories, setCategories] = useState([
    'Derecho Civil', 'Derecho Penal', 'Derecho Comercial', 'Derecho de Familia',
    'Derecho Laboral', 'Derecho Administrativo', 'Derecho Constitucional'
  ]);

  const [levels, setLevels] = useState(['Principiante', 'Intermedio', 'Avanzado', 'Experto']);
  const [statuses, setStatuses] = useState(['active', 'draft', 'archived', 'published']);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100">Total Cursos</p>
              <p className="text-3xl font-bold">{courses.length}</p>
            </div>
            <div className="p-3 bg-blue-400 rounded-full">
              <FaBook className="text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-100 text-sm font-medium">+3</span>
            <span className="text-blue-200 text-sm ml-2">este mes</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-100">Estudiantes</p>
              <p className="text-3xl font-bold">{courses.reduce((acc, course) => acc + course.students, 0)}</p>
            </div>
            <div className="p-3 bg-green-400 rounded-full">
              <FaUsers className="text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-100 text-sm font-medium">+15%</span>
            <span className="text-green-200 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-100">Ingresos</p>
              <p className="text-3xl font-bold">${courses.reduce((acc, course) => acc + (course.price * course.students), 0).toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-400 rounded-full">
              <FaChartLine className="text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-purple-100 text-sm font-medium">+22%</span>
            <span className="text-purple-200 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-100">Rating Promedio</p>
              <p className="text-3xl font-bold">{(courses.reduce((acc, course) => acc + course.rating, 0) / courses.length).toFixed(1)}</p>
            </div>
            <div className="p-3 bg-orange-400 rounded-full">
              <FaStar className="text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-100 text-sm font-medium">+0.2</span>
            <span className="text-orange-200 text-sm ml-2">vs mes anterior</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <FaPlus className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Crear Nuevo Curso</h3>
          <p className="text-sm text-gray-600">Agregar un nuevo curso al catálogo</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
        >
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
            <FaUpload className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Importar Cursos</h3>
          <p className="text-sm text-gray-600">Importar cursos desde archivos externos</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
            <FaCertificate className="text-white text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestionar Certificados</h3>
          <p className="text-sm text-gray-600">Configurar y emitir certificados</p>
        </motion.div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Cursos Recientes</h3>
          <button 
            onClick={() => setActiveTab('courses')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todos →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' ? 'bg-green-100 text-green-800' :
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Activo' : 
                     course.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 text-white">
                  <FaGraduationCap className="text-2xl" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-600 font-medium">${course.price}</span>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{course.students} estudiantes</span>
                  <span>{course.duration}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Courses Tab
  const CoursesTab = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Gestión de Cursos</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>Nuevo Curso</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los niveles</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Todos los estados</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Buscar cursos..."
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative">
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'active' ? 'bg-green-100 text-green-800' :
                    course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status === 'active' ? 'Activo' : 
                     course.status === 'draft' ? 'Borrador' : 'Archivado'}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 text-white">
                  <FaGraduationCap className="text-2xl" />
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-600 font-medium">${course.price}</span>
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{course.students} estudiantes</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <button className="text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-50 rounded">
                    <FaEye />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
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
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
                <p className="text-sm text-gray-600">Sistema completo de administración de cursos legales</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                <FaDownload className="inline mr-2" />
                Exportar
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
              { id: 'courses', name: 'Cursos', icon: FaBook },
              { id: 'students', name: 'Estudiantes', icon: FaUsers },
              { id: 'analytics', name: 'Analíticas', icon: FaChartBar },
              { id: 'certificates', name: 'Certificados', icon: FaCertificate }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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
          {activeTab === 'courses' && <CoursesTab key="courses" />}
          {activeTab === 'students' && <div key="students" className="text-center py-12 text-gray-500">Gestión de Estudiantes - En desarrollo</div>}
          {activeTab === 'analytics' && <div key="analytics" className="text-center py-12 text-gray-500">Analíticas - En desarrollo</div>}
          {activeTab === 'certificates' && <div key="certificates" className="text-center py-12 text-gray-500">Certificados - En desarrollo</div>}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseManagementSystem;
