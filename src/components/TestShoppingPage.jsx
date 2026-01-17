import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const TestShoppingPage = () => {
  const { addToCart, items, total } = useCart();
  const [activeTab, setActiveTab] = useState('courses');

  // Datos de prueba para cursos
  const testCourses = [
    {
      id: 'curso-derecho-penal-1',
      title: 'Fundamentos de Derecho Penal',
      description: 'Aprende los principios básicos del Derecho Penal ecuatoriano.',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 49.99,
      category: 'Derecho Penal',
      type: 'course'
    },
    {
      id: 'curso-derecho-civil-1',
      title: 'Contratos y Obligaciones',
      description: 'Curso especializado en contratos civiles y mercantiles.',
      imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 59.99,
      category: 'Derecho Civil',
      type: 'course'
    }
  ];

  // Datos de prueba para ebooks
  const testEbooks = [
    {
      id: 1,
      title: 'Guía Legal para Emprendedores',
      description: 'Todo lo que necesitas saber para iniciar tu negocio.',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 25.00,
      category: 'Emprendimiento',
      type: 'ebook'
    },
    {
      id: 2,
      title: 'Derechos Fundamentales',
      description: 'Una guía completa sobre derechos fundamentales.',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      price: 19.99,
      category: 'Derechos',
      type: 'ebook'
    }
  ];

  const handleAddToCart = (item) => {
    const cartItem = {
      id: item.id,
      name: item.title,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || item.coverImage,
      quantity: 1,
      type: item.type
    };

    console.log('🛒 Agregando al carrito:', cartItem);
    addToCart(cartItem);
    toast.success(`${item.title} agregado al carrito`);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">🧪 Página de Prueba - Carrito e Imágenes</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-6 py-3 rounded-md font-semibold ${activeTab === 'courses' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            📚 Cursos
          </button>
          <button
            onClick={() => setActiveTab('ebooks')}
            className={`px-6 py-3 rounded-md font-semibold ${activeTab === 'ebooks' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
          >
            📖 E-books
          </button>
        </div>
      </div>

      {/* Estado del carrito */}
      <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
        <h3 className="font-semibold">🛒 Estado del Carrito</h3>
        <p>Items en carrito: <span className="font-bold">{items.length}</span></p>
        <p>Total: <span className="font-bold">${total?.toFixed(2) || '0.00'}</span></p>
      </div>

      {/* Contenido de cursos */}
      {activeTab === 'courses' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">📚 Cursos Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testCourses.map(course => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">${course.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(course)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      🛒 Comprar Curso
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de ebooks */}
      {activeTab === 'ebooks' && (
        <div>
          <h2 className="text-2xl font-bold mb-6">📖 E-books Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testEbooks.map(ebook => (
              <div key={ebook.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={ebook.coverImage}
                  alt={ebook.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400?text=Imagen+no+disponible';
                  }}
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{ebook.title}</h3>
                  <p className="text-gray-600 mb-4">{ebook.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">${ebook.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleAddToCart(ebook)}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🛒 Comprar E-book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items en el carrito */}
      {items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">🛒 Items en el Carrito</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div key={`${item.id}-${item.type}`} className="bg-white rounded-lg shadow-md p-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded mb-3"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x150?text=Imagen+no+disponible';
                  }}
                />
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Tipo: {item.type}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestShoppingPage;
