import React, { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const BasicCart = () => {
  const { cartItems = [], itemCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Basic Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-colors relative"
        >
          <FaShoppingCart className="text-xl" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Basic Cart Sidebar */}
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

              {/* Cart Items */}
              {cartItems.length === 0 ? (
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
              ) : (
                <div>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.type}`} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-500">{item.type}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.name}</h3>
                          <p className="text-xs text-gray-600">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            ${item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/checkout');
                      }}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Proceder al Pago
                    </button>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/tienda');
                      }}
                      className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicCart;
