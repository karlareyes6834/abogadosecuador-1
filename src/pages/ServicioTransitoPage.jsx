import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TruckIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  MapPinIcon,
  BanknotesIcon,
  UserGroupIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ServicioTransitoPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showEmergency, setShowEmergency] = useState(false);

  const services = [
    {
      id: 'accidentes',
      title: 'Accidentes de Tránsito',
      description: 'Defensa integral en accidentes vehiculares con lesiones o daños',
      price: 600,
      urgency: '24/7',
      features: [
        'Atención inmediata 24/7',
        'Gestión con aseguradoras',
        'Peritaje técnico',
        'Indemnizaciones',
        'Defensa penal si aplica',
        'Recuperación de daños'
      ],
      icon: <ExclamationTriangleIcon className="h-8 w-8" />,
      color: 'from-orange-500 to-orange-600',
      emergency: true,
      popular: true
    },
    {
      id: 'licencias',
      title: 'Licencias y Permisos',
      description: 'Gestión de licencias suspendidas, renovaciones y recursos',
      price: 200,
      urgency: '2-5 días',
      features: [
        'Recuperación de licencias',
        'Recursos administrativos',
        'Renovación de permisos',
        'Cambio de categoría',
        'Homologación internacional',
        'Asesoría completa'
      ],
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'multas',
      title: 'Multas y Citaciones',
      description: 'Impugnación y gestión de multas de tránsito',
      price: 150,
      urgency: '1-3 días',
      features: [
        'Revisión de legalidad',
        'Impugnación de multas',
        'Reducción de sanciones',
        'Convenios de pago',
        'Recursos de apelación',
        'Defensa administrativa'
      ],
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      promo: true,
      discount: '30% OFF'
    },
    {
      id: 'seguros',
      title: 'Reclamos a Seguros',
      description: 'Gestión completa de reclamos con compañías aseguradoras',
      price: 400,
      urgency: '5-10 días',
      features: [
        'Evaluación de pólizas',
        'Reclamos por siniestros',
        'Negociación de montos',
        'Peritajes independientes',
        'Recursos legales',
        'Máxima indemnización'
      ],
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'penal-transito',
      title: 'Defensa Penal Tránsito',
      description: 'Representación en delitos de tránsito con consecuencias penales',
      price: 800,
      urgency: 'Inmediato',
      features: [
        'Defensa en juicio penal',
        'Libertad condicional',
        'Reducción de penas',
        'Acuerdos reparatorios',
        'Medidas sustitutivas',
        'Apelaciones'
      ],
      icon: <ScaleIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      premium: true
    },
    {
      id: 'consulta-express',
      title: 'Consulta Express',
      description: 'Asesoría rápida para casos de tránsito',
      price: 25,
      urgency: '2 horas',
      features: [
        'Respuesta inmediata',
        'Orientación legal',
        'Pasos a seguir',
        'Documentos necesarios'
      ],
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'from-indigo-500 to-indigo-600',
      express: true
    }
  ];

  const emergencySteps = [
    { step: 1, action: 'Mantenga la calma y asegure la escena', icon: '🚨' },
    { step: 2, action: 'Llame a emergencias si hay heridos (911)', icon: '📞' },
    { step: 3, action: 'Tome fotos y videos de todo', icon: '📸' },
    { step: 4, action: 'No admita culpabilidad', icon: '⚠️' },
    { step: 5, action: 'Obtenga datos de testigos', icon: '👥' },
    { step: 6, action: 'Llámenos inmediatamente', icon: '☎️' }
  ];

  const stats = [
    { value: '500+', label: 'Accidentes Resueltos', trend: '+25%' },
    { value: '2M+', label: 'Recuperado en Indemnizaciones', trend: '+40%' },
    { value: '24/7', label: 'Atención de Emergencia', trend: 'Activo' },
    { value: '95%', label: 'Casos Exitosos', trend: '+5%' }
  ];

  const testimonials = [
    {
      name: 'Juan Carlos Pérez',
      case: 'Accidente con lesiones',
      text: 'Me ayudaron desde el primer momento. Recuperé todos los gastos médicos y daños.',
      amount: '$5,000',
      rating: 5
    },
    {
      name: 'María Fernández',
      case: 'Licencia suspendida',
      text: 'Recuperé mi licencia en tiempo récord. Excelente servicio y asesoría.',
      amount: 'Licencia recuperada',
      rating: 5
    },
    {
      name: 'Diego Morales',
      case: 'Reclamo seguro',
      text: 'El seguro no quería pagar. Con su ayuda obtuve la indemnización completa.',
      amount: '$8,500',
      rating: 5
    }
  ];

  const handleEmergency = () => {
    setShowEmergency(true);
    toast.error('¡Atención de Emergencia Activada!', {
      duration: 5000,
      icon: '🚨'
    });
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    if (service.emergency) {
      handleEmergency();
    }
  };

  const handlePayment = (service) => {
    // Create a serializable version of the service object, excluding the icon
    const { icon, ...serializableService } = service;

    navigate('/checkout', { 
      state: { 
        service: serializableService,
        type: 'servicio-transito' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Emergency Banner */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-red-600 text-white py-3 px-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ExclamationTriangleIcon className="h-5 w-5 animate-pulse" />
            <span className="font-semibold">¿Accidente de tránsito? Llámenos AHORA</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = 'tel:+593988835269'}
            className="bg-white text-red-600 px-4 py-1 rounded-full font-bold text-sm hover:bg-red-50"
          >
            📞 EMERGENCIA 24/7
          </motion.button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-orange-900 to-orange-700 text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/30" />
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <TruckIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Especialistas en Derecho de Tránsito</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Derecho de Tránsito
              <span className="block text-3xl md:text-4xl mt-2 text-orange-200">
                Atención 24/7 para Emergencias
              </span>
            </h1>
            
            <p className="text-xl mb-8 max-w-3xl mx-auto text-orange-100">
              Protegemos sus derechos en accidentes, multas y todo tipo de casos de tránsito.
              Máximas indemnizaciones garantizadas.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmergency}
                className="bg-red-500 text-white px-8 py-4 rounded-full font-bold hover:bg-red-600 shadow-lg flex items-center gap-2 animate-pulse"
              >
                <ExclamationTriangleIcon className="h-6 w-6" />
                EMERGENCIA - Tuve un Accidente
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowEmergency(true)}
                className="bg-white text-orange-700 px-8 py-4 rounded-full font-bold hover:bg-orange-50 shadow-lg flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
                Consulta Normal
              </motion.button>
            </div>
          </motion.div>

          {/* Live Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-orange-200">{stat.label}</div>
                <div className="text-xs text-green-300 mt-1">↑ {stat.trend}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Emergency Steps */}
      {showEmergency && (
        <motion.section
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-red-50 border-2 border-red-200 py-8"
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-red-700 mb-6 text-center">
              ⚠️ Pasos Inmediatos en Caso de Accidente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emergencySteps.map((item) => (
                <motion.div
                  key={item.step}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: item.step * 0.1 }}
                  className="flex items-start gap-3 bg-white p-4 rounded-lg shadow"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <span className="font-bold text-red-600">Paso {item.step}:</span>
                    <p className="text-gray-700">{item.action}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+593988835269'}
                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700"
              >
                📞 Llamar Ahora: +593 98 883 5269
              </motion.button>
            </div>
          </div>
        </motion.section>
      )}

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios Especializados en Tránsito
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluciones legales completas para todos los casos de tránsito
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
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer relative group"
              onClick={() => handleServiceSelect(service)}
            >
              {service.emergency && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                  EMERGENCIA 24/7
                </div>
              )}
              {service.popular && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  MÁS SOLICITADO
                </div>
              )}
              {service.discount && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  {service.discount}
                </div>
              )}
              {service.premium && (
                <div className="absolute top-4 right-4 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  PREMIUM
                </div>
              )}
              {service.express && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  EXPRESS
                </div>
              )}
              
              <div className={`h-3 bg-gradient-to-r ${service.color}`} />
              
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                    {service.discount && (
                      <span className="ml-2 text-sm text-gray-500 line-through">${service.price * 1.3}</span>
                    )}
                  </div>
                  <span className="text-sm text-orange-600 font-semibold">{service.urgency}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-orange-600 font-medium pl-7">
                      +{service.features.length - 3} beneficios más...
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
                  {service.emergency ? 'Solicitar Ahora' : 'Contratar Servicio'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Success Cases */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Casos de Éxito Recientes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t border-orange-200 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.case}</p>
                  <div className="mt-2 inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {testimonial.amount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              No Espere Más - El Tiempo es Crucial
            </h2>
            <p className="text-xl mb-8 text-orange-100">
              En casos de tránsito, actuar rápido marca la diferencia
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+593988835269'}
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-orange-50 shadow-lg flex items-center gap-2"
              >
                <PhoneIcon className="h-6 w-6" />
                Llamar Ahora 24/7
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/593988835269?text=Necesito%20ayuda%20con%20un%20caso%20de%20tránsito', '_blank')}
                className="bg-green-500 text-white px-8 py-4 rounded-full font-bold hover:bg-green-600 shadow-lg flex items-center gap-2"
              >
                WhatsApp Directo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicioTransitoPage;
