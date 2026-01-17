import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ComputerDesktopIcon,
  VideoCameraIcon,
  MapPinIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const DigitalConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState('virtual');
  const [selectedModality, setSelectedModality] = useState('video');

  const packages = {
    digital: {
      name: 'Consulta 100% Digital',
      price: 59,
      duration: '45 minutos',
      features: [
        'Plataforma digital segura',
        'Documentos digitales',
        'Grabación de sesión',
        'Chat en tiempo real',
        'Seguimiento por app',
        'Disponible 24/7'
      ],
      popular: false,
      icon: ComputerDesktopIcon
    },
    virtual: {
      name: 'Consulta Virtual Premium',
      price: 89,
      duration: '60 minutos',
      features: [
        'Videollamada HD profesional',
        'Compartir pantalla',
        'Documentos en tiempo real',
        'Grabación automática',
        'Asistente IA integrado',
        'Seguimiento personalizado',
        'Certificados digitales'
      ],
      popular: true,
      icon: VideoCameraIcon
    },
    presencial: {
      name: 'Consulta Presencial',
      price: 129,
      duration: '75 minutos',
      features: [
        'Cita en nuestras oficinas',
        'Atención personalizada cara a cara',
        'Revisión física de documentos',
        'Ambiente profesional',
        'Café y comodidades',
        'Estacionamiento gratuito',
        'Protocolo de bioseguridad'
      ],
      popular: false,
      icon: MapPinIcon
    },
    hibrida: {
      name: 'Consulta Híbrida',
      price: 109,
      duration: '90 minutos',
      features: [
        'Combinación virtual + presencial',
        'Flexibilidad total',
        'Seguimiento continuo',
        'Múltiples canales',
        'Documentos físicos y digitales',
        'Mayor tiempo de consulta',
        'Soporte integral'
      ],
      popular: false,
      icon: GlobeAltIcon
    }
  };

  const modalities = {
    video: {
      name: 'Videollamada',
      icon: VideoCameraIcon,
      description: 'Reunión cara a cara por video HD',
      availability: '24/7',
      discount: 0
    },
    phone: {
      name: 'Llamada Telefónica',
      icon: PhoneIcon,
      description: 'Conversación directa por teléfono',
      availability: '24/7',
      discount: 15
    },
    chat: {
      name: 'Chat Especializado',
      icon: ChatBubbleLeftRightIcon,
      description: 'Mensaje instantáneo con abogado',
      availability: '24/7',
      discount: 25
    },
    mobile: {
      name: 'App Móvil',
      icon: DevicePhoneMobileIcon,
      description: 'Consulta desde tu smartphone',
      availability: '24/7',
      discount: 10
    }
  };

  const digitalServices = [
    'Firma electrónica de documentos',
    'Consultas por videollamada',
    'Revisión digital de contratos',
    'Asesoría vía chat especializado',
    'Documentos legales digitales',
    'Plataforma segura y cifrada',
    'Historial digital completo',
    'Notificaciones automáticas'
  ];

  const handleAddToCart = () => {
    const selectedPkg = packages[selectedPackage];
    const selectedMod = modalities[selectedModality];
    
    const finalPrice = selectedPkg.price - (selectedPkg.price * selectedMod.discount / 100);
    
    const item = {
      id: `digital-${selectedPackage}-${selectedModality}-${Date.now()}`,
      type: 'consultation',
      category: 'digital',
      name: `${selectedPkg.name} - ${selectedMod.name}`,
      price: Math.max(finalPrice, 0),
      originalPrice: selectedPkg.price,
      duration: selectedPkg.duration,
      modality: selectedModality,
      features: selectedPkg.features,
      image: '/images/digital-consultation.jpg'
    };

    addToCart(item);
    toast.success('Consulta digital agregada al carrito');
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <ComputerDesktopIcon className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Consulta Digital Legal</h1>
              <p className="text-xl text-cyan-100">La nueva era de servicios legales: digital, virtual y presencial</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <ShieldCheckIcon className="w-8 h-8 mb-2 text-cyan-300" />
              <h3 className="font-semibold">Seguridad Digital</h3>
              <p className="text-2xl font-bold">256-bit</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <ClockIcon className="w-8 h-8 mb-2 text-cyan-300" />
              <h3 className="font-semibold">Disponibilidad</h3>
              <p className="text-2xl font-bold">24/7</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <GlobeAltIcon className="w-8 h-8 mb-2 text-cyan-300" />
              <h3 className="font-semibold">Cobertura</h3>
              <p className="text-2xl font-bold">Global</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Digital Services */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Servicios Legales Digitales</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {digitalServices.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-lg border-2 border-cyan-200 hover:border-cyan-400 transition-all"
              >
                <p className="font-semibold text-gray-800">{service}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modality Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Canal de Comunicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modalities).map(([key, modality]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModality(key)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedModality === key 
                    ? 'border-cyan-500 bg-cyan-50 shadow-lg' 
                    : 'border-gray-200 hover:border-cyan-300'
                }`}
              >
                <modality.icon className={`w-8 h-8 mb-3 ${selectedModality === key ? 'text-cyan-600' : 'text-gray-600'}`} />
                <h3 className="font-bold mb-2">{modality.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{modality.description}</p>
                <p className="text-xs text-green-600 mb-2">Disponible {modality.availability}</p>
                {modality.discount > 0 && (
                  <p className="text-xs font-semibold text-green-600">
                    {modality.discount}% descuento
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Elige tu Modalidad de Consulta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(packages).map(([key, pkg]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl shadow-xl p-6 border-2 ${
                  selectedPackage === key ? 'border-cyan-500' : 'border-gray-200'
                } ${pkg.popular ? 'ring-4 ring-cyan-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold">
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <pkg.icon className="w-12 h-12 mx-auto mb-3 text-cyan-600" />
                  <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-cyan-600 mb-2">
                    ${selectedModality && modalities[selectedModality] ? 
                      Math.max(pkg.price - (pkg.price * modalities[selectedModality].discount / 100), 0).toFixed(0) : 
                      pkg.price}
                  </div>
                  {selectedModality && modalities[selectedModality].discount > 0 && (
                    <div className="text-lg text-gray-500 line-through">${pkg.price}</div>
                  )}
                  <p className="text-gray-600">{pkg.duration}</p>
                </div>

                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPackage(key)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    selectedPackage === key 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {selectedPackage === key ? 'Seleccionado' : 'Seleccionar'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
          >
            Agregar al Carrito
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Reservar Consulta
          </motion.button>
        </motion.div>

        {/* Digital Security */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-cyan-200" />
            <h3 className="text-2xl font-bold">Seguridad y Privacidad Garantizada</h3>
            <ShieldCheckIcon className="w-8 h-8 text-cyan-200" />
          </div>
          <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
            Todas nuestras consultas digitales utilizan encriptación de nivel bancario. 
            Tu información está protegida con los más altos estándares de seguridad digital.
          </p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">256-bit</p>
              <p className="text-sm text-cyan-200">Encriptación SSL</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">GDPR</p>
              <p className="text-sm text-cyan-200">Cumplimiento</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">ISO 27001</p>
              <p className="text-sm text-cyan-200">Certificado</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalConsultationPage;
