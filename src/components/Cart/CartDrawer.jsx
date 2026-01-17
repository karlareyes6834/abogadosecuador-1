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

const CartDrawer = () => {
  const { cartItems = [], removeFromCart, updateQuantity, getCartTotal, itemCount, isCartVisible, setIsCartVisible } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      setIsCartVisible(false);
      setTimeout(() => navigate('/checkout'), 100);
    } else {
      toast.error('El carrito está vacío');
    }
  };

  const handleContinueShopping = () => {
    setIsCartVisible(false);
    setTimeout(() => navigate('/tienda'), 100);
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsCartVisible(true)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <FaShoppingCart className="h-6 w-6 text-gray-700" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartVisible && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
              onClick={() => setIsCartVisible(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-full sm:max-w-lg bg-white shadow-xl z-[9999] overflow-y-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Carrito de Compras</h2>
                  <button
                    onClick={() => setIsCartVisible(false)}
                    className="p-3 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
                    aria-label="Cerrar carrito"
                  >
                    <FaTimes className="text-gray-600 text-xl" />
                  </button>
                </div>

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6 text-lg">Tu carrito está vacío</p>
                    <button
                      onClick={handleContinueShopping}
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-lg touch-manipulation"
                    >
                      Ir a la Tienda
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
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
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity}
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ${item.price * item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.type || 'product', item.quantity - 1)}
                              className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors touch-manipulation"
                              aria-label="Disminuir cantidad"
                            >
                              <FaMinus className="text-sm" />
                            </button>
                            <span className="px-3 py-2 bg-gray-100 rounded font-semibold min-w-[40px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.type || 'product', item.quantity + 1)}
                              className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors touch-manipulation"
                              aria-label="Aumentar cantidad"
                            >
                              <FaPlus className="text-sm" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id, item.type || 'product')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors touch-manipulation ml-2"
                              aria-label="Eliminar del carrito"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-6 mb-6">
                      <div className="flex justify-between items-center text-xl font-bold">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center text-lg shadow-lg touch-manipulation"
                      >
                        <FaCreditCard className="mr-2" />
                        Proceder al Pago
                        <FaArrowRight className="ml-2" />
                      </motion.button>

                      <button
                        onClick={handleContinueShopping}
                        className="w-full border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all touch-manipulation"
                      >
                        Seguir Comprando
                      </button>
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

export default CartDrawer;
