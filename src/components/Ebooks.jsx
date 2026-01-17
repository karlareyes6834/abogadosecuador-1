import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBook, FaDownload, FaShoppingCart, FaCheck, FaFilePdf } from 'react-icons/fa';
import { ebookService } from '../services/ebookService';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { supabase } from '../config/supabase';

const ebooksData = [
  {
    id: 0,
    title: "Introducción al Derecho: Conceptos Básicos para Todos",
    description: "Guía gratuita que explica los fundamentos del derecho, sistema judicial y procesos legales básicos en Ecuador. ¡Perfecto para comenzar a entender el mundo legal!",
    price: 0,
    coverImage: "/images/ebooks/introduccion-derecho.jpg",
    pages: 25,
    popular: true,
    category: "Básico",
    isFree: true,
    pdfUrl: "/ebooks/introduccion-al-derecho.pdf"
  },
  {
    id: 1,
    title: "Guía Completa de Derecho Civil para No Abogados",
    description: "Un compendio práctico sobre contratos, propiedades y derechos civiles explicado en lenguaje sencillo.",
    price: 19.99,
    coverImage: "/images/ebooks/derecho-civil.jpg",
    pages: 120,
    popular: true,
    category: "Civil"
  },
  {
    id: 2,
    title: "Manual de Defensa en Casos Penales",
    description: "Estrategias y procedimientos para entender el proceso penal y conocer sus derechos durante una acusación.",
    price: 24.99,
    coverImage: "/images/ebooks/derecho-penal.jpg",
    pages: 150,
    popular: false,
    category: "Penal"
  },
  {
    id: 3,
    title: "Derecho Comercial para Emprendedores",
    description: "Todo lo que necesita saber para proteger legalmente su negocio y evitar problemas jurídicos comunes.",
    price: 29.99,
    coverImage: "/images/ebooks/derecho-comercial.jpg",
    pages: 180,
    popular: true,
    category: "Comercial"
  },
  {
    id: 4,
    title: "Guía de Trámites de Tránsito",
    description: "Procedimientos, multas y recursos legales relacionados con infracciones y accidentes de tránsito.",
    price: 14.99,
    coverImage: "/images/ebooks/derecho-transito.jpg",
    pages: 95,
    popular: false,
    category: "Tránsito"
  },
  {
    id: 5,
    title: "Procedimientos Aduaneros Simplificados",
    description: "Explicación detallada de los procesos de importación, exportación y resolución de controversias aduaneras.",
    price: 22.99,
    coverImage: "/images/ebooks/derecho-aduanero.jpg",
    pages: 135,
    popular: false,
    category: "Aduanas"
  },
  {
    id: 6,
    title: "Divorcio en Ecuador: Guía Práctica",
    description: "Todo el proceso explicado paso a paso, incluyendo pensiones alimenticias, custodia y división de bienes.",
    price: 18.99,
    coverImage: "/images/ebooks/divorcio.jpg",
    pages: 110,
    popular: true,
    category: "Civil"
  }
];

