import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GlobeAltIcon,
  TruckIcon,
  DocumentCheckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  BuildingOfficeIcon,
  ArchiveBoxIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  StarIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ServicioAduaneroPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const services = [
    {
      id: 'importacion',
      title: 'Importación y Despacho',
      description: 'Gestión completa de importaciones y despacho aduanero',
      price: 500,
      duration: '3-5 días',
      features: [
        'Clasificación arancelaria',
        'Liquidación de tributos',
        'Despacho en aduana',
        'Certificados de origen',
        'Permisos especiales',
        'Logística integral',
        'Asesoría tributaria'
      ],
      icon: <GlobeAltIcon className="h-8 w-8" />,
      color: 'from-blue-600 to-blue-700',
      popular: true
    },
    {
      id: 'exportacion',
      title: 'Exportación',
      description: 'Asesoría y gestión para exportaciones internacionales',
      price: 450,
      duration: '2-4 días',
      features: [
        'Documentación exportación',
        'Certificados internacionales',
        'Drawback tributario',
        'Regímenes especiales',
        'Courier internacional',
        'Asesoría logística',
        'Compliance aduanero'
      ],
      icon: <TruckIcon className="h-8 w-8" />,
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'consultoria',
      title: 'Consultoría Aduanera',
      description: 'Asesoría especializada en comercio exterior',
      price: 300,
      duration: 'Por consulta',
      features: [
        'Análisis arancelario',
        'Optimización tributaria',
        'Acuerdos comerciales',
        'Valoración aduanera',
        'Regímenes especiales',
        'Auditoría aduanera',
        'Capacitación'
      ],
      icon: <ClipboardDocumentCheckIcon className="h-8 w-8" />,
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'controversias',
      title: 'Controversias Aduaneras',
      description: 'Defensa en procesos sancionatorios y reclamos',
      price: 800,
      duration: '1-3 meses',
      features: [
        'Recursos administrativos',
        'Defensa en decomiso',
        'Reclamos tributarios',
        'Impugnación de multas',
        'Procesos sancionatorios',
        'Recuperación mercancías',
        'Representación legal'
      ],
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-red-600 to-red-700',
      premium: true
    },
    {
      id: 'regimenes',
      title: 'Regímenes Especiales',
      description: 'Gestión de zonas francas, maquila y depósitos',
      price: 600,
      duration: '5-10 días',
      features: [
        'Zonas francas',
        'Régimen de maquila',
        'Depósitos aduaneros',
        'Admisión temporal',
        'Tránsito aduanero',
        'Reexportación',
        'Beneficios fiscales'
      ],
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      id: 'express',
      title: 'Consulta Express',
      description: 'Respuesta rápida a consultas aduaneras',
      price: 35,
      duration: '24 horas',
      features: [
        'Clasificación rápida',
        'Cálculo de tributos',
        'Requisitos básicos',
        'Orientación inmediata'
      ],
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'from-orange-600 to-orange-700',
      promo: true,
      oldPrice: 50
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handlePayment = (service) => {
    // Create a serializable version of the service object, excluding the icon
    const { icon, ...serializableService } = service;

    navigate('/checkout', { 
      state: { 
        service: serializableService,
        type: 'servicio-aduanero' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 text-white py-24 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Derecho Aduanero
              <span className="block text-3xl md:text-4xl mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-indigo-200">
                Importación • Exportación • Logística
              </span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
              Facilitamos su comercio internacional con expertise aduanero y soluciones integrales
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="bg-white text-blue-700 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Consulta Gratuita
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/593988835269', '_blank')}
                className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                WhatsApp Directo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios Aduaneros Especializados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluciones completas para optimizar su comercio internacional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden cursor-pointer relative group"
              onClick={() => handleServiceSelect(service)}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  POPULAR
                </div>
              )}
              {service.premium && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  PREMIUM
                </div>
              )}
              {service.promo && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                  OFERTA
                </div>
              )}
              
              <div className={`h-3 bg-gradient-to-r ${service.color}`} />
              
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  {service.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">${service.oldPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                  <span className="text-gray-500 text-sm">/ {service.duration}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 4 && (
                    <li className="text-sm text-blue-600 font-medium pl-7">
                      +{service.features.length - 4} beneficios más...
                    </li>
                  )}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePayment(service);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r ${service.color} hover:shadow-lg transition-all`}
                >
                  Contratar Ahora
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedService ? (
              <>
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${selectedService.color} text-white mb-4`}>
                  {selectedService.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{selectedService.title}</h3>
                <p className="text-gray-600 mb-6">{selectedService.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Inversión:</span>
                    <span className="text-2xl font-bold">${selectedService.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiempo:</span>
                    <span className="font-semibold">{selectedService.duration}</span>
                  </div>
                </div>
                
                <h4 className="font-bold mb-3">Incluye:</h4>
                <ul className="space-y-2 mb-6">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handlePayment(selectedService)}
                    className={`flex-1 py-3 bg-gradient-to-r ${selectedService.color} text-white rounded-lg font-semibold hover:shadow-lg`}
                  >
                    Contratar Ahora
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-6">Consulta Aduanera Gratuita</h3>
                
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre o empresa"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <select
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Tipo de operación</option>
                    <option value="importacion">Importación</option>
                    <option value="exportacion">Exportación</option>
                    <option value="consultoria">Consultoría</option>
                    <option value="controversia">Controversia aduanera</option>
                    <option value="regimen">Régimen especial</option>
                  </select>
                  <textarea
                    placeholder="Describa su consulta o necesidad"
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                      onClick={(e) => {
                        e.preventDefault();
                        toast.success('Consulta enviada! Le contactaremos pronto.');
                        setShowModal(false);
                      }}
                    >
                      Enviar Consulta
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ArchiveBoxIcon className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Optimice Su Comercio Internacional
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Reduzca costos, tiempos y riesgos en sus operaciones aduaneras
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+593988835269'}
                className="bg-white text-blue-700 px-8 py-4 rounded-full font-bold hover:bg-blue-50 shadow-lg flex items-center gap-2"
              >
                <PhoneIcon className="h-6 w-6" />
                Llamar Ahora
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/agendar-cita')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 flex items-center gap-2"
              >
                Agendar Reunión
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicioAduaneroPage;
