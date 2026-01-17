import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentTextIcon,
  UserGroupIcon,
  ScaleIcon,
  BriefcaseIcon,
  HeartIcon,
  DocumentDuplicateIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ServicioCivilPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const services = [
    {
      id: 'divorcios',
      title: 'Divorcios y Separaciones',
      description: 'Asesoría completa en procesos de divorcio consensual y contencioso',
      price: 500,
      duration: '2-6 meses',
      features: [
        'Divorcio de mutuo acuerdo',
        'Divorcio contencioso',
        'División de bienes',
        'Custodia de hijos',
        'Pensión alimenticia',
        'Régimen de visitas'
      ],
      icon: <HeartIcon className="h-8 w-8" />,
      color: 'from-pink-500 to-pink-600',
      popular: true
    },
    {
      id: 'contratos',
      title: 'Contratos y Convenios',
      description: 'Redacción y revisión de todo tipo de contratos civiles',
      price: 200,
      duration: '3-5 días',
      features: [
        'Contratos de compraventa',
        'Contratos de arrendamiento',
        'Contratos de préstamo',
        'Convenios privados',
        'Revisión legal completa',
        'Asesoría en negociación'
      ],
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'herencias',
      title: 'Sucesiones y Herencias',
      description: 'Gestión integral de procesos sucesorios y testamentarios',
      price: 800,
      duration: '3-8 meses',
      features: [
        'Declaratoria de herederos',
        'Partición de bienes',
        'Testamentos',
        'Posesión efectiva',
        'Inventario de bienes',
        'Resolución de conflictos'
      ],
      icon: <DocumentDuplicateIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'inmobiliario',
      title: 'Derecho Inmobiliario',
      description: 'Asesoría en compraventa y gestión de propiedades',
      price: 600,
      duration: '1-3 meses',
      features: [
        'Compraventa de inmuebles',
        'Estudios de títulos',
        'Constitución de hipotecas',
        'Prescripción adquisitiva',
        'Desalojos',
        'Registro de propiedades'
      ],
      icon: <BuildingOfficeIcon className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      badge: 'ALTA DEMANDA'
    },
    {
      id: 'familia',
      title: 'Derecho de Familia',
      description: 'Protección integral de los derechos familiares',
      price: 400,
      duration: '1-4 meses',
      features: [
        'Adopciones',
        'Tutelas y curatelas',
        'Unión de hecho',
        'Violencia intrafamiliar',
        'Alimentos',
        'Patria potestad'
      ],
      icon: <UserGroupIcon className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'consulta-express',
      title: 'Consulta Civil Express',
      description: 'Asesoría rápida para consultas civiles puntuales',
      price: 30,
      duration: '24 horas',
      features: [
        'Respuesta en 24 horas',
        'Orientación legal básica',
        'Análisis preliminar',
        'Recomendaciones',
        'Documentos modelo'
      ],
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'from-indigo-500 to-indigo-600',
      promo: true,
      oldPrice: 50
    }
  ];

  const stats = [
    { label: 'Casos Resueltos', value: '1,200+', icon: <CheckCircleIcon className="h-6 w-6" /> },
    { label: 'Clientes Satisfechos', value: '98%', icon: <StarIcon className="h-6 w-6" /> },
    { label: 'Años de Experiencia', value: '15+', icon: <BriefcaseIcon className="h-6 w-6" /> },
    { label: 'Respuesta Promedio', value: '2 hrs', icon: <ClockIcon className="h-6 w-6" /> }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Consulta Inicial',
      description: 'Evaluamos su caso y definimos la estrategia legal más conveniente'
    },
    {
      number: '02',
      title: 'Documentación',
      description: 'Preparamos y revisamos toda la documentación necesaria'
    },
    {
      number: '03',
      title: 'Gestión Legal',
      description: 'Realizamos todos los trámites y representación necesaria'
    },
    {
      number: '04',
      title: 'Resolución',
      description: 'Finalizamos el proceso con resultados favorables para usted'
    }
  ];

  const testimonials = [
    {
      name: 'Ana Martínez',
      case: 'Divorcio consensual',
      text: 'Proceso rápido y sin complicaciones. Excelente asesoría en todo momento.',
      rating: 5,
      time: 'Hace 2 semanas'
    },
    {
      name: 'Pedro Rodríguez',
      case: 'Compraventa inmueble',
      text: 'Me ayudaron con toda la documentación. Muy profesionales y confiables.',
      rating: 5,
      time: 'Hace 1 mes'
    },
    {
      name: 'Laura Jiménez',
      case: 'Herencia familiar',
      text: 'Resolvieron un caso complejo de herencia. Muy satisfecha con el resultado.',
      rating: 5,
      time: 'Hace 3 semanas'
    }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handlePayment = (service) => {
    // Create a serializable version of the service object, excluding the icon
    const { icon, ...serializableService } = service;

    navigate('/checkout', { 
      state: { 
        service: serializableService,
        type: 'servicio-civil' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Derecho Civil Integral
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
              Soluciones legales expertas para proteger sus derechos civiles y patrimonio familiar
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
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

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4"
                >
                  <div className="flex items-center justify-center text-blue-200 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </motion.div>
              ))}
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
            Servicios de Derecho Civil
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluciones legales completas adaptadas a sus necesidades específicas
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
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer group"
              onClick={() => handleServiceClick(service)}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  POPULAR
                </div>
              )}
              {service.badge && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                  {service.badge}
                </div>
              )}
              {service.promo && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
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
                
                <div className="flex items-baseline gap-2 mb-2">
                  {service.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">${service.oldPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">${service.price}</span>
                  <span className="text-gray-500">/ {service.duration}</span>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-sm text-blue-600 font-medium">
                      +{service.features.length - 3} más beneficios...
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

      {/* Process Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestro Proceso de Trabajo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-300" />
                )}
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-3xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Lo Que Dicen Nuestros Clientes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.case}</p>
                  <p className="text-xs text-gray-400 mt-1">{testimonial.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Precio:</span>
                    <span className="text-2xl font-bold">${selectedService.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiempo estimado:</span>
                    <span className="font-semibold">{selectedService.duration}</span>
                  </div>
                </div>
                
                <h4 className="font-bold mb-3">Incluye:</h4>
                <ul className="space-y-2 mb-6">
                  {selectedService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
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
                <h3 className="text-2xl font-bold mb-6">Solicitar Consulta Gratuita</h3>
                
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nombre completo"
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
                    <option value="">Seleccione el tipo de caso</option>
                    <option value="divorcio">Divorcio</option>
                    <option value="herencia">Herencia</option>
                    <option value="contrato">Contratos</option>
                    <option value="inmueble">Inmuebles</option>
                    <option value="familia">Familia</option>
                    <option value="otro">Otro</option>
                  </select>
                  <textarea
                    placeholder="Describa brevemente su caso"
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
                        toast.success('Consulta enviada! Nos contactaremos en breve.');
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
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Necesita Asesoría Legal Civil?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Resolvemos sus problemas legales con experiencia y dedicación
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+593988835269'}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-blue-50 shadow-lg flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                Llamar Ahora
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/agendar-cita')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 flex items-center gap-2"
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                Agendar Cita
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicioCivilPage;
