import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ScaleIcon, 
  ShieldCheckIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
  StarIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ServicioPenalPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showConsultation, setShowConsultation] = useState(false);

  const services = [
    {
      id: 'defensa-penal',
      title: 'Defensa Penal Integral',
      description: 'Representación legal completa en procesos penales',
      price: 1200,
      features: [
        'Análisis exhaustivo del caso',
        'Representación en todas las etapas',
        'Preparación de estrategia de defensa',
        'Acompañamiento 24/7',
        'Gestión de evidencias',
        'Apelaciones incluidas'
      ],
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      popular: true
    },
    {
      id: 'delitos-propiedad',
      title: 'Delitos Contra la Propiedad',
      description: 'Defensa especializada en robos, hurtos y estafas',
      price: 800,
      features: [
        'Evaluación de pruebas',
        'Negociación con fiscalía',
        'Reducción de penas',
        'Medidas alternativas',
        'Seguimiento del caso'
      ],
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'delitos-economicos',
      title: 'Delitos Económicos',
      description: 'Casos de fraude, lavado de dinero y delitos financieros',
      price: 1500,
      features: [
        'Análisis financiero forense',
        'Defensa corporativa',
        'Compliance penal',
        'Negociación de acuerdos',
        'Protección de activos'
      ],
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'consulta-rapida',
      title: 'Consulta Penal Express',
      description: 'Asesoría inmediata para casos urgentes',
      price: 50,
      features: [
        'Respuesta en 24 horas',
        'Evaluación preliminar',
        'Orientación legal',
        'Documentos básicos',
        'Seguimiento inicial'
      ],
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      promo: true
    }
  ];

  const caseTypes = [
    { name: 'Homicidios', success: '85%', cases: 45 },
    { name: 'Robos', success: '92%', cases: 120 },
    { name: 'Estafas', success: '88%', cases: 78 },
    { name: 'Violencia', success: '90%', cases: 56 },
    { name: 'Drogas', success: '75%', cases: 34 },
    { name: 'Fraude', success: '82%', cases: 67 }
  ];

  const testimonials = [
    {
      name: 'Carlos Mendoza',
      case: 'Caso de defensa personal',
      text: 'Excelente defensa, lograron demostrar mi inocencia. Profesionalismo total.',
      rating: 5,
      result: 'Absuelto'
    },
    {
      name: 'María González',
      case: 'Fraude empresarial',
      text: 'Me ayudaron a resolver un caso complejo con gran dedicación.',
      rating: 5,
      result: 'Caso archivado'
    },
    {
      name: 'Roberto Silva',
      case: 'Delito de tránsito',
      text: 'Redujeron significativamente mi sentencia. Muy agradecido.',
      rating: 5,
      result: 'Pena reducida'
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    toast.success(`Seleccionaste: ${service.title}`);
  };

  const handleConsultation = () => {
    setShowConsultation(true);
    toast.success('Preparando formulario de consulta...');
  };

  const handlePayment = (service) => {
    // Create a serializable version of the service object, excluding the icon
    const { icon, ...serializableService } = service;

    navigate('/checkout', { 
      state: { 
        service: serializableService,
        type: 'servicio-penal' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-red-900 to-red-700 text-white py-24"
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Defensa Penal Especializada
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Más de 15 años defendiendo sus derechos con éxito comprobado.
              Estamos disponibles 24/7 para casos urgentes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleConsultation}
                className="bg-white text-red-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Consulta Gratuita
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/593988835269', '_blank')}
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                WhatsApp Directo
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold">500+</div>
              <div className="text-sm opacity-90">Casos Resueltos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">87%</div>
              <div className="text-sm opacity-90">Tasa de Éxito</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">24/7</div>
              <div className="text-sm opacity-90">Disponibilidad</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">15+</div>
              <div className="text-sm opacity-90">Años Experiencia</div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nuestros Servicios Penales
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Seleccione el servicio que mejor se adapte a su situación legal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer ${
                selectedService?.id === service.id ? 'ring-4 ring-red-500' : ''
              }`}
              onClick={() => handleServiceSelect(service)}
            >
              {service.popular && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-semibold">
                  MÁS POPULAR
                </div>
              )}
              {service.promo && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold animate-pulse">
                  PROMOCIÓN
                </div>
              )}
              
              <div className={`h-2 bg-gradient-to-r ${service.color}`} />
              
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                  <span className="text-gray-500 text-sm">/caso</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
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

      {/* Case Types Success Rates */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestras Tasas de Éxito por Tipo de Caso
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {caseTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="36"
                      stroke="#ef4444"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(parseInt(type.success) / 100) * 226} 226`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{type.success}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-500">{type.cases} casos</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Casos de Éxito
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.case}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {testimonial.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Form Modal */}
      {showConsultation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowConsultation(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">Solicitar Consulta Gratuita</h3>
            
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              <textarea
                placeholder="Describa brevemente su caso"
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowConsultation(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Consulta enviada! Nos contactaremos pronto.');
                    setShowConsultation(false);
                  }}
                >
                  Enviar Consulta
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Necesita Defensa Legal Inmediata?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Estamos disponibles 24/7. No espere más, cada minuto cuenta.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = 'tel:+593988835269'}
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 flex items-center gap-2"
            >
              <PhoneIcon className="h-5 w-5" />
              Llamar Ahora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/contacto')}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 flex items-center gap-2"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Contactar por Email
            </motion.button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicioPenalPage;
