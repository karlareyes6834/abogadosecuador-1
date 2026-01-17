import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaClock, FaDollarSign, FaStar, FaCheckCircle, FaArrowRight, FaCalendarAlt, FaVideo, FaPhone, FaComments, FaRocket, FaFileAlt, FaBuilding } from 'react-icons/fa';

const ConsultationsPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos desde Supabase
    const loadConsultations = async () => {
      setLoading(true);
      try {
        // Datos de consultas desde Supabase (simulado)
        const consultationsData = [
          {
            id: 1,
            title: 'Consulta General',
            slug: 'general',
            description: 'Consulta legal general de 1 hora para resolver dudas jurídicas en cualquier área del derecho.',
            short_description: 'Asesoría legal general - 1 hora',
            price: 80,
            compare_at_price: 100,
            duration: '1 hora',
            type: 'general',
            features: [
              'Asesoría inmediata por cualquier medio',
              'Análisis completo de tu situación',
              'Recomendaciones específicas',
              'Documento resumen incluido',
              'Orientación sobre próximos pasos'
            ],
            popular: false,
            thumbnail: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800'
          },
          {
            id: 2,
            title: 'Consulta Penal',
            slug: 'penal',
            description: 'Consulta especializada en derecho penal: análisis de casos, estrategias de defensa, derechos del detenido.',
            short_description: 'Asesoría especializada en penal - 1 hora',
            price: 120,
            compare_at_price: null,
            duration: '1 hora',
            type: 'penal',
            features: [
              'Análisis especializado en casos penales',
              'Estrategias de defensa personalizadas',
              'Derechos durante la detención',
              'Procedimientos legales explicados',
              'Orientación sobre recursos legales'
            ],
            popular: true,
            thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800'
          },
          {
            id: 3,
            title: 'Consulta Civil',
            slug: 'civil',
            description: 'Consulta en temas civiles: contratos, herencias, divorcios, propiedades, obligaciones civiles.',
            short_description: 'Asesoría en derecho civil - 1 hora',
            price: 100,
            compare_at_price: null,
            duration: '1 hora',
            type: 'civil',
            features: [
              'Contratos civiles y mercantiles',
              'Herencias y sucesiones',
              'Divorcios y familia',
              'Propiedades e inmuebles',
              'Obligaciones y responsabilidad civil'
            ],
            popular: false,
            thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800'
          },
          {
            id: 4,
            title: 'Consulta Empresarial',
            slug: 'empresarial',
            description: 'Consulta legal para empresarios: constitución, contratos comerciales, derecho laboral empresarial.',
            short_description: 'Asesoría para empresas - 1 hora',
            price: 150,
            compare_at_price: null,
            duration: '1 hora',
            type: 'empresarial',
            features: [
              'Constitución y estructuración empresarial',
              'Contratos comerciales y laborales',
              'Propiedad intelectual',
              'Cumplimiento normativo',
              'Litigios empresariales'
            ],
            popular: true,
            thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
          },
          {
            id: 5,
            title: 'Consulta Digital/Online',
            slug: 'digital',
            description: 'Consulta completamente virtual por videollamada. Ideal para clientes fuera de la ciudad.',
            short_description: 'Consulta legal por videollamada - 1 hora',
            price: 90,
            compare_at_price: null,
            duration: '1 hora',
            type: 'digital',
            features: [
              'Consulta por videollamada',
              'Desde cualquier ubicación',
              'Horarios flexibles',
              'Grabación disponible',
              'Documentos digitales incluidos'
            ],
            popular: false,
            thumbnail: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800'
          }
        ];

        setConsultations(consultationsData);
      } catch (error) {
        console.error('Error al cargar consultas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultations();
  }, []);

  const getConsultationIcon = (type) => {
    switch (type) {
      case 'penal':
        return <FaCheckCircle className="text-red-500" />;
      case 'civil':
        return <FaFileAlt className="text-blue-500" />;
      case 'empresarial':
        return <FaBuilding className="text-green-500" />;
      case 'digital':
        return <FaVideo className="text-purple-500" />;
      default:
        return <FaComments className="text-gray-500" />;
    }
  };

  const getConsultationColor = (type) => {
    switch (type) {
      case 'penal':
        return 'from-red-500 to-red-600';
      case 'civil':
        return 'from-blue-500 to-blue-600';
      case 'empresarial':
        return 'from-green-500 to-green-600';
      case 'digital':
        return 'from-purple-500 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Consultas Legales | Abg. Wilson Ipiales</title>
        <meta name="description" content="Consulta legal inmediata con abogado especializado. Penal, civil, empresarial y digital. Asesoría profesional en 1 hora." />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Consultas Legales</h1>
            <p className="text-xl opacity-90 mb-8">Asesoría legal inmediata con abogado especializado</p>
            <div className="flex items-center justify-center space-x-8 text-lg">
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>5-30 min respuesta</span>
              </div>
              <div className="flex items-center">
                <FaRocket className="mr-2" />
                <span>Consulta inmediata</span>
              </div>
              <div className="flex items-center">
                <FaStar className="mr-2" />
                <span>99% satisfacción</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Consultations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {consultations.map((consultation) => (
            <motion.div
              key={consultation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${getConsultationColor(consultation.type)} p-6 text-white`}>
                <div className="flex items-center mb-4">
                  {getConsultationIcon(consultation.type)}
                  <h3 className="text-xl font-bold ml-3">{consultation.title}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold">${consultation.price}</span>
                    {consultation.compare_at_price && (
                      <span className="text-sm opacity-75 line-through ml-2">
                        ${consultation.compare_at_price}
                      </span>
                    )}
                  </div>
                  <span className="text-sm opacity-90">{consultation.duration}</span>
                </div>
                {consultation.popular && (
                  <div className="mt-2">
                    <span className="bg-white/20 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4">{consultation.short_description}</p>

                <ul className="space-y-2 mb-6">
                  {consultation.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/consultas/${consultation.slug}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  Agendar Consulta
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Necesitas una consulta inmediata?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nuestros abogados especializados están disponibles para resolver tus dudas legales
            de manera inmediata y profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/consultas/general"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaRocket className="mr-2" />
              Consulta Express (15 min)
            </Link>
            <Link
              to="/consultas/digital"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center justify-center"
            >
              <FaVideo className="mr-2" />
              Consulta por Videollamada
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ConsultationsPage;
