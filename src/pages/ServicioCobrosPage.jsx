import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaGavel, 
  FaFileContract, 
  FaHandshake,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaPhone,
  FaWhatsapp
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ServicioCobrosPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: 'cobro-basico',
      name: 'Cobro Extrajudicial',
      price: 350,
      description: 'Gestión de cobro mediante notificaciones y negociación directa',
      features: [
        'Notificación legal al deudor',
        'Negociación extrajudicial',
        'Redacción de acuerdos de pago',
        'Seguimiento durante 30 días',
        'Asesoría telefónica incluida'
      ],
      icon: FaHandshake,
      color: 'blue'
    },
    {
      id: 'cobro-judicial',
      name: 'Juicio Ejecutivo',
      price: 500,
      description: 'Proceso judicial para cobro de letras, pagarés y documentos ejecutivos',
      features: [
        'Presentación de demanda ejecutiva',
        'Embargo preventivo de bienes',
        'Representación en todas las audiencias',
        'Seguimiento hasta sentencia',
        'Ejecución de sentencia',
        'Gestión de remate de bienes'
      ],
      icon: FaGavel,
      color: 'purple',
      popular: true
    },
    {
      id: 'cobro-monitorio',
      name: 'Procedimiento Monitorio',
      price: 450,
      description: 'Procedimiento ágil para cobro de deudas líquidas y exigibles',
      features: [
        'Presentación de solicitud monitoria',
        'Obtención rápida de título ejecutivo',
        'Notificación judicial al deudor',
        'Embargo de bienes si no hay pago',
        'Representación en etapa de ejecución',
        'Seguimiento completo del proceso'
      ],
      icon: FaClock,
      color: 'green'
    }
  ];

  const handleAddToCart = (pkg) => {
    if (!user) {
      toast.error('Debes iniciar sesión para contratar servicios');
      navigate('/login');
      return;
    }

    addToCart({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      type: 'service',
      category: 'Cobro de Deudas',
      description: pkg.description
    });

    toast.success(`${pkg.name} agregado al carrito`);
  };

  const handleContactWhatsApp = () => {
    window.open('https://wa.me/593988835269?text=Hola, necesito información sobre servicios de cobro de deudas', '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Cobro de Deudas | Abg. Wilson Ipiales</title>
        <meta name="description" content="Servicios profesionales de cobro de deudas. Juicios ejecutivos, procedimientos monitorios y gestión extrajudicial de cobros." />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 mt-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
              <FaMoneyBillWave className="text-4xl text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Cobro de Deudas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Gestión efectiva y profesional para la recuperación de valores adeudados. 
              Ofrecemos soluciones legales tanto extrajudiciales como judiciales.
            </p>
          </motion.div>

          {/* Packages Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {packages.map((pkg, index) => {
              const Icon = pkg.icon;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                    pkg.popular ? 'ring-4 ring-purple-500 transform scale-105' : ''
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Más Solicitado
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <Icon className={`text-5xl text-${pkg.color}-600 mx-auto mb-4`} />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="text-4xl font-bold text-gray-900">
                      ${pkg.price}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleAddToCart(pkg)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                      pkg.popular
                        ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    Contratar Servicio
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-8 mb-12"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaFileContract className="text-blue-600" />
                Documentos Necesarios
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Documentos que respalden la deuda (contratos, facturas, pagarés, letras de cambio)</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Identificación del deudor (cédula, RUC)</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Detalle de la deuda con montos y fechas</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Información de contacto del deudor</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaShieldAlt className="text-purple-600" />
                Garantías del Servicio
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Análisis previo gratuito de viabilidad</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Transparencia total en costos y procesos</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Seguimiento constante del caso</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                  <span>Informes periódicos del avance</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">¿Necesitas Asesoría Personalizada?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Contáctanos para analizar tu caso específico sin compromiso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleContactWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
              >
                <FaWhatsapp className="text-2xl" />
                Consultar por WhatsApp
              </button>
              <button
                onClick={() => navigate('/contacto')}
                className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg"
              >
                <FaPhone />
                Agendar Consulta
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ServicioCobrosPage;
