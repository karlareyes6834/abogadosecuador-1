import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight,
  FaCreditCard, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageWithFallback from '../Common/ImageWithFallback';

const FloatingCart = () => {
  const { cartItems = [], removeFromCart, updateQuantity, getCartTotal, itemCount, clearCart } = useCart();
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
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-8 right-8 z-[9999]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full p-5 shadow-2xl transition-all relative group"
          aria-label="Abrir carrito de compras"
        >
          <FaShoppingCart className="text-2xl" />
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-7 w-7 flex items-center justify-center shadow-lg border-2 border-white"
            >
              {itemCount}
            </motion.span>
          )}
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ver carrito
          </span>
        </motion.button>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-60 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Carrito de Compras</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-600" />
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
                  <>
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {cartItems.map((item) => (
                        <motion.div
                          key={`${item.id}-${item.type}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                        >
                          <ImageWithFallback
                            src={item.imageUrl || item.image}
                            alt={item.name}
                            fallbackType={item.type === 'course' ? 'course' : item.type === 'ebook' ? 'ebook' : 'product'}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{item.name}</h3>
                            <p className="text-xs text-gray-600 capitalize">
                              {item.type === 'course' ? 'Curso' : item.type === 'ebook' ? 'E-book' : 'Producto'}
                            </p>
                            <p className="text-sm font-bold text-green-600">
                              ${item.price * item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                updateQuantity(item.id, item.type, item.quantity - 1);
                              }}
                              className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="text-xs" />
                            </button>
                            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => {
                                updateQuantity(item.id, item.type, item.quantity + 1);
                              }}
                              className="p-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                            >
                              <FaPlus className="text-xs" />
                            </button>
                            <button
                              onClick={() => {
                                removeFromCart(item.id, item.type);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Eliminar producto"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </motion.div>
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
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCheckout}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center"
                      >
                        <FaCreditCard className="mr-2" />
                        Proceder al Pago
                        <FaArrowRight className="ml-2" />
                      </motion.button>

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

                    {/* Security Badge */}
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center">
                        <FaCheckCircle className="text-green-600 mr-3" />
                        <div>
                          <p className="font-semibold text-green-800">Compra Segura</p>
                          <p className="text-sm text-green-700">Tus datos están protegidos con encriptación SSL</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
