import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Blog = () => {
  const [articles, setArticles] = useState([
    {
      id: 1,
      slug: 'nuevas-reformas-derecho-penal',
      title: 'Nuevas Reformas en Derecho Penal 2025',
      excerpt: 'Análisis exhaustivo de las últimas modificaciones al código penal ecuatoriano y su impacto directo en los procesos judiciales.',
      content: 'Contenido completo del artículo...',
      category: 'Derecho Penal',
      tags: ['Reforma Legal', 'Código Penal', 'Actualidad'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2025-01-15',
      readTime: '5 min',
      views: 1240,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=450&fit=crop',
      featured: true
    },
    {
      id: 2,
      slug: 'guia-completa-derecho-civil',
      title: 'Guía Completa de Derecho Civil',
      excerpt: 'Todo lo que necesitas saber sobre contratos, responsabilidad civil y resolución de conflictos en Ecuador.',
      content: 'Contenido completo del artículo...',
      category: 'Derecho Civil',
      tags: ['Contratos', 'Responsabilidad Civil', 'Guía'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2025-01-10',
      readTime: '8 min',
      views: 980,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop',
      featured: false
    },
    {
      id: 3,
      slug: 'derecho-transito-guia',
      title: 'Derecho de Tránsito: Lo que Debes Saber',
      excerpt: 'Información esencial sobre multas, infracciones y procedimientos en casos de tránsito vehicular.',
      content: 'Contenido completo del artículo...',
      category: 'Tránsito',
      tags: ['Multas', 'Infracciones', 'Vehículos'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2025-01-05',
      readTime: '6 min',
      views: 1540,
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=450&fit=crop',
      featured: false
    },
    {
      id: 4,
      slug: 'derechos-consumidor-ecuador',
      title: 'Derechos del Consumidor en Ecuador',
      excerpt: 'Conoce tus derechos como consumidor y cómo ejercerlos ante abusos comerciales.',
      content: 'Contenido completo del artículo...',
      category: 'Derecho del Consumidor',
      tags: ['Consumidor', 'Protección', 'Derechos'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2024-12-28',
      readTime: '7 min',
      views: 2100,
      image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=450&fit=crop',
      featured: true
    },
    {
      id: 5,
      slug: 'derecho-laboral-despidos',
      title: 'Despidos Laborales: Conoce tus Derechos',
      excerpt: 'Guía completa sobre despidos justificados e injustificados y cómo proceder en cada caso.',
      content: 'Contenido completo del artículo...',
      category: 'Derecho Laboral',
      tags: ['Despidos', 'Trabajo', 'Indemnización'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2024-12-20',
      readTime: '9 min',
      views: 1780,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=450&fit=crop',
      featured: false
    },
    {
      id: 6,
      slug: 'herencias-sucesiones-ecuador',
      title: 'Herencias y Sucesiones en Ecuador',
      excerpt: 'Todo sobre procesos sucesorios, testamentos y partición de bienes hereditarios.',
      content: 'Contenido completo del artículo...',
      category: 'Derecho Civil',
      tags: ['Herencias', 'Testamentos', 'Sucesiones'],
      author: 'Wilson Ipiales',
      authorImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
      date: '2024-12-15',
      readTime: '10 min',
      views: 2450,
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop',
      featured: false
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  
  const categories = [
    'Todas',
    'Derecho Penal',
    'Derecho Civil',
    'Tránsito',
    'Derecho Laboral',
    'Derecho del Consumidor'
  ];
  
  useEffect(() => {
    filterArticles();
  }, [searchTerm, selectedCategory, articles]);
  
  const filterArticles = () => {
    let filtered = articles;
    
    if (selectedCategory !== 'Todas') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredArticles(filtered);
  };

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <BookOpenIcon className="h-16 w-16 mx-auto mb-4 text-blue-600" />
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Blog Legal Profesional
            </h1>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Artículos especializados sobre derecho penal, civil, laboral y más. 
              Mantente actualizado con las últimas reformas y noticias legales.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
            Artículos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <div className="relative h-64 overflow-hidden group">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x450?text=Legal+Article';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-full shadow-lg">
                      DESTACADO
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      <TagIcon className="h-3 w-3" />
                      {article.category}
                    </span>
                    <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {article.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpenIcon className="h-4 w-4" />
                        {article.views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h2>
                  <p className="mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex items-center gap-3">
                      <img
                        src={article.authorImage}
                        alt={article.author}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(article.author);
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {article.author}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(article.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                    >
                      Leer más
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8" style={{ color: 'var(--text-primary)' }}>
          Todos los Artículos
        </h2>
        {regularArticles.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-tertiary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No se encontraron artículos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              >
                <div className="relative h-48 overflow-hidden group">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x450?text=Legal+Article';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      <TagIcon className="h-3 w-3" />
                      {article.category}
                    </span>
                    <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <ClockIcon className="h-4 w-4" />
                      {article.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                    {article.title}
                  </h2>
                  <p className="mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-sm flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                      <CalendarIcon className="h-4 w-4" />
                      {new Date(article.date).toLocaleDateString('es-ES', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <Link
                      to={`/blog/${article.slug}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm inline-flex items-center gap-1"
                    >
                      Leer más
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 rounded-xl shadow-lg p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">
              Recibe las Últimas Noticias Legales
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Suscríbete a nuestro newsletter y recibe artículos exclusivos, análisis legales y actualizaciones directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:ring-4 focus:ring-white/50 focus:outline-none"
              />
              <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-bold shadow-lg">
                Suscribirse
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