export default function Ebooks() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasedEbooks, setPurchasedEbooks] = useState([]);
  const { addToCart, removeFromCart, items, total } = useCart();

  const categories = ['Todos', 'Civil', 'Penal', 'Comercial', 'Tránsito', 'Aduanas'];

  useEffect(() => {
    const loadPurchasedEbooks = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('ebook_purchases')
            .select('ebook_id')
            .eq('user_id', user.id);
          setPurchasedEbooks(data?.map(p => p.ebook_id) || []);
        } catch (error) {
          console.error('Error loading purchases:', error);
        }
      }
      setIsLoading(false);
    };

    loadPurchasedEbooks();
  }, [user]);

  // Filtrar los e-books por categoría y término de búsqueda
  const filteredEbooks = ebooksData
    .filter(ebook => (selectedCategory === 'Todos' || ebook.category === selectedCategory))
    .filter(ebook => ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    ebook.description.toLowerCase().includes(searchTerm.toLowerCase()));

  // Agregar al carrito usando el contexto global
  const handleAddToCart = (ebook) => {
    const cartItem = {
      id: ebook.id,
      name: ebook.title,
      price: ebook.price,
      category: 'E-book',
      imageUrl: ebook.coverImage,
      quantity: 1,
      type: 'ebook'
    };
    addToCart(cartItem);
    toast.success(`${ebook.title} agregado al carrito`);
  };

  // Remover del carrito usando el contexto global
  const handleRemoveFromCart = (id) => {
    removeFromCart(id, 'ebook');
  };

  // Usar los items del contexto global
  const cartItems = items || [];
  const cartTotal = total?.toFixed(2) || '0.00';

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Por favor inicie sesión para continuar');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const { data: { sessionId }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { cartItems }
      });

      if (error) throw error;
      window.location.href = sessionId;
    } catch (error) {
      toast.error('Error al procesar el pago');
      console.error('Checkout error:', error);
    }
  };

  const handleDownload = async (ebook) => {
    try {
      setDownloading(true);

      if (!ebook.isFree && !user) {
        toast.error('Debe iniciar sesión para descargar este ebook');
        navigate('/login', { state: { from: location } });
        return;
      }

      if (!ebook.isFree && !purchasedEbooks.includes(ebook.id)) {
        toast.error('Debe comprar este ebook primero');
        return;
      }

      await ebookService.trackDownload(ebook.id);
      const downloadUrl = await ebookService.getDownloadUrl(ebook.id);

      // Crear un link temporal y simular click
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${ebook.title}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('¡Descarga iniciada!');
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error('Error al iniciar la descarga');
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="loader"></div>
    </div>;
  }

  return (
    <div className="py-12 bg-secondary-50">
      <div className="container-custom">
        {/* Featured Free Ebook */}
        <div className="mb-16">
          <motion.div
            className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-8 rounded-3xl border-2 border-blue-200 shadow-2xl overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <img
                    src={ebooksData[0].coverImage}
                    alt={ebooksData[0].title}
                    className="w-full h-80 object-cover rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Imagen+no+disponible';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-full font-bold shadow-xl animate-pulse">
                    🎁 GRATIS
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-700 font-semibold">
                        <FaFilePdf className="mr-2 text-red-600" /> {ebooksData[0].pages} páginas
                      </span>
                      <span className="flex items-center text-gray-700 font-semibold">
                        <FaDownload className="mr-2 text-blue-600" /> PDF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <FaBook className="mr-2" />
                  E-book Gratuito
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{ebooksData[0].title}</h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{ebooksData[0].description}</p>

                <motion.button
                  onClick={() => handleDownload(ebooksData[0])}
                  disabled={downloading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl w-full md:w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <FaDownload className="text-xl" />
                      Descargar Ahora Gratis
                    </>
                  )}
                </motion.button>
                <p className="text-sm text-gray-500 mt-3">✓ Descarga instantánea • ✓ Sin registro • ✓ 100% gratis</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
              📚 Recursos Digitales
            </div>
            <h2 className="text-5xl font-extrabold text-gray-900 mb-4">Biblioteca Legal Digital</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              E-books especializados para entender sus derechos y procedimientos legales
            </p>
          </motion.div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
                placeholder="Buscar e-books por título, categoría o descripción..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'Todos' && '📚 '}
                  {category === 'Civil' && '⚖️ '}
                  {category === 'Penal' && '🔒 '}
                  {category === 'Comercial' && '💼 '}
                  {category === 'Tránsito' && '🚗 '}
                  {category === 'Aduanas' && '📦 '}
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resumen del carrito */}
        {cartItems.length > 0 && (
          <motion.div
            className="mb-10 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200 shadow-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-xl">
                  <FaShoppingCart className="text-xl" />
                </div>
                Carrito de Compra
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  {cartItems.length}
                </span>
              </h3>
            </div>

            <div className="space-y-3">
              {cartItems.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=Img';
                      }}
                    />
                    <div>
                      <span className="font-semibold text-gray-900 block">{item.name}</span>
                      <span className="text-sm text-gray-500">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-blue-600">${item.price.toFixed(2)}</span>
                    <motion.button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t-2 border-blue-200 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
                <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  ${cartTotal}
                </span>
              </div>
              <motion.button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart className="text-xl" />
                Proceder al Pago
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Lista de e-books */}
        {filteredEbooks.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
            </svg>
            <h3 className="text-xl font-bold text-secondary-500 mt-4">No se encontraron e-books</h3>
            <p className="text-secondary-400">Intente con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEbooks.filter(ebook => !ebook.isFree).map((ebook, index) => (
              <motion.div
                key={ebook.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={ebook.coverImage}
                    alt={ebook.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x500?text=Imagen+no+disponible';
                    }}
                  />

                  {/* Popular badge */}
                  {ebook.popular && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl"
                    >
                      🔥 Popular
                    </motion.div>
                  )}

                  {/* Pages count badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2">
                    <FaFilePdf className="text-red-600" />
                    {ebook.pages} páginas
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {ebook.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">{ebook.description}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Precio</p>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        ${ebook.price.toFixed(2)}
                      </span>
                    </div>

                    {cartItems.some(item => item.id === ebook.id) ? (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl font-semibold border-2 border-green-200">
                        <FaCheck className="text-lg" />
                        <span>Agregado</span>
                      </div>
                    ) : purchasedEbooks.includes(ebook.id) ? (
                      <button
                        onClick={() => handleDownload(ebook)}
                        disabled={downloading}
                        className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg"
                      >
                        <FaDownload /> Descargar
                      </button>
                    ) : (
                      <motion.button
                        onClick={() => handleAddToCart(ebook)}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaShoppingCart className="text-base" />
                        <span>Comprar</span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sección de beneficios */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">
              ¿Por qué elegir nuestros E-Books?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Recursos digitales diseñados para facilitar tu comprensión legal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white rounded-2xl text-center p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30"></div>
                <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 flex items-center justify-center">
                  <FaBook className="text-white text-3xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Conocimiento Accesible</h4>
              <p className="text-gray-600 leading-relaxed">
                Información legal especializada explicada en lenguaje claro y comprensible para todos.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl text-center p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30"></div>
                <div className="relative rounded-full bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 flex items-center justify-center">
                  <FaDownload className="text-white text-3xl" />
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Disponibilidad Inmediata</h4>
              <p className="text-gray-600 leading-relaxed">
                Descarga instantánea tras la compra, sin esperas ni envíos. Acceso 24/7.
              </p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl text-center p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-30"></div>
                <div className="relative rounded-full bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Ahorro de Tiempo</h4>
              <p className="text-gray-600 leading-relaxed">
                Resuelva dudas legales básicas sin necesidad de consultas presenciales costosas.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
