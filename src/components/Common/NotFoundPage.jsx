import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { HomeIcon, BriefcaseIcon, PhoneIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Página no encontrada | Abogado Wilson Ipiales</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8" 
           style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-2xl w-full space-y-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-9xl font-extrabold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.div>
            
            <motion.h1 
              className="mt-6 text-4xl font-bold"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Página no encontrada
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-xl"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              La página que estás buscando no existe o ha sido movida.
            </motion.p>

            {/* Ilustración 404 */}
            <motion.div
              className="my-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <svg
                className="mx-auto h-64 w-64"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="100" r="80" fill="url(#gradient)" opacity="0.1" />
                <path
                  d="M70 80C70 74.4772 74.4772 70 80 70H120C125.523 70 130 74.4772 130 80V120C130 125.523 125.523 130 120 130H80C74.4772 130 70 125.523 70 120V80Z"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-blue-600"
                />
                <path
                  d="M85 95L95 105M95 95L85 105"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-red-600"
                />
                <path
                  d="M115 95L105 105M105 95L115 105"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-red-600"
                />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="200" y2="200">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <HomeIcon className="h-5 w-5" />
                Volver a inicio
              </Link>
              
              <Link 
                to="/servicios" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 text-base font-medium rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-primary)'
                }}
              >
                <BriefcaseIcon className="h-5 w-5" />
                Ver servicios
              </Link>
              
              <Link 
                to="/contacto" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-500 text-base font-medium rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <PhoneIcon className="h-5 w-5" />
                Contactar
              </Link>
            </motion.div>

            <motion.div 
              className="mt-8 p-6 rounded-xl"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                borderLeft: '4px solid #3b82f6'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <strong>¿Necesitas asistencia legal inmediata?</strong><br />
                Nuestro equipo está disponible 24/7 para atender tus consultas.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
