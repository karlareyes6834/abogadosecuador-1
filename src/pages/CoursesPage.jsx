import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBook, FaBookReader, FaGraduationCap, FaPlay, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

import { useCart } from '../context/CartContext';
import { dataService } from '../services/supabaseService';
import ImageWithFallback from '../components/Common/ImageWithFallback';

// Datos de ejemplo para los cursos
const SAMPLE_COURSES = [
  {
    id: 'curso-derecho-penal-1',
    title: 'Fundamentos de Derecho Penal',
    description: 'Aprende los principios básicos del Derecho Penal ecuatoriano. Este curso cubre los conceptos esenciales, legislación actual y análisis de casos prácticos.',
    imageUrl: '/images/courses/derecho-penal.jpg',
    price: 49.99,
    category: 'Derecho Penal',
    duration: '10 horas',
    lessons: 15,
    level: 'Principiante',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: true
  },
  {
    id: 'curso-derecho-civil-1',
    title: 'Contratos y Obligaciones',
    description: 'Curso especializado en la redacción, análisis e interpretación de contratos civiles y mercantiles. Incluye plantillas y casos de estudio reales.',
    imageUrl: '/images/courses/contratos.jpg',
    price: 59.99,
    category: 'Derecho Civil',
    duration: '12 horas',
    lessons: 18,
    level: 'Intermedio',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: true
  },
  {
    id: 'masterclass-litigacion-1',
    title: 'Masterclass: Técnicas de Litigación Oral',
    description: 'Aprende técnicas avanzadas de litigación oral para destacar en audiencias y juicios. Incluye ejercicios prácticos y simulaciones.',
    imageUrl: '/images/courses/litigacion.jpg',
    price: 79.99,
    category: 'Litigación',
    duration: '8 horas',
    lessons: 10,
    level: 'Avanzado',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: false
  },
  {
    id: 'curso-derecho-laboral-1',
    title: 'Derecho Laboral Práctico',
    description: 'Todo lo que necesitas saber sobre relaciones laborales, contratos de trabajo, indemnizaciones y procesos administrativos laborales.',
    imageUrl: '/images/courses/laboral.jpg',
    price: 49.99,
    category: 'Derecho Laboral',
    duration: '9 horas',
    lessons: 14,
    level: 'Intermedio',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: false
  },
  {
    id: 'curso-transito-1',
    title: 'Infracciones de Tránsito y Defensa',
    description: 'Guía completa sobre infracciones de tránsito, procedimientos administrativos y defensa legal en casos de accidentes.',
    imageUrl: '/images/courses/transito.jpg',
    price: 39.99,
    category: 'Derecho de Tránsito',
    duration: '7 horas',
    lessons: 12,
    level: 'Principiante',
    instructor: 'Abg. Wilson Ipiales',
    featured: false,
    popular: true
  },
  {
    id: 'masterclass-aduanero-1',
    title: 'Masterclass: Derecho Aduanero',
    description: 'Todo sobre procedimientos aduaneros, importaciones, exportaciones y resolución de conflictos en comercio internacional.',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    price: 89.99,
    category: 'Derecho Aduanero',
    duration: '14 horas',
    lessons: 20,
    level: 'Avanzado',
    instructor: 'Abg. Wilson Ipiales',
    featured: true,
    popular: false
  }
];

const CourseCard = ({ course, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full group"
      whileHover={{ y: -8, boxShadow: '0 20px 40px -5px rgba(0, 0, 0, 0.15)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="w-full h-56 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>
        )}
        
        <ImageWithFallback
          src={course.imageUrl}
          alt={course.title}
          fallbackType="course"
          className={`w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {course.featured && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
            >
              ⭐ Destacado
            </motion.div>
          )}
          {course.popular && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
            >
              🔥 Popular
            </motion.div>
          )}
        </div>
        
        {/* Level badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {course.level}
          </span>
        </div>
        
        {/* Hover overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/80 to-black/40 flex flex-col items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Link 
            to={`/cursos/${course.id}`}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
          >
            <FaPlay className="text-sm" />
            Ver Detalles
          </Link>
          <p className="text-white text-sm mt-3 px-4 text-center opacity-90">
            {course.instructor}
          </p>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <span className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
            {course.category}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {course.description}
        </p>
        
        <div className="flex items-center text-gray-500 text-sm mb-4 gap-4">
          <div className="flex items-center gap-1">
            <FaGraduationCap className="text-blue-600" />
            <span>{course.lessons} lecciones</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBookReader className="text-blue-600" />
            <span>{course.duration}</span>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-4 mt-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Precio</p>
              <span className="text-3xl text-blue-600 font-bold">${course.price.toFixed(2)}</span>
            </div>
            <button
              onClick={() => handleAddToCart(course)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaShoppingCart className="text-base" /> 
              <span>Comprar</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // En una aplicación real, obtendríamos los cursos desde Supabase
        // const { data, error } = await dataService.getAll('courses');
        // if (error) throw error;
        // setCourses(data);
        
        // Por ahora, usamos datos de muestra
        setTimeout(() => {
          setCourses(SAMPLE_COURSES);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error al obtener cursos:', error);
        toast.error('Error al cargar los cursos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleAddToCart = (course) => {
    const cartItem = {
      id: course.id,
      name: course.title,
      price: course.price,
      category: 'Curso',
      imageUrl: course.imageUrl,
      quantity: 1,
      type: 'course'
    };
    addToCart(cartItem);
    toast.success(`${course.title} agregado al carrito`);
  };
  
  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'featured' && course.featured) ||
                         (filter === 'popular' && course.popular) ||
                         filter === course.category;
    
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });
  
  // Obtener categorías únicas para el filtro
  const categories = [...new Set(courses.map(course => course.category))];
  
  return (
    <>
      <Helmet>
        <title>Cursos | Abg. Wilson Ipiales</title>
        <meta name="description" content="Cursos y masterclass de derecho. Aprende conceptos legales de manera práctica y efectiva." />
      </Helmet>
      
      <main className="bg-gradient-to-b from-gray-50 to-white py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                <FaBook className="inline mr-2" />
                Educación Legal Online
              </div>
              <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                Cursos y Masterclass
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Aprenda conceptos legales de manera práctica y efectiva con nuestros cursos especializados. 
                Acceda a contenido premium diseñado por profesionales del derecho.
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{courses.length}+</p>
                <p className="text-sm text-gray-600">Cursos Disponibles</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">1000+</p>
                <p className="text-sm text-gray-600">Estudiantes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">4.8★</p>
                <p className="text-sm text-gray-600">Calificación</p>
              </div>
            </motion.div>
          </div>
          
          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar cursos por título, categoría o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                    filter === 'all' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📚 Todos
                </button>
                <button
                  onClick={() => setFilter('featured')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                    filter === 'featured' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⭐ Destacados
                </button>
                <button
                  onClick={() => setFilter('popular')}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                    filter === 'popular' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔥 Populares
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all transform hover:scale-105 ${
                      filter === category 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <FaBook className="mx-auto text-gray-400 text-4xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No hay cursos disponibles</h3>
              <p className="text-gray-500">
                No se encontraron cursos que coincidan con tu búsqueda. Por favor, intenta con otros términos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  addToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CoursesPage;
