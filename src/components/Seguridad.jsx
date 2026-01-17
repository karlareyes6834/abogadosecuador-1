import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserShield, FaServer, FaHandshake, FaExclamationTriangle } from 'react-icons/fa';

const Seguridad = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-blue-800 mb-6 flex items-center"
      >
        <FaShieldAlt className="mr-3 text-blue-600" /> 
        Política de Seguridad
      </motion.h2>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaLock className="mr-2 text-blue-600" />
          Protección de Datos
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            En el Bufete del Abogado Wilson Ipiales, la seguridad de su información es nuestra prioridad. Implementamos rigurosas medidas de protección para garantizar la confidencialidad de todos sus datos personales y legales.
          </p>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Encriptación de Datos</h4>
            <p>
              Utilizamos tecnología de encriptación avanzada para proteger toda la información transmitida entre su dispositivo y nuestros servidores. Esto asegura que sus datos personales y documentos legales permanezcan confidenciales durante la transmisión.
            </p>
          </div>

          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Autenticación Segura</h4>
            <p>
              Nuestro sistema de inicio de sesión implementa métodos de autenticación robustos, incluyendo la verificación en dos pasos cuando está disponible, para garantizar que solo usted pueda acceder a su información.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaUserShield className="mr-2 text-green-600" />
          Privacidad del Cliente
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Confidencialidad Profesional</h4>
            <p>
              Como abogados, estamos legalmente obligados a mantener la confidencialidad de toda la información que nos proporciona. Respetamos estrictamente el secreto profesional y nunca compartimos sus datos con terceros sin su consentimiento explícito, excepto cuando sea requerido por ley.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Acceso Limitado</h4>
            <p>
              Solo el personal autorizado y directamente involucrado en su caso tendrá acceso a su información. Todos nuestros empleados firman acuerdos de confidencialidad y reciben capacitación regular sobre la importancia de la privacidad de los datos.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaServer className="mr-2 text-purple-600" />
          Infraestructura Tecnológica
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Servidores Seguros</h4>
            <p>
              Nuestra infraestructura digital está protegida por firewalls avanzados y sistemas de detección de intrusiones. Realizamos auditorías de seguridad periódicas y mantenemos nuestros sistemas actualizados con los últimos parches de seguridad.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Respaldo de Datos</h4>
            <p>
              Implementamos sistemas de respaldo automático para garantizar que su información esté protegida contra pérdidas accidentales. Todos los respaldos están igualmente encriptados y se almacenan en ubicaciones seguras.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaHandshake className="mr-2 text-yellow-600" />
          Nuestro Compromiso
        </h3>
        
        <div className="space-y-4 text-gray-700">
          <p>
            Nos comprometemos a proteger su información con los más altos estándares de seguridad. Continuamente revisamos y mejoramos nuestras prácticas para adaptarnos a las nuevas amenazas y cumplir con las regulaciones de protección de datos vigentes.
          </p>
          
          <div className="border-l-4 border-yellow-500 pl-4 py-2">
            <h4 className="font-medium text-lg mb-2">Notificación de Brechas</h4>
            <p>
              En el improbable caso de una brecha de seguridad que afecte sus datos personales, nos comprometemos a notificarle de inmediato y tomar todas las medidas necesarias para mitigar cualquier posible daño.
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-800">
              <FaExclamationTriangle className="inline mr-2 text-yellow-600" />
              <span className="font-medium">Aviso importante:</span> Nunca le solicitaremos información sensible como contraseñas o datos bancarios a través de correo electrónico o mensaje de texto. Si recibe una solicitud sospechosa, por favor contáctenos directamente a través de nuestros canales oficiales.
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 font-medium">
              Última actualización de nuestra política de seguridad: Marzo 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seguridad;
