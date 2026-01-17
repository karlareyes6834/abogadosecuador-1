import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  FaCheckCircle,
  FaShoppingBag,
  FaEnvelope,
  FaHome,
  FaReceipt,
  FaHeart,
  FaStar,
  FaGift
} from 'react-icons/fa';

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};
  const { orderId, amount, billingInfo, paymentMethod, transactionId } = orderData;

  useEffect(() => {
    // Celebración con confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      }));
      confetti(Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      }));
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4"
         style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <div className="rounded-2xl shadow-2xl p-8 text-center"
             style={{ backgroundColor: 'var(--bg-primary)' }}>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 mb-4">
              <FaCheckCircle className="text-white text-6xl" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            ¡Compra Exitosa!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            Gracias por confiar en nuestros servicios legales profesionales
          </motion.p>
          
          {orderId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mb-8 inline-block px-6 py-3 bg-blue-50 rounded-lg"
            >
              <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
              <p className="text-xl font-bold text-blue-600">{orderId}</p>
              {amount && (
                <p className="text-lg font-semibold text-gray-700 mt-2">
                  Total: ${typeof amount === 'number' ? amount.toFixed(2) : amount}
                </p>
              )}
              {paymentMethod && (
                <p className="text-sm text-gray-500 mt-1">
                  Método: {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod}
                </p>
              )}
            </motion.div>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-xl border"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <FaEnvelope className="text-4xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Confirmación Enviada
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Recibirás un correo electrónico con todos los detalles de tu compra y acceso a los productos
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-xl border"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <FaReceipt className="text-4xl text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Recibo Disponible
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Tu recibo está disponible en tu dashboard de usuario
              </p>
            </motion.div>
          </div>

          {/* What's Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8 p-6 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              ¿Qué sigue ahora?
            </h3>
            <ul className="text-left space-y-3" style={{ color: 'var(--text-secondary)' }}>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span>Revisa tu correo electrónico para la confirmación de pago</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span>Accede a tu dashboard para ver tus productos/servicios</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                <span>Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              <FaReceipt className="mr-2" />
              Ir al Dashboard
            </button>

            <button
              onClick={() => navigate('/tienda')}
              className="inline-flex items-center justify-center px-8 py-3 border-2 rounded-lg font-semibold transition-all"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <FaShoppingBag className="mr-2" />
              Seguir Comprando
            </button>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-8 py-3 border-2 rounded-lg font-semibold transition-all"
              style={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <FaHome className="mr-2" />
              Volver al Inicio
            </button>
          </motion.div>

          {/* Rating Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-8 p-6 rounded-xl"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              ¡Califícanos!
            </h3>
            <div className="flex justify-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-2xl cursor-pointer hover:scale-110 transition-transform" />
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Tu opinión nos ayuda a mejorar nuestros servicios
            </p>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-8 pt-8 border-t"
            style={{ borderColor: 'var(--border-color)' }}
          >
            <FaHeart className="text-red-500 text-2xl mx-auto mb-2" />
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Agradecemos tu confianza en Abogado Wilson
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
