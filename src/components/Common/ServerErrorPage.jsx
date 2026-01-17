import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaRedo, FaBug, FaTools, FaHeadset } from 'react-icons/fa';

const ServerErrorPage = () => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate('/');
  };

  const retryPage = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icono de error del servidor */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-6xl text-red-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center">
              <FaBug className="text-2xl text-pink-600" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <FaTools className="text-2xl text-orange-600" />
            </div>
          </div>
        </div>

        {/* Título y descripción */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
          <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Error del Servidor
          </span>
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
          500 - Algo salió mal
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
          Lo sentimos, ha ocurrido un error interno en nuestro servidor. 
          Nuestro equipo técnico ha sido notificado y está trabajando para solucionarlo.
        </p>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={retryPage}
            disabled={isRetrying}
            className="flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            <FaRedo className={`mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Reintentando...' : 'Reintentar'}
          </button>
          
          <button
            onClick={goBack}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            Volver atrás
          </button>
          
          <button
            onClick={goHome}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            <FaHome className="mr-2" />
            Ir al inicio
          </button>
        </div>

        {/* Información del error */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            ¿Qué está pasando?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  <strong>Error interno:</strong> Problema en nuestros servidores.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  <strong>Base de datos:</strong> Problema de conexión o consulta.
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  <strong>Mantenimiento:</strong> Actualizaciones del sistema.
                </p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <p className="text-sm text-gray-600">
                  <strong>Alta demanda:</strong> Muchos usuarios simultáneos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Soluciones temporales */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Soluciones que puedes probar
          </h3>
          
          <div className="space-y-3 text-left">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-blue-700">
                <strong>Refrescar la página:</strong> Presiona F5 o el botón de recargar.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-blue-700">
                <strong>Limpiar caché:</strong> Borra el caché del navegador.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-blue-700">
                <strong>Cambiar navegador:</strong> Prueba con otro navegador.
              </p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <p className="text-sm text-blue-700">
                <strong>Esperar un momento:</strong> El problema puede resolverse solo.
              </p>
            </div>
          </div>
        </div>

        {/* Enlaces de ayuda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            ¿Necesitas ayuda inmediata?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://wa.me/593988352269"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200 text-green-700 font-medium flex items-center justify-center"
            >
              <FaHeadset className="mr-2" />
              WhatsApp
            </a>
            
            <Link
              to="/contacto"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-blue-700 font-medium"
            >
              Formulario de Contacto
            </Link>
            
            <a
              href="mailto:soporte@abogadowilson.com"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-purple-700 font-medium"
            >
              Email de Soporte
            </a>
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Estado del Sistema
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Sitio Web</p>
              <p className="text-xs text-green-600 font-medium">Operativo</p>
            </div>
            
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Base de Datos</p>
              <p className="text-xs text-red-600 font-medium">Problemas</p>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Última actualización: {new Date().toLocaleString('es-ES')}
          </p>
        </div>

        {/* Información de contacto técnica */}
        <div className="mt-8 text-center text-gray-500">
          <p className="mb-2">
            Para reportar problemas técnicos:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a
              href="mailto:tecnico@abogadowilson.com"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              tecnico@abogadowilson.com
            </a>
            <a
              href="https://wa.me/593988352269"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              WhatsApp Técnico: +593 98 883 5269
            </a>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            ID de Error: ERR-{Date.now().toString(36).toUpperCase()}
          </p>
          <p>
            Tiempo: {new Date().toLocaleString('es-ES')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;
