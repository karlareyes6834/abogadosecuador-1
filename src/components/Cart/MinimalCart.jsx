import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MinimalCart = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Minimal Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors"
        >
          <FaShoppingCart className="text-xl" />
        </button>
      </div>

      {/* Minimal Cart Sidebar */}
      {isOpen && (
        <div>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Carrito de Compras</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Empty State */}
              <div className="text-center py-12">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-6">Tu carrito está vacío</p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/tienda');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ir a la Tienda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalCart;
