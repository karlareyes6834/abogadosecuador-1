import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaBook, FaGraduationCap, FaGavel, FaFileContract,
  FaSearch, FaFilter, FaStar, FaHeart, FaShare, FaTag,
  FaShoppingBag, FaPlus, FaMinus, FaCheck, FaClock,
  FaBolt, FaFire, FaPercent, FaTruck, FaCreditCard, FaTimes
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { products as allProducts } from '../../data/products.js';
import ImageWithFallback from '../Common/ImageWithFallback';

const normalizeCategory = (category) => {
  if (!category) return 'other';
  const c = String(category).toLowerCase();
  if (c === 'services' || c === 'service') return 'service';
  if (c === 'consultations' || c === 'consultation') return 'consultation';
  if (c === 'courses' || c === 'course' || c === 'masterclass') return 'course';
  if (c === 'ebooks' || c === 'ebook') return 'ebook';
  return c;
};

const UnifiedStore = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [view, setView] = useState('store'); // 'store' or 'library'

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // In a real application, this would fetch from the backend
        // const { data, error } = await dataService.getAll('products');
        // if (error) throw error;
        // setProducts(data);

        // Using the new products.js data file
        setProducts(allProducts.map(product => ({ ...product, category: normalizeCategory(product.category) })));
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        toast.error('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const productCategory = normalizeCategory(product.category);
    const matchCategory = activeCategory === 'all' || productCategory === activeCategory;
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
      category: product.category
    });
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
  };

  const [purchasedProducts, setPurchasedProducts] = useState([1, 6, 9]); // Sample purchased products

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: FaShoppingBag, color: 'from-blue-500 to-purple-500' },
    { id: 'course', name: 'Cursos', icon: FaGraduationCap, color: 'from-green-500 to-emerald-500' },
    { id: 'ebook', name: 'E-books', icon: FaBook, color: 'from-orange-500 to-red-500' },
    { id: 'service', name: 'Servicios Legales', icon: FaGavel, color: 'from-blue-600 to-indigo-600' },
    { id: 'consultation', name: 'Consultas', icon: FaFileContract, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_minmax(0,1fr)] gap-10 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                {view === 'store' ? 'Tienda Legal Completa' : 'Mi Biblioteca'}
              </motion.h1>
              <p className="text-xl text-blue-100">
                {view === 'store' ? 'Servicios, Consultas, Cursos, E-books y más' : 'Tus productos adquiridos'}
              </p>

          {/* View Switcher */}
          {user && (
            <div className="mt-4">
              <button onClick={() => handleViewChange('store')} className={`mr-2 px-4 py-2 rounded-t-lg ${view === 'store' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'}`}>Tienda</button>
              <button onClick={() => handleViewChange('library')} className={`px-4 py-2 rounded-t-lg ${view === 'library' ? 'bg-gray-100 text-gray-800' : 'bg-white/10 text-white'}`}>Mi Biblioteca</button>
            </div>
          )}

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl">
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

            {/* Icono 3D de libro en el hero, solo en pantallas grandes */}
            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="pointer-events-none absolute -top-6 -right-4 h-40 w-40 rounded-full bg-white/20 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-6 h-40 w-40 rounded-full bg-blue-400/30 blur-3xl" />

                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/20 shadow-2xl backdrop-blur-md">
                  <model-viewer
                    src="/models/libro-legal.glb"
                    alt="Libro legal en 3D"
                    camera-controls
                    auto-rotate
                    auto-rotate-delay="1500"
                    exposure="0.9"
                    shadow-intensity="1"
                    interaction-prompt="none"
                    className="w-full h-64"
                    style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.22), transparent 65%)' }}
                  ></model-viewer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {view === 'store' ? (
          <>
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
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 mb-4">Error al cargar productos</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Reintentar
                </button>
              </div>
            ) : (
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
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                        fallbackType={product.category === 'course' ? 'course' : product.category === 'ebook' ? 'ebook' : product.category === 'service' ? 'service' : 'product'}
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
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
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
          </>
        ) : (
          /* Library View */
          <div className="text-center py-20">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Tu Biblioteca</h3>
            <p className="text-gray-500">Aquí aparecerán tus cursos y e-books comprados</p>
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
                <ImageWithFallback
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-64 object-cover"
                  fallbackType={selectedProduct.category === 'course' ? 'course' : selectedProduct.category === 'ebook' ? 'ebook' : selectedProduct.category === 'service' ? 'service' : 'product'}
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

export default UnifiedStore;
