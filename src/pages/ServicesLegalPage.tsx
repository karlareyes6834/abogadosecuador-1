import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ScaleIcon,
  DocumentTextIcon,
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  BanknotesIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckCircleIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  icon: any;
  features: string[];
  popular?: boolean;
  modalities: string[];
}

const ServicesLegalPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'Todos los Servicios', icon: ScaleIcon },
    { id: 'penal', name: 'Derecho Penal', icon: ShieldCheckIcon },
    { id: 'civil', name: 'Derecho Civil', icon: DocumentTextIcon },
    { id: 'laboral', name: 'Derecho Laboral', icon: BriefcaseIcon },
    { id: 'familiar', name: 'Derecho Familiar', icon: UserGroupIcon },
    { id: 'transito', name: 'Tránsito', icon: TruckIcon },
    { id: 'inmobiliario', name: 'Inmobiliario', icon: HomeIcon },
    { id: 'tributario', name: 'Tributario', icon: BanknotesIcon }
  ];

  const services: Service[] = [
    {
      id: '1',
      title: 'Defensa Penal Integral',
      category: 'penal',
      description: 'Representación legal completa en casos penales, desde la investigación hasta el juicio',
      price: 500,
      duration: 'Por caso',
      icon: ShieldCheckIcon,
      features: [
        'Análisis detallado del caso',
        'Estrategia de defensa personalizada',
        'Representación en todas las audiencias',
        'Asesoría 24/7',
        'Recursos y apelaciones'
      ],
      popular: true,
      modalities: ['presencial', 'virtual', 'híbrido']
    },
    {
      id: '2',
      title: 'Divorcio Express',
      category: 'familiar',
      description: 'Proceso de divorcio rápido y eficiente por mutuo acuerdo',
      price: 299,
      duration: '15-30 días',
      icon: HeartIcon,
      features: [
        'Redacción de convenio',
        'Presentación ante juzgado',
        'Seguimiento del proceso',
        'Asesoría sobre bienes',
        'Custodia y pensiones'
      ],
      modalities: ['virtual', 'presencial']
    },
    {
      id: '3',
      title: 'Contratos Civiles',
      category: 'civil',
      description: 'Elaboración y revisión de todo tipo de contratos civiles y comerciales',
      price: 150,
      duration: '3-5 días',
      icon: DocumentTextIcon,
      features: [
        'Redacción personalizada',
        'Revisión legal completa',
        'Cláusulas de protección',
        'Asesoría en negociación',
        'Modificaciones ilimitadas'
      ],
      modalities: ['virtual']
    },
    {
      id: '4',
      title: 'Despido Injustificado',
      category: 'laboral',
      description: 'Defensa de derechos laborales y reclamación de indemnizaciones',
      price: 350,
      duration: 'Por caso',
      icon: BriefcaseIcon,
      features: [
        'Cálculo de liquidación',
        'Demanda laboral',
        'Conciliación',
        'Representación en juicio',
        'Cobro de indemnización'
      ],
      popular: true,
      modalities: ['presencial', 'virtual']
    },
    {
      id: '5',
      title: 'Multas de Tránsito',
      category: 'transito',
      description: 'Apelación y defensa contra multas e infracciones de tránsito',
      price: 99,
      duration: '7-15 días',
      icon: TruckIcon,
      features: [
        'Análisis de la multa',
        'Recursos administrativos',
        'Descuentos y facilidades',
        'Recuperación de puntos',
        'Asesoría preventiva'
      ],
      modalities: ['virtual']
    },
    {
      id: '6',
      title: 'Compraventa Inmuebles',
      category: 'inmobiliario',
      description: 'Asesoría completa en transacciones inmobiliarias',
      price: 450,
      duration: '30-45 días',
      icon: HomeIcon,
      features: [
        'Due diligence legal',
        'Revisión de títulos',
        'Contratos de compraventa',
        'Escrituración',
        'Registro de propiedad'
      ],
      modalities: ['presencial', 'híbrido']
    }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const handleConsultation = (serviceId: string) => {
    toast.success('Redirigiendo a agendar consulta...');
    // Navigate to consultation booking
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-purple-900 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold mb-4"
          >
            Servicios Legales Profesionales
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-blue-100 mb-8"
          >
            Soluciones jurídicas integrales con más de 15 años de experiencia
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/dashboard/consultations" className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
              Agendar Consulta Gratis
            </Link>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-colors">
              Contacto Directo
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Filter */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              <cat.icon className="w-5 h-5" />
              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden group"
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                    POPULAR
                  </div>
                )}

                <div className="p-8">
                  <motion.div
                    animate={{ rotate: hoveredService === service.id ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <service.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">${service.price}</p>
                      <p className="text-sm text-gray-500">{service.duration}</p>
                    </div>
                    <div className="flex gap-1">
                      {service.modalities.map((mod) => (
                        <div key={mod} className="p-2 bg-gray-100 rounded-lg" title={mod}>
                          {mod === 'presencial' && <MapPinIcon className="w-4 h-4 text-gray-600" />}
                          {mod === 'virtual' && <VideoCameraIcon className="w-4 h-4 text-gray-600" />}
                          {mod === 'híbrido' && <ChatBubbleLeftRightIcon className="w-4 h-4 text-gray-600" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                    {service.features.length > 3 && (
                      <p className="text-sm text-blue-600 font-medium">+{service.features.length - 3} más...</p>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConsultation(service.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    Solicitar Consulta
                    <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>

                {/* Hover Effect Background */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredService === service.id ? 0.05 : 0 }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 pointer-events-none"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 py-16"
      >
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">¿Necesitas Asesoría Legal Inmediata?</h2>
          <p className="text-xl mb-8 text-blue-100">Estamos disponibles 24/7 para atender tu caso</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+1234567890"
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <PhoneIcon className="w-5 h-5" />
              Llamar Ahora
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://wa.me/1234567890"
              className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              WhatsApp
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServicesLegalPage;
