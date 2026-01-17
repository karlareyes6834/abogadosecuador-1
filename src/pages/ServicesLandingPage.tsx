/**
 * Página Principal de Servicios Legales Profesionales
 * Diseño moderno con todas las especialidades
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';

const ServicesLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const services = [
    {
      id: 'penal',
      title: 'Derecho Penal',
      category: 'criminal',
      description: 'Defensa legal especializada en procesos penales con estrategias personalizadas y efectivas.',
      details: [
        'Defensa en delitos contra la propiedad',
        'Defensa en delitos contra las personas',
        'Litigios en delitos económicos',
        'Representación en audiencias penales',
        'Medidas alternativas',
        'Recursos de apelación'
      ],
      icon: '⚖️',
      price: 180,
      duration: '2-6 meses',
      successRate: '92%',
      featured: true,
      slug: 'derecho-penal'
    },
    {
      id: 'civil',
      title: 'Derecho Civil',
      category: 'civil',
      description: 'Asesoría integral en contratos, propiedades, sucesiones y obligaciones civiles.',
      details: [
        'Elaboración y revisión de contratos',
        'Procesos de divorcios',
        'Juicios de inquilinato',
        'Trámites sucesorios',
        'Compraventa de inmuebles',
        'Responsabilidad civil'
      ],
      icon: '📜',
      price: 150,
      duration: '1-4 meses',
      successRate: '95%',
      featured: false,
      slug: 'derecho-civil'
    },
    {
      id: 'transito',
      title: 'Derecho de Tránsito',
      category: 'traffic',
      description: 'Especialistas en infracciones y accidentes de tránsito con alta tasa de éxito.',
      details: [
        'Impugnación de multas',
        'Defensa en accidentes',
        'Recuperación de puntos',
        'Trámites administrativos',
        'Asesoría en seguros',
        'Peritajes técnicos'
      ],
      icon: '🚗',
      price: 120,
      duration: '15-60 días',
      successRate: '88%',
      featured: true,
      slug: 'derecho-transito'
    },
    {
      id: 'comercial',
      title: 'Derecho Comercial',
      category: 'business',
      description: 'Servicios legales empresariales con visión estratégica de negocios.',
      details: [
        'Constitución de empresas',
        'Contratos mercantiles',
        'Propiedad intelectual',
        'Asesoría para startups',
        'Litigios comerciales',
        'Fusiones y adquisiciones'
      ],
      icon: '🏢',
      price: 220,
      duration: '1-8 meses',
      successRate: '94%',
      featured: true,
      slug: 'derecho-comercial'
    },
    {
      id: 'aduanero',
      title: 'Derecho Aduanero',
      category: 'aduanero',
      description: 'Asesoría y patrocinio en procesos aduaneros y de comercio exterior.',
      details: [
        'Trámites y litigios aduaneros',
        'Regularización de mercancías',
        'Defensa en infracciones aduaneras',
        'Asesoría en importaciones y exportaciones',
        'Gestión frente a autoridades de control',
        'Optimización de riesgos aduaneros'
      ],
      icon: '🚢',
      price: 200,
      duration: '1-6 meses',
      successRate: '90%',
      featured: false,
      slug: 'derecho-aduanero'
    },
    {
      id: 'laboral',
      title: 'Derecho Laboral',
      category: 'labor',
      description: 'Defensa de derechos laborales y asesoría empresarial en temas de trabajo.',
      details: [
        'Despidos injustificados',
        'Acoso laboral',
        'Contratos colectivos',
        'Normativa laboral',
        'Mediación de conflictos',
        'Auditorías laborales'
      ],
      icon: '👔',
      price: 160,
      duration: '1-5 meses',
      successRate: '89%',
      featured: false,
      slug: 'derecho-laboral'
    },
    {
      id: 'familia',
      title: 'Derecho de Familia',
      category: 'family',
      description: 'Asesoría sensible y profesional en asuntos familiares y de pareja.',
      details: [
        'Divorcios y separaciones',
        'Pensiones alimenticias',
        'Custodia de menores',
        'Régimen de visitas',
        'Violencia intrafamiliar',
        'Adopciones'
      ],
      icon: '👨‍👩‍👧‍👦',
      price: 140,
      duration: '2-6 meses',
      successRate: '91%',
      featured: false,
      slug: 'derecho-familia'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos los Servicios' },
    { id: 'criminal', name: 'Penal' },
    { id: 'civil', name: 'Civil' },
    { id: 'traffic', name: 'Tránsito' },
    { id: 'business', name: 'Comercial' },
    { id: 'aduanero', name: 'Aduanero' },
    { id: 'labor', name: 'Laboral' },
    { id: 'family', name: 'Familia' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleAddToCart = (service: any) => {
    const cartItem = {
      id: service.id,
      name: service.title,
      price: service.price,
      type: 'service' as const,
      category: service.title,
      image: `/images/services/${service.id}.jpg`,
      shortDescription: service.description,
      priceInfo: `$${service.price}`,
      slug: service.slug
    };
    
    addToCart(cartItem, 'service');
    toast.success(`${service.title} agregado al carrito`);
  };

  const handleViewDetails = (service: any) => {
    navigate(`/servicios/${service.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_minmax(0,1fr)] gap-10 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Servicios Legales
                <span className="block text-blue-300">Profesionales</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto lg:mx-0">
                Defendemos sus derechos con excelencia, experiencia y resultados comprobados
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="mr-2">🏆</span>
                  <span>+15 años de experiencia</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="mr-2">👥</span>
                  <span>+500 casos exitosos</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                  <span className="mr-2">⭐</span>
                  <span>92% tasa de éxito</span>
                </div>
              </div>
            </div>

            {/* Icono 3D de martillo de juez en el hero, solo en pantallas grandes */}
            <div className="hidden lg:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="pointer-events-none absolute -top-8 -right-4 h-40 w-40 rounded-full bg-yellow-400/30 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 -left-6 h-40 w-40 rounded-full bg-blue-500/40 blur-3xl" />

                <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-black/25 shadow-2xl backdrop-blur-md">
                  <model-viewer
                    src="/models/martillo-legal.glb"
                    alt="Martillo de juez representando decisiones judiciales"
                    camera-controls
                    auto-rotate
                    auto-rotate-delay="1500"
                    exposure="0.9"
                    shadow-intensity="1"
                    interaction-prompt="none"
                    className="w-full h-64"
                    style={{ background: 'radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 65%)' }}
                  ></model-viewer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-t-4 hover:shadow-2xl transition-all duration-300 ${
                  service.featured ? 'border-yellow-400 ring-2 ring-yellow-100 dark:ring-yellow-900' : 'border-blue-500'
                }`}
              >
                {service.featured && (
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-center py-2 font-semibold">
                    ⭐ SERVICIO DESTACADO
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-6xl text-center mb-6">
                    {service.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    {service.description}
                  </p>

                  {/* Service Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-2xl mb-1">⏱️</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Duración</p>
                      <p className="font-semibold text-sm dark:text-white">{service.duration}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-2xl mb-1">✅</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Éxito</p>
                      <p className="font-semibold text-sm dark:text-white">{service.successRate}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                      <p className="text-2xl mb-1">💰</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Desde</p>
                      <p className="font-semibold text-sm dark:text-white">${service.price}</p>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Incluye:</h4>
                    <ul className="space-y-2">
                      {service.details.slice(0, 4).map((detail, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <span className="text-green-500 mt-0.5 mr-2 flex-shrink-0">✓</span>
                          <span className="text-gray-600 dark:text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6 text-center">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      ${service.price}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Honorarios desde</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddToCart(service)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <span className="mr-2">🛒</span>
                      Agregar al Carrito
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleViewDetails(service)}
                        className="text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => navigate('/checkout')}
                        className="text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Consultar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Nuestro compromiso con la excelencia nos distingue en el campo legal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🏆',
                title: 'Experiencia Probada',
                description: 'Más de 15 años de trayectoria profesional con resultados exitosos'
              },
              {
                icon: '👥',
                title: 'Atención Personalizada',
                description: 'Cada caso recibe atención directa y estrategias adaptadas'
              },
              {
                icon: '⚡',
                title: 'Respuesta Rápida',
                description: 'Atención inmediata a consultas urgentes las 24 horas'
              },
              {
                icon: '✅',
                title: 'Resultados Garantizados',
                description: 'Alta tasa de éxito en todos nuestros casos'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-200 bg-gray-50 dark:bg-gray-700"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Necesita Asesoría Legal Profesional?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Contáctenos ahora y reciba una consulta gratuita para evaluar su caso
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="tel:+593988835269"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-colors duration-200"
            >
              <span className="mr-2">📞</span>
              Llamar Ahora
            </a>
            
            <a
              href="https://wa.me/593988835269"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-colors duration-200"
            >
              <span className="mr-2">💬</span>
              WhatsApp
            </a>
            
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg shadow-lg transition-colors duration-200"
            >
              <span className="mr-2">✉️</span>
              Consulta Gratuita
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesLandingPage;
