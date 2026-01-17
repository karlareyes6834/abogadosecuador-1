import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BoltIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  VideoCameraIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const QuickConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState('express');
  const [selectedModality, setSelectedModality] = useState('chat');

  const packages = {
    express: {
      name: 'Consulta Express',
      price: 49,
      duration: '15 minutos',
      responseTime: '30 minutos',
      features: [
        'Respuesta en máximo 30 minutos',
        'Asesoría legal básica',
        'Orientación inmediata',
        'Recomendaciones directas',
        'Documento resumen'
      ],
      popular: true
    },
    flash: {
      name: 'Consulta Flash',
      price: 29,
      duration: '10 minutos',
      responseTime: '15 minutos',
      features: [
        'Respuesta ultra rápida',
        'Consulta específica',
        'Sí/No legal inmediato',
        'Orientación básica',
        'Chat directo'
      ],
      popular: false
    },
    urgente: {
      name: 'Consulta Urgente 24h',
      price: 99,
      duration: '30 minutos',
      responseTime: '5 minutos',
      features: [
        'Atención inmediata 24/7',
        'Abogado en línea al instante',
        'Casos urgentes',
        'Asesoría completa',
        'Seguimiento prioritario',
        'Documentos urgentes'
      ],
      popular: false
    }
  };

  const modalities = {
    chat: {
      name: 'Chat en Vivo',
      icon: ChatBubbleLeftRightIcon,
      description: 'Conversación escrita inmediata',
      discount: 0
    },
    video: {
      name: 'Video Llamada',
      icon: VideoCameraIcon,
      description: 'Cara a cara en tiempo real',
      discount: 0
    },
    phone: {
      name: 'Llamada Telefónica',
      icon: PhoneIcon,
      description: 'Llamada directa inmediata',
      discount: -10
    }
  };

  const urgentTopics = [
    'Detención o arresto',
    'Orden judicial urgente',
    'Desalojo inmediato',
    'Accidente de tránsito',
    'Violencia doméstica',
    'Embargo urgente',
    'Despido inmediato',
    'Custodia de menores'
  ];

  const handleAddToCart = () => {
    const selectedPkg = packages[selectedPackage];
    const selectedMod = modalities[selectedModality];
    
    const finalPrice = selectedPkg.price + (selectedPkg.price * selectedMod.discount / 100);
    
    const item = {
      id: `quick-${selectedPackage}-${selectedModality}-${Date.now()}`,
      type: 'consultation',
      category: 'quick',
      name: `${selectedPkg.name} - ${selectedMod.name}`,
      price: Math.max(finalPrice, 0),
      originalPrice: selectedPkg.price,
      duration: selectedPkg.duration,
      responseTime: selectedPkg.responseTime,
      modality: selectedModality,
      features: selectedPkg.features,
      image: '/images/quick-consultation.jpg'
    };

    addToCart(item);
    toast.success('Consulta rápida agregada al carrito');
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <BoltIcon className="w-10 h-10 text-yellow-300" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2 flex items-center">
                Consulta Rápida
                <FireIcon className="w-12 h-12 ml-3 text-yellow-300 animate-pulse" />
              </h1>
              <p className="text-xl text-orange-100">Asesoría legal inmediata para cuando no puedes esperar</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <ClockIcon className="w-8 h-8 mb-2 text-yellow-300" />
              <h3 className="font-semibold">Tiempo de Respuesta</h3>
              <p className="text-2xl font-bold">5-30 min</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <BoltIcon className="w-8 h-8 mb-2 text-yellow-300" />
              <h3 className="font-semibold">Disponibilidad</h3>
              <p className="text-2xl font-bold">24/7</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <StarIcon className="w-8 h-8 mb-2 text-yellow-300" />
              <h3 className="font-semibold">Satisfacción</h3>
              <p className="text-2xl font-bold">99%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-16">
        {/* Urgent Topics */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8">Temas Urgentes que Atendemos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {urgentTopics.map((topic, index) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all"
              >
                <p className="font-semibold text-gray-800">{topic}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Modality Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">¿Cómo Prefieres tu Consulta?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(modalities).map(([key, modality]) => (
              <motion.div
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedModality(key)}
                className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedModality === key 
                    ? 'border-orange-500 bg-orange-50 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <modality.icon className={`w-12 h-12 mb-4 mx-auto ${selectedModality === key ? 'text-orange-600' : 'text-gray-600'}`} />
                <h3 className="font-bold mb-2 text-center text-xl">{modality.name}</h3>
                <p className="text-sm text-gray-600 text-center">{modality.description}</p>
                {modality.discount !== 0 && (
                  <p className={`text-xs font-semibold text-center mt-2 ${modality.discount > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                    {modality.discount > 0 ? `${modality.discount}% descuento` : `${Math.abs(modality.discount)}% recargo`}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Elige tu Velocidad</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(packages).map(([key, pkg]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 ${
                  selectedPackage === key ? 'border-orange-500' : 'border-gray-200'
                } ${pkg.popular ? 'ring-4 ring-orange-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center">
                      <FireIcon className="w-4 h-4 mr-1" />
                      POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-orange-600 mb-2">
                    ${selectedModality && modalities[selectedModality] ? 
                      Math.max(pkg.price + (pkg.price * modalities[selectedModality].discount / 100), 0).toFixed(0) : 
                      pkg.price}
                  </div>
                  {selectedModality && modalities[selectedModality].discount !== 0 && (
                    <div className="text-lg text-gray-500 line-through">${pkg.price}</div>
                  )}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <ClockIcon className="w-5 h-5 text-orange-500" />
                    <span className="text-gray-600">{pkg.duration}</span>
                  </div>
                  <div className="bg-orange-100 rounded-lg p-2 mt-2">
                    <p className="text-sm font-semibold text-orange-800">
                      Respuesta en: {pkg.responseTime}
                    </p>
                  </div>
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
                      ? 'bg-orange-600 text-white' 
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
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center"
          >
            <BoltIcon className="w-5 h-5 mr-2" />
            Consultar Ahora
          </motion.button>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BoltIcon className="w-8 h-8 text-yellow-300 animate-pulse" />
            <h3 className="text-2xl font-bold">¿Es una Emergencia Legal?</h3>
            <BoltIcon className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto mb-6">
            Para situaciones críticas que requieren atención inmediata (arrestos, órdenes judiciales, etc.)
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:+573001234567"
            className="inline-flex items-center bg-white text-red-600 px-8 py-4 rounded-full font-bold hover:bg-red-50 transition-colors"
          >
            <PhoneIcon className="w-6 h-6 mr-2" />
            Llamar Emergencia: +57 300 123 4567
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default QuickConsultationPage;
