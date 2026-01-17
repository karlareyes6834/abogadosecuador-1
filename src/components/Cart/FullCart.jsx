import React, { useState } from 'react';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const FullCart = () => {
  const {
    cartItems = [],
    removeFromCart,
    updateQuantity,
    getCartTotal,
    itemCount,
    clearCart
  } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsOpen(false);
      navigate('/checkout');
    } else {
      toast.error('El carrito está vacío');
    }
  };

  const handleContinueShopping = () => {
    setIsOpen(false);
    navigate('/tienda');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Carrito limpiado');
  };

  return (
    <div>
      {/* Full Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 relative hover:scale-110"
          title="Ver Carrito"
          aria-label="Ver Carrito"
        >
          <FaShoppingCart className="text-xl" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Full Cart Sidebar */}
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
                    onClick={handleContinueShopping}
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
                          <span className="text-xs text-gray-500 text-center">
                            {item.type === 'course' ? 'Curso' : item.type === 'ebook' ? 'E-book' : 'Producto'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.name || item.title || 'Producto'}</h3>
                          <p className="text-xs text-gray-600">
                            Cantidad: {item.quantity || 1}
                          </p>
                          <p className="text-sm font-bold text-green-600">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                            className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.type)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                    >
                      Proceder al Pago
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handleContinueShopping}
                        className="border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all"
                      >
                        Seguir Comprando
                      </button>
                      <button
                        onClick={handleClearCart}
                        className="border border-red-300 text-red-700 py-2 rounded-lg font-semibold hover:border-red-500 hover:text-red-800 transition-all"
                      >
                        Limpiar Carrito
                      </button>
                    </div>
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

export default FullCart;
