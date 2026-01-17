import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaBook, FaGraduationCap, FaGavel, FaFileContract,
  FaSearch, FaFilter, FaStar, FaHeart, FaShare, FaTag,
  FaShoppingBag, FaPlus, FaMinus, FaCheck, FaClock,
  FaBolt, FaFire, FaPercent, FaTruck, FaCreditCard, FaEye, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ProfessionalStore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems = [] } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Productos profesionales con imágenes de alta calidad
  const products = [
    // SERVICIOS LEGALES - TODOS
    {
      id: 1,
      name: 'Servicio de Derecho Penal',
      category: 'services',
      price: 500,
      originalPrice: 650,
      description: 'Representación legal completa en casos penales, defensa penal profesional',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format',
      rating: 5.0,
      reviews: 145,
      featured: true,
      discount: 23,
      type: 'service',
      duration: 'Variable',
      availability: 'Inmediata',
      tags: ['Popular', 'Premium']
    },
    {
      id: 2,
      name: 'Servicio de Derecho Civil',
      category: 'services',
      price: 400,
      description: 'Asesoría y representación en casos civiles, contratos, herencias, y más',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 189,
      type: 'service',
      duration: 'Variable',
      tags: ['Profesional', 'Recomendado']
    },
    {
      id: 3,
      name: 'Servicio de Derecho Comercial',
      category: 'services',
      price: 450,
      description: 'Asesoría legal empresarial, constitución de compañías, contratos comerciales',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format',
      rating: 4.8,
      reviews: 98,
      type: 'service',
      duration: 'Variable',
      tags: ['Empresarial']
    },
    {
      id: 4,
      name: 'Servicio de Derecho Laboral',
      category: 'services',
      price: 350,
      description: 'Defensa laboral, despidos, indemnizaciones, acoso laboral',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 156,
      type: 'service',
      duration: 'Variable',
      tags: ['Laboral']
    },
    {
      id: 5,
      name: 'Servicio de Derecho de Tránsito',
      category: 'services',
      price: 250,
      description: 'Infracciones de tránsito, accidentes, defensa en casos viales',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=250&fit=crop&auto=format',
      rating: 4.6,
      reviews: 234,
      type: 'service',
      duration: 'Variable',
      tags: ['Rápido']
    },
    {
      id: 6,
      name: 'Servicio de Derecho Aduanero',
      category: 'services',
      price: 550,
      description: 'Trámites aduaneros, importaciones, exportaciones, comercio exterior',
      image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 67,
      type: 'service',
      duration: 'Variable',
      tags: ['Especializado']
    },
    
    // CONSULTAS - TODAS
    {
      id: 7,
      name: 'Consulta General',
      category: 'consultations',
      price: 80,
      originalPrice: 100,
      description: 'Consulta legal general para resolver dudas legales puntuales',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 345,
      discount: 20,
      type: 'consultation',
      duration: '45 minutos',
      tags: ['Oferta', 'Popular']
    },
    {
      id: 8,
      name: 'Consulta Penal',
      category: 'consultations',
      price: 120,
      description: 'Consulta especializada en derecho penal, análisis de casos penales',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 234,
      type: 'consultation',
      duration: '60 minutos',
      tags: ['Penal', 'Especializado']
    },
    {
      id: 9,
      name: 'Consulta Civil',
      category: 'consultations',
      price: 100,
      description: 'Consulta en temas civiles: contratos, herencias, divorcios',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&auto=format',
      rating: 4.8,
      reviews: 198,
      type: 'consultation',
      duration: '60 minutos',
      tags: ['Civil']
    },
    {
      id: 10,
      name: 'Consulta Empresarial',
      category: 'consultations',
      price: 150,
      description: 'Consulta para empresarios sobre derecho comercial y laboral',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 156,
      type: 'consultation',
      duration: '90 minutos',
      tags: ['Empresarial', 'Premium']
    },
    {
      id: 11,
      name: 'Consulta Digital/Online',
      category: 'consultations',
      price: 90,
      description: 'Consulta completamente virtual por videollamada',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 267,
      type: 'consultation',
      duration: '60 minutos',
      tags: ['Online', 'Flexible']
    },
    
    // CURSOS - TODOS
    {
      id: 12,
      name: 'Curso Fundamentos de Derecho Penal',
      category: 'courses',
      price: 49.99,
      originalPrice: 79.99,
      description: 'Aprende los principios básicos del Derecho Penal ecuatoriano',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 312,
      featured: true,
      discount: 38,
      type: 'course',
      duration: '10 horas',
      lessons: 15,
      students: 1250,
      tags: ['Bestseller', 'Popular']
    },
    {
      id: 13,
      name: 'Curso Contratos y Obligaciones',
      category: 'courses',
      price: 59.99,
      description: 'Curso especializado en contratos civiles y mercantiles',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&auto=format',
      rating: 4.8,
      reviews: 189,
      type: 'course',
      duration: '12 horas',
      lessons: 18,
      students: 890,
      tags: ['Intermedio']
    },
    {
      id: 14,
      name: 'Masterclass Técnicas de Litigación Oral',
      category: 'courses',
      price: 79.99,
      description: 'Técnicas avanzadas de litigación oral para audiencias',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&auto=format',
      rating: 5.0,
      reviews: 167,
      type: 'course',
      duration: '8 horas',
      lessons: 10,
      students: 534,
      tags: ['Avanzado', 'Masterclass']
    },
    {
      id: 15,
      name: 'Curso Derecho Laboral Práctico',
      category: 'courses',
      price: 49.99,
      description: 'Todo sobre relaciones laborales y contratos de trabajo',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 256,
      type: 'course',
      duration: '9 horas',
      lessons: 14,
      students: 678,
      tags: ['Práctico']
    },
    {
      id: 16,
      name: 'Curso Infracciones de Tránsito y Defensa',
      category: 'courses',
      price: 39.99,
      description: 'Guía completa sobre infracciones de tránsito',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=250&fit=crop&auto=format',
      rating: 4.6,
      reviews: 345,
      type: 'course',
      duration: '7 horas',
      lessons: 12,
      students: 890,
      tags: ['Básico', 'Popular']
    },
    {
      id: 17,
      name: 'Masterclass Derecho Aduanero',
      category: 'courses',
      price: 89.99,
      description: 'Todo sobre procedimientos aduaneros y comercio internacional',
      image: 'https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?w=400&h=250&fit=crop&auto=format',
      rating: 4.9,
      reviews: 123,
      type: 'course',
      duration: '14 horas',
      lessons: 20,
      students: 234,
      tags: ['Avanzado', 'Especializado']
    },
    
    // EBOOKS - TODOS
    {
      id: 18,
      name: 'Guía Legal para Emprendedores',
      category: 'ebooks',
      price: 25,
      originalPrice: 39,
      description: 'Todo lo que necesitas saber para iniciar tu negocio',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 456,
      featured: true,
      discount: 36,
      type: 'ebook',
      pages: 120,
      format: 'PDF',
      tags: ['Bestseller', 'Emprendimiento']
    },
    {
      id: 19,
      name: 'Derechos Fundamentales: Lo que Debes Saber',
      category: 'ebooks',
      price: 19.99,
      description: 'Guía completa sobre derechos fundamentales',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop&auto=format',
      rating: 4.6,
      reviews: 234,
      type: 'ebook',
      pages: 85,
      format: 'PDF',
      tags: ['Derechos']
    },
    {
      id: 20,
      name: 'Derecho de Familia: Guía Práctica',
      category: 'ebooks',
      price: 22.50,
      description: 'Todo sobre derecho de familia, divorcios y custodia',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=250&fit=crop&auto=format',
      rating: 4.8,
      reviews: 289,
      type: 'ebook',
      pages: 110,
      format: 'PDF',
      tags: ['Familia', 'Práctico']
    },
    {
      id: 21,
      name: 'Contratos Civiles y Mercantiles',
      category: 'ebooks',
      price: 29.99,
      description: 'Todo sobre contratos y su aplicación práctica',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop&auto=format',
      rating: 4.7,
      reviews: 178,
      type: 'ebook',
      pages: 150,
      format: 'PDF + Word',
      tags: ['Contratos', 'Profesional']
    },
    {
      id: 22,
      name: 'Introducción al Derecho Penal',
      category: 'ebooks',
      price: 15,
      description: 'Conceptos básicos del derecho penal',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&auto=format',
      rating: 4.5,
      reviews: 567,
      type: 'ebook',
      pages: 50,
      format: 'PDF',
      tags: ['Gratis', 'Introductorio']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchCategory && matchSearch && matchPrice;
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'popular': return b.reviews - a.reviews;
      default: return b.featured ? 1 : -1;
    }
  });

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      category: product.category,
      type: product.type
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: FaShoppingBag, color: 'from-blue-500 to-purple-500' },
    { id: 'courses', name: 'Cursos', icon: FaGraduationCap, color: 'from-green-500 to-emerald-500' },
    { id: 'ebooks', name: 'E-books', icon: FaBook, color: 'from-orange-500 to-red-500' },
    { id: 'services', name: 'Servicios Legales', icon: FaGavel, color: 'from-blue-600 to-indigo-600' },
    { id: 'consultations', name: 'Consultas', icon: FaFileContract, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Tienda Legal Profesional
          </motion.h1>
          <p className="text-xl text-blue-100 mb-8">
            Servicios, Consultas, Cursos y Recursos Legales de Alta Calidad
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar productos, servicios, cursos..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: 'Productos', value: products.length },
              { label: 'Categorías', value: categories.length - 1 },
              { label: 'Clientes', value: '2,500+' },
              { label: 'Valoración', value: '4.8/5' }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:shadow-md'
                } ${activeCategory === cat.id ? cat.color : ''}`}
              >
                <cat.icon className="inline mr-2" />
                {cat.name}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="rating">Mejor Valorados</option>
              <option value="popular">Más Populares</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {filteredProducts.length} productos encontrados
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = `https://images.unsplash.com/photo-${product.id % 10 + 1}000000000000?w=400&h=250&fit=crop&auto=format`;
                  }}
                />
                {product.featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 text-xs font-bold rounded">
                    DESTACADO
                  </div>
                )}
                {product.discount && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                    -{product.discount}%
                  </div>
                )}
                {/* Quick View Button */}
                <button
                  onClick={() => handleQuickView(product)}
                  className="absolute top-2 left-2 bg-white bg-opacity-80 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <FaEye className="text-gray-700" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    product.type === 'course' ? 'bg-green-100 text-green-800' :
                    product.type === 'ebook' ? 'bg-orange-100 text-orange-800' :
                    product.type === 'service' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {product.type === 'course' ? 'Curso' :
                     product.type === 'ebook' ? 'E-book' :
                     product.type === 'service' ? 'Servicio' : 'Consulta'}
                  </span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through ml-2">${product.originalPrice}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    Agregar al Carrito
                  </motion.button>

                  <button
                    onClick={() => handleQuickView(product)}
                    className="w-full border-2 border-gray-300 text-gray-700 py-2 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all"
                  >
                    Vista Rápida
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-6">Intenta ajustar tus filtros de búsqueda</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
                setSortBy('featured');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Ver Todos los Productos
            </button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setQuickViewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setQuickViewOpen(false)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
                >
                  <FaTimes className="text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-green-600">${selectedProduct.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setQuickViewOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold"
                  >
                    Agregar al Carrito
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionalStore;
