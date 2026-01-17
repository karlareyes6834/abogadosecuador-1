import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon,
  HomeIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  VideoCameraIcon,
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const CivilConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState('basico');
  const [selectedModality, setSelectedModality] = useState('virtual');

  const packages = {
    basico: {
      name: 'Consulta Básica Civil',
      price: 79,
      duration: '45 minutos',
      features: [
        'Análisis de situación legal',
        'Orientación sobre procedimientos',
        'Revisión básica de documentos',
        'Recomendaciones iniciales',
        'Seguimiento por email (5 días)'
      ],
      popular: false
    },
    completo: {
      name: 'Asesoría Completa Civil',
      price: 149,
      duration: '75 minutos',
      features: [
        'Todo lo de consulta básica',
        'Análisis detallado de contratos',
        'Estrategia legal específica',
        'Redacción de cartas y documentos',
        'Plan de acción detallado',
        'Seguimiento por 10 días',
        'Una consulta adicional gratis'
      ],
      popular: true
    },
    premium: {
      name: 'Gestión Procesal Civil',
      price: 399,
      duration: 'Proceso completo',
      features: [
        'Todo lo anterior incluido',
        'Representación judicial',
        'Redacción de demandas',
        'Gestión procesal completa',
        'Seguimiento continuo',
        'Equipo legal especializado',
        'Garantía hasta sentencia'
      ],
      popular: false
    }
  };

  const modalities = {
    virtual: {
      name: 'Consulta Virtual',
      icon: VideoCameraIcon,
      description: 'Videollamada segura y confidencial',
      discount: 0
    },
    presencial: {
      name: 'Consulta Presencial',
      icon: MapPinIcon,
      description: 'En nuestras oficinas con cita previa',
      discount: 0
    },
    telefonica: {
      name: 'Consulta Telefónica',
      icon: PhoneIcon,
      description: 'Llamada directa especializada',
      discount: 15
    },
    express: {
      name: 'Consulta Express',
      icon: ChatBubbleLeftRightIcon,
      description: 'Respuesta en menos de 2 horas',
      discount: -25
    }
  };

  const civilServices = [
    'Contratos y obligaciones',
    'Responsabilidad civil',
    'Derecho de propiedad',
    'Sucesiones y herencias',
    'Derecho de familia',
    'Arrendamientos',
    'Daños y perjuicios',
    'Prescripción adquisitiva'
  ];

  const handleAddToCart = () => {
    const selectedPkg = packages[selectedPackage];
    const selectedMod = modalities[selectedModality];
    
    const finalPrice = selectedPkg.price + (selectedPkg.price * selectedMod.discount / 100);
    
    const item = {
      id: `civil-${selectedPackage}-${selectedModality}-${Date.now()}`,
      type: 'consultation',
      category: 'civil',
      name: `${selectedPkg.name} - ${selectedMod.name}`,
      price: Math.max(finalPrice, 0),
      originalPrice: selectedPkg.price,
      duration: selectedPkg.duration,
      modality: selectedModality,
      features: selectedPkg.features,
      image: '/images/civil-consultation.jpg'
    };

    addToCart(item);
    toast.success('Consulta civil agregada al carrito');
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <DocumentTextIcon className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Consulta Legal Civil</h1>
              <p className="text-xl text-blue-100">Especialistas en derecho civil y comercial con enfoque personalizado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <DocumentTextIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Contratos Revisados</h3>
              <p className="text-2xl font-bold">2,500+</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <HomeIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Casos Inmobiliarios</h3>
              <p className="text-2xl font-bold">800+</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <BanknotesIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Satisfacción</h3>
              <p className="text-2xl font-bold">98%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Services */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Áreas de Especialización Civil</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {civilServices.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-lg border-2 border-blue-200 hover:border-blue-400 transition-all"
              >
                <p className="font-semibold text-gray-800">{service}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modality Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Modalidad de Consulta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modalities).map(([key, modality]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModality(key)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedModality === key 
                    ? 'border-blue-500 bg-blue-50 shadow-lg' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <modality.icon className={`w-8 h-8 mb-3 ${selectedModality === key ? 'text-blue-600' : 'text-gray-600'}`} />
                <h3 className="font-bold mb-2">{modality.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{modality.description}</p>
                {modality.discount !== 0 && (
                  <p className={`text-xs font-semibold ${modality.discount > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {modality.discount > 0 ? `${modality.discount}% descuento` : `${Math.abs(modality.discount)}% recargo`}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Selecciona tu Paquete</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(packages).map(([key, pkg]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 ${
                  selectedPackage === key ? 'border-blue-500' : 'border-gray-200'
                } ${pkg.popular ? 'ring-4 ring-blue-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      RECOMENDADO
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    ${selectedModality && modalities[selectedModality] ? 
                      Math.max(pkg.price + (pkg.price * modalities[selectedModality].discount / 100), 0).toFixed(0) : 
                      pkg.price}
                  </div>
                  {selectedModality && modalities[selectedModality].discount !== 0 && (
                    <div className="text-lg text-gray-500 line-through">${pkg.price}</div>
                  )}
                  <p className="text-gray-600">{pkg.duration}</p>
                </div>

                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPackage(key)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    selectedPackage === key 
                      ? 'bg-blue-600 text-white' 
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Reservar Consulta
          </motion.button>
        </motion.div>

        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <StarIcon className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold">Compromiso con la Excelencia</h3>
            <StarIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Más de 15 años resolviendo casos civiles con un enfoque personalizado y resultados efectivos. 
            Tu éxito legal es nuestra misión.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CivilConsultationPage;
