import React from 'react';
import { Shield, Lock, AlertCircle, CheckCircle, Eye, EyeOff, Key, Server } from 'lucide-react';

const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Seguridad y Protección
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Conoce cómo protegemos tu información y datos personales
          </p>
        </div>

        {/* Security Measures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Encryption */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Lock className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Encriptación
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Todos los datos se transmiten usando encriptación SSL/TLS de 256 bits. Tus contraseñas se almacenan con hash seguro usando bcrypt.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Certificado SSL válido
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Encriptación de extremo a extremo
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Hash seguro de contraseñas
              </li>
            </ul>
          </div>

          {/* Authentication */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Key className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Autenticación
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Utilizamos autenticación de dos factores (2FA) y tokens JWT seguros para proteger tu cuenta.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Autenticación de dos factores
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Tokens JWT con expiración
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Sesiones seguras
              </li>
            </ul>
          </div>

          {/* Data Protection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Server className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Protección de Datos
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No compartimos tu información con terceros. Cumplimos con todas las normativas de protección de datos.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                GDPR compliant
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Backups automáticos
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Auditorías de seguridad
              </li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-8 h-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Privacidad
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Tu privacidad es nuestra prioridad. Puedes controlar qué información compartir en tu perfil.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Control de privacidad
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Derecho al olvido
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                Exportar tus datos
              </li>
            </ul>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recomendaciones de Seguridad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Contraseña Fuerte
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Usa una contraseña única con al menos 12 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Autenticación de Dos Factores
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Activa 2FA en tu cuenta para una protección adicional contra accesos no autorizados.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Conexión Segura
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Siempre accede desde conexiones seguras. Evita redes WiFi públicas sin protección.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Cierra Sesión
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Cierra sesión cuando termines, especialmente en dispositivos compartidos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ¿Preocupaciones de Seguridad?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Si tienes alguna preocupación sobre seguridad, contacta con nuestro equipo de soporte inmediatamente.
          </p>
          <a
            href="mailto:seguridad@abogadowilson.com"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Reportar Problema de Seguridad
          </a>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;
