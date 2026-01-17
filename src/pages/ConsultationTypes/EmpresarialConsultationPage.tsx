import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  VideoCameraIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const EmpresarialConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedPackage, setSelectedPackage] = useState('startup');
  const [selectedModality, setSelectedModality] = useState('virtual');

  const packages = {
    startup: {
      name: 'Consulta Startup',
      price: 149,
      duration: '60 minutos',
      features: [
        'Constitución de empresa',
        'Elección de tipo societario',
        'Requisitos legales básicos',
        'Registro mercantil',
        'Asesoría fiscal inicial',
        'Kit de documentos básicos'
      ],
      popular: false
    },
    pyme: {
      name: 'Asesoría PYME',
      price: 249,
      duration: '90 minutos',
      features: [
        'Todo lo de consulta startup',
        'Contratos comerciales',
        'Políticas de empresa',
        'Compliance básico',
        'Asesoría laboral',
        'Protección de datos',
        'Seguimiento 30 días'
      ],
      popular: true
    },
    corporativo: {
      name: 'Consultoría Corporativa',
      price: 499,
      duration: 'Servicio integral',
      features: [
        'Todo lo anterior incluido',
        'Due diligence completo',
        'Contratos complejos',
        'Fusiones y adquisiciones',
        'Compliance avanzado',
        'Asesoría continua',
        'Equipo multidisciplinario'
      ],
      popular: false
    }
  };

  const modalities = {
    virtual: {
      name: 'Consulta Virtual',
      icon: VideoCameraIcon,
      description: 'Videollamada con presentación de documentos',
      discount: 0
    },
    presencial: {
      name: 'En tus Oficinas',
      icon: MapPinIcon,
      description: 'Visitamos tu empresa para consulta in-situ',
      discount: 20
    },
    mixta: {
      name: 'Modalidad Mixta',
      icon: UserGroupIcon,
      description: 'Combinación virtual y presencial',
      discount: 10
    },
    workshop: {
      name: 'Workshop Empresarial',
      icon: ChartBarIcon,
      description: 'Sesión grupal con tu equipo',
      discount: 30
    }
  };

  const businessServices = [
    'Constitución de empresas',
    'Contratos comerciales',
    'Derecho societario',
    'Fusiones y adquisiciones',
    'Compliance corporativo',
    'Protección de datos',
    'Propiedad intelectual',
    'Derecho laboral empresarial'
  ];

  const handleAddToCart = () => {
    const selectedPkg = packages[selectedPackage];
    const selectedMod = modalities[selectedModality];
    
    const finalPrice = selectedPkg.price + (selectedPkg.price * selectedMod.discount / 100);
    
    const item = {
      id: `empresarial-${selectedPackage}-${selectedModality}-${Date.now()}`,
      type: 'consultation',
      category: 'empresarial',
      name: `${selectedPkg.name} - ${selectedMod.name}`,
      price: finalPrice,
      originalPrice: selectedPkg.price,
      duration: selectedPkg.duration,
      modality: selectedModality,
      features: selectedPkg.features,
      image: '/images/business-consultation.jpg'
    };

    addToCart(item);
    toast.success('Consulta empresarial agregada al carrito');
  };

  const handleBookNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-20"
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            >
              <BriefcaseIcon className="w-10 h-10" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold mb-2">Consulta Empresarial</h1>
              <p className="text-xl text-green-100">Soluciones legales integrales para tu empresa y negocio</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <BuildingOfficeIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Empresas Constituidas</h3>
              <p className="text-2xl font-bold">500+</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <ChartBarIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Contratos Comerciales</h3>
              <p className="text-2xl font-bold">1,500+</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
              <ClockIcon className="w-8 h-8 mb-2" />
              <h3 className="font-semibold">Años de Experiencia</h3>
              <p className="text-2xl font-bold">20+</p>
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
          <h2 className="text-3xl font-bold text-center mb-8">Servicios Empresariales Especializados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businessServices.map((service, index) => (
              <motion.div
                key={service}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-lg p-4 text-center shadow-lg border-2 border-green-200 hover:border-green-400 transition-all"
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
                    ? 'border-green-500 bg-green-50 shadow-lg' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <modality.icon className={`w-8 h-8 mb-3 ${selectedModality === key ? 'text-green-600' : 'text-gray-600'}`} />
                <h3 className="font-bold mb-2">{modality.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{modality.description}</p>
                {modality.discount > 0 && (
                  <p className="text-xs font-semibold text-green-600">
                    +{modality.discount}% valor agregado
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Package Selection */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Paquetes de Consultoría</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(packages).map(([key, pkg]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl shadow-xl p-8 border-2 ${
                  selectedPackage === key ? 'border-green-500' : 'border-gray-200'
                } ${pkg.popular ? 'ring-4 ring-green-200' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      PYMES
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    ${selectedModality && modalities[selectedModality] ? 
                      (pkg.price + (pkg.price * modalities[selectedModality].discount / 100)).toFixed(0) : 
                      pkg.price}
                  </div>
                  {selectedModality && modalities[selectedModality].discount > 0 && (
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
                      ? 'bg-green-600 text-white' 
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
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Contratar Ahora
          </motion.button>
        </motion.div>

        {/* Guarantee */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <StarIcon className="w-8 h-8 text-yellow-300" />
            <h3 className="text-2xl font-bold">Compromiso Empresarial</h3>
            <StarIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Entendemos los desafíos empresariales. Nuestro equipo multidisciplinario te acompaña 
            en cada etapa del crecimiento de tu negocio con soluciones legales eficientes.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EmpresarialConsultationPage;
