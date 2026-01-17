import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BuildingOffice2Icon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ScaleIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  StarIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const ServicioComercialPage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [showConsultation, setShowConsultation] = useState(false);

  const services = [
    {
      id: 'constitucion-empresas',
      title: 'Constitución de Empresas',
      description: 'Creación y registro completo de sociedades y compañías',
      price: 800,
      duration: '5-10 días',
      features: [
        'Elaboración de estatutos',
        'Registro mercantil',
        'RUC y permisos',
        'Apertura cuenta bancaria',
        'Libros societarios',
        'Nombramientos directivos',
        'Asesoría estructura societaria'
      ],
      icon: <BuildingOffice2Icon className="h-8 w-8" />,
      color: 'from-emerald-500 to-emerald-600',
      popular: true
    },
    {
      id: 'contratos-comerciales',
      title: 'Contratos Comerciales',
      description: 'Redacción y revisión de contratos empresariales',
      price: 400,
      duration: '2-3 días',
      features: [
        'Contratos de distribución',
        'Contratos de franquicia',
        'Joint ventures',
        'Confidencialidad (NDA)',
        'Licencias y royalties',
        'Compraventa mercantil',
        'Revisión y negociación'
      ],
      icon: <DocumentTextIcon className="h-8 w-8" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'cobranzas',
      title: 'Cobranzas Judiciales',
      description: 'Recuperación efectiva de deudas comerciales',
      price: '20%',
      duration: '1-6 meses',
      features: [
        'Análisis de documentos',
        'Requerimientos prejudiciales',
        'Demandas ejecutivas',
        'Embargos y retenciones',
        'Negociación de pagos',
        'Recuperación garantizada',
        'Sin costo inicial'
      ],
      icon: <BanknotesIcon className="h-8 w-8" />,
      color: 'from-yellow-500 to-yellow-600',
      percentage: true,
      badge: 'SIN COSTO INICIAL'
    },
    {
      id: 'propiedad-intelectual',
      title: 'Propiedad Intelectual',
      description: 'Registro y protección de marcas, patentes y derechos',
      price: 600,
      duration: '3-6 meses',
      features: [
        'Registro de marcas',
        'Patentes y diseños',
        'Derechos de autor',
        'Nombres comerciales',
        'Defensa contra piratería',
        'Licenciamiento',
        'Vigilancia de marca'
      ],
      icon: <ShieldCheckIcon className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'asesoria-corporativa',
      title: 'Asesoría Corporativa',
      description: 'Consultoría legal empresarial integral',
      price: 1200,
      duration: 'Mensual',
      features: [
        'Asesoría permanente',
        'Juntas y asambleas',
        'Fusiones y adquisiciones',
        'Due diligence',
        'Compliance corporativo',
        'Gobierno corporativo',
        'Reestructuraciones'
      ],
      icon: <ChartBarIcon className="h-8 w-8" />,
      color: 'from-indigo-500 to-indigo-600',
      premium: true
    },
    {
      id: 'consulta-express-comercial',
      title: 'Consulta Express',
      description: 'Asesoría rápida para temas comerciales',
      price: 40,
      duration: '24 horas',
      features: [
        'Respuesta inmediata',
        'Orientación especializada',
        'Documentos modelo',
        'Plan de acción'
      ],
      icon: <ClockIcon className="h-8 w-8" />,
      color: 'from-red-500 to-red-600',
      promo: true,
      oldPrice: 60
    }
  ];

  const industries = [
    { name: 'Tecnología', icon: '💻', cases: 150 },
    { name: 'Comercio', icon: '🛍️', cases: 320 },
    { name: 'Servicios', icon: '🏢', cases: 280 },
    { name: 'Manufactura', icon: '🏭', cases: 180 },
    { name: 'Importación', icon: '📦', cases: 220 },
    { name: 'Startups', icon: '🚀', cases: 95 }
  ];

  const achievements = [
    { value: '$5M+', label: 'Recuperado en cobranzas', icon: <CurrencyDollarIcon className="h-6 w-6" /> },
    { value: '300+', label: 'Empresas constituidas', icon: <BuildingOffice2Icon className="h-6 w-6" /> },
    { value: '150+', label: 'Marcas registradas', icon: <ShieldCheckIcon className="h-6 w-6" /> },
    { value: '98%', label: 'Casos exitosos', icon: <StarIcon className="h-6 w-6" /> }
  ];

  const processFlow = [
    {
      step: 1,
      title: 'Análisis Inicial',
      description: 'Evaluamos sus necesidades comerciales',
      icon: '📋'
    },
    {
      step: 2,
      title: 'Estrategia Legal',
      description: 'Diseñamos la mejor solución legal',
      icon: '⚖️'
    },
    {
      step: 3,
      title: 'Implementación',
      description: 'Ejecutamos todos los procesos necesarios',
      icon: '⚡'
    },
    {
      step: 4,
      title: 'Seguimiento',
      description: 'Acompañamiento continuo post-servicio',
      icon: '✅'
    }
  ];

  const testimonials = [
    {
      company: 'TechSolutions S.A.',
      person: 'Carlos Mendoza, CEO',
      text: 'Nos ayudaron a constituir nuestra empresa en tiempo récord. Excelente servicio.',
      service: 'Constitución de empresa',
      rating: 5
    },
    {
      company: 'Importadora Global',
      person: 'Ana López, Gerente',
      text: 'Recuperamos el 95% de nuestras cuentas por cobrar. Increíble gestión.',
      service: 'Cobranzas judiciales',
      rating: 5
    },
    {
      company: 'Innovate Labs',
      person: 'Miguel Torres, Fundador',
      text: 'Protegieron nuestra marca y patentes. Muy profesionales.',
      service: 'Propiedad intelectual',
      rating: 5
    }
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    toast.success(`Seleccionaste: ${service.title}`);
  };

  const handlePayment = (service) => {
    // Create a serializable version of the service object, excluding the icon
    const { icon, ...serializableService } = service;

    navigate('/checkout', { 
      state: { 
        service: serializableService,
        type: 'servicio-comercial' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-700 text-white py-24 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <motion.div
            animate={{ 
              rotate: 360
            }}
            transition={{ 
              duration: 50,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -right-40 -top-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360
            }}
            transition={{ 
              duration: 40,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -left-40 -bottom-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
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
              <BriefcaseIcon className="h-5 w-5" />
              <span className="text-sm font-semibold">Expertos en Derecho Empresarial</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-100 to-white">
              Derecho Comercial y Corporativo
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-emerald-100">
              Impulsamos el crecimiento de su empresa con soluciones legales estratégicas
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConsultation(true)}
                className="bg-white text-emerald-700 px-8 py-4 rounded-full font-semibold hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Consulta Empresarial Gratuita
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://wa.me/593988835269', '_blank')}
                className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-all shadow-lg flex items-center gap-2"
              >
                <PhoneIcon className="h-5 w-5" />
                WhatsApp Business
              </motion.button>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-md rounded-lg p-4"
                >
                  <div className="flex justify-center text-emerald-200 mb-2">
                    {achievement.icon}
                  </div>
                  <div className="text-3xl font-bold">{achievement.value}</div>
                  <div className="text-sm text-emerald-200">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Industries We Serve */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-center text-lg font-semibold text-gray-600 mb-6">
            Industrias que Atendemos
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{industry.icon}</div>
                <div className="font-semibold text-gray-900">{industry.name}</div>
                <div className="text-sm text-gray-500">{industry.cases} casos</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Servicios Legales Comerciales
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Soluciones completas para el éxito de su empresa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer relative group"
              onClick={() => handleServiceSelect(service)}
            >
              {service.popular && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  MÁS SOLICITADO
                </div>
              )}
              {service.badge && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
                  {service.badge}
                </div>
              )}
              {service.premium && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  PREMIUM
                </div>
              )}
              {service.promo && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  OFERTA
                </div>
              )}
              
              <div className={`h-3 bg-gradient-to-r ${service.color} group-hover:h-4 transition-all`} />
              
              <div className="p-6">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-baseline gap-2 mb-4">
                  {service.oldPrice && (
                    <span className="text-lg text-gray-400 line-through">${service.oldPrice}</span>
                  )}
                  <span className="text-3xl font-bold text-gray-900">
                    {service.percentage ? service.price : `$${service.price}`}
                  </span>
                  {service.percentage && (
                    <span className="text-sm text-gray-600">del monto recuperado</span>
                  )}
                  {!service.percentage && (
                    <span className="text-gray-500 text-sm">/ {service.duration}</span>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 4 && (
                    <li className="text-sm text-emerald-600 font-medium pl-7">
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
                  className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${service.color} hover:shadow-lg transition-all`}
                >
                  Contratar Ahora
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Nuestro Proceso de Trabajo
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processFlow.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < processFlow.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-emerald-300 to-teal-300" />
                )}
                
                <div className="text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg text-4xl mb-4"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    Paso {item.step}: {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Empresas que Confían en Nosotros
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-gradient-to-br from-white to-emerald-50 p-6 rounded-xl shadow-lg border border-emerald-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                
                <div className="border-t border-emerald-200 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.company}</p>
                  <p className="text-sm text-gray-600">{testimonial.person}</p>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">{testimonial.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Modal */}
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
            <h3 className="text-2xl font-bold mb-6">Consulta Empresarial Gratuita</h3>
            
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la empresa"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Su nombre"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Correo corporativo"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Tipo de consulta</option>
                <option value="constitucion">Constitución de empresa</option>
                <option value="contratos">Contratos comerciales</option>
                <option value="cobranzas">Cobranzas</option>
                <option value="propiedad">Propiedad intelectual</option>
                <option value="asesoria">Asesoría corporativa</option>
              </select>
              <textarea
                placeholder="Describa su necesidad legal"
                rows={4}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
                  className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.success('Consulta enviada! Le contactaremos pronto.');
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
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <BriefcaseIcon className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Hagamos Crecer Su Empresa Juntos
            </h2>
            <p className="text-xl mb-8 text-emerald-100">
              Soluciones legales que impulsan el éxito empresarial
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = 'tel:+593988835269'}
                className="bg-white text-emerald-600 px-8 py-4 rounded-full font-bold hover:bg-emerald-50 shadow-lg flex items-center gap-2"
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
                <EnvelopeIcon className="h-6 w-6" />
                Agendar Reunión
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicioComercialPage;
